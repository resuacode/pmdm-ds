#!/usr/bin/env node
/**
 * Genera PDF por sección (Android / Videojuegos) a partir de los MDX.
 * Salida: static/pdf/android.pdf y static/pdf/videojuegos.pdf
 */
import {execSync} from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {mdToPdf} from 'md-to-pdf';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'static', 'pdf');

const SECTIONS = [
  {
    id: 'android',
    title: 'PMDM — Android (Kotlin y Jetpack Compose)',
    dir: path.join(root, 'docs', 'Android'),
    outFile: 'android.pdf',
  },
  {
    id: 'videojuegos',
    title: 'PMDM — Videojuegos (Unity 6 y C#)',
    dir: path.join(root, 'docs', 'Videojuegos'),
    outFile: 'videojuegos.pdf',
  },
];

function getCommitShort() {
  if (process.env.GITHUB_SHA) {
    return process.env.GITHUB_SHA.slice(0, 7);
  }
  try {
    return execSync('git rev-parse --short HEAD', {
      cwd: root,
      encoding: 'utf8',
    }).trim();
  } catch {
    return 'unknown';
  }
}

function naturalCompare(a, b) {
  return a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'});
}

async function listMdxFiles(dir) {
  const results = [];

  async function walk(current) {
    const entries = await fs.readdir(current, {withFileTypes: true});
    entries.sort((x, y) => naturalCompare(x.name, y.name));
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
        results.push(full);
      }
    }
  }

  await walk(dir);

  // Índice (0-indice) primero si existe
  results.sort((a, b) => {
    const aIndex = path.basename(a).startsWith('0-indice') ? 0 : 1;
    const bIndex = path.basename(b).startsWith('0-indice') ? 0 : 1;
    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }
    return naturalCompare(path.relative(dir, a), path.relative(dir, b));
  });

  return results;
}

function preprocessMdx(source, filePath) {
  let text = source.replace(/\r\n/g, '\n');

  // Frontmatter YAML
  text = text.replace(/^---\n[\s\S]*?\n---\n/, '');

  // import / export
  text = text.replace(/^\s*import\s.+;?\s*$/gm, '');
  text = text.replace(/^\s*export\s.+;?\s*$/gm, '');

  // iframes → enlace
  text = text.replace(/<iframe\b[^>]*\bsrc=["']([^"']+)["'][^>]*><\/iframe>/gi, (_, src) => {
    return `\n\n[Vídeo / recurso embebido](${src})\n\n`;
  });
  text = text.replace(/<iframe\b[^>]*\/>/gi, '');

  // JSX suelto frecuente (componentes propios ya importados se habrán quitado;
  // limpiar posibles restos de etiquetas auto-cerradas desconocidas simples)
  text = text.replace(/<\/?[A-Z][A-Za-z0-9]*\b[^>]*\/?>/g, '');

  // Admonitions :::tip[Título] ... :::
  text = text.replace(
    /:::(tip|warning|info|note|danger|nota)\b(?:\[([^\]]*)\])?\n([\s\S]*?):::/gi,
    (_, type, title, body) => {
      const label = (title && title.trim()) || type.toUpperCase();
      const quoted = body
        .trim()
        .split('\n')
        .map((line) => `> ${line}`)
        .join('\n');
      return `\n\n> **${label}**\n>\n${quoted}\n\n`;
    },
  );

  // Rutas de imagen relativas → absolutas file:// para Puppeteer
  const fileDir = path.dirname(filePath);
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
    if (/^(https?:|data:|file:)/i.test(src)) {
      return match;
    }
    const abs = path.resolve(fileDir, src);
    return `![${alt}](file://${abs})`;
  });

  // Colapsar líneas en blanco excesivas
  text = text.replace(/\n{3,}/g, '\n\n').trim();
  return text;
}

function extractHeadings(markdown) {
  const headings = [];
  const lines = markdown.split('\n');
  let inFence = false;
  for (const line of lines) {
    if (/^```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) {
      continue;
    }
    const match = /^(#{1,3})\s+(.+?)\s*$/.exec(line);
    if (match) {
      headings.push({
        level: match[1].length,
        title: match[2].replace(/#+$/, '').trim(),
      });
    }
  }
  return headings;
}

function ensureAnchoredHeading(body, anchorId, fallbackTitle) {
  const headings = extractHeadings(body);
  const h1 = headings.find((h) => h.level === 1);
  const title = h1?.title || fallbackTitle;
  if (h1) {
    // Ancla antes del primer H1 existente
    return {
      title,
      body: body.replace(/^#\s+.+$/m, `<a id="${anchorId}"></a>\n\n# ${title}`),
    };
  }
  return {
    title,
    body: `<a id="${anchorId}"></a>\n\n# ${title}\n\n${body}`,
  };
}

function buildTocMarkdown(entries) {
  const lines = ['## Índice', ''];
  let chapter = 0;
  for (const entry of entries) {
    if (entry.level === 1) {
      chapter += 1;
      lines.push(`${chapter}. [${entry.title}](#${entry.id})`);
    } else if (entry.level === 2) {
      lines.push(`    - [${entry.title}](#${entry.id})`);
    }
  }
  lines.push('', '---', '');
  return lines.join('\n');
}

async function buildSectionMarkdown(section, commit, generatedAt) {
  const files = await listMdxFiles(section.dir);
  const chapters = [];
  const tocEntries = [];
  let chapterNum = 0;

  for (const file of files) {
    const rel = path.relative(section.dir, file);
    const raw = await fs.readFile(file, 'utf8');
    let body = preprocessMdx(raw, file);
    if (!body) {
      continue;
    }

    chapterNum += 1;
    const fallbackTitle = path.basename(file, '.mdx').replace(/^\d+-/, '').replace(/-/g, ' ');
    const chapterId = `cap-${String(chapterNum).padStart(3, '0')}`;
    const anchored = ensureAnchoredHeading(body, chapterId, fallbackTitle);
    body = anchored.body;

    tocEntries.push({level: 1, title: anchored.title, id: chapterId});

    // Subapartados (##) con anclas propias para el índice
    const subHeadings = extractHeadings(body).filter((h) => h.level === 2);
    let subIdx = 0;
    for (const sub of subHeadings) {
      subIdx += 1;
      const subId = `${chapterId}-${subIdx}`;
      const alreadyAnchored = body.includes(`id="${subId}"`);
      if (!alreadyAnchored) {
        const escaped = sub.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`^##\\s+${escaped}\\s*$`, 'm');
        if (re.test(body)) {
          body = body.replace(re, `<a id="${subId}"></a>\n\n## ${sub.title}`);
          tocEntries.push({level: 2, title: sub.title, id: subId});
        }
      }
    }

    chapters.push(`<!-- source: ${rel} -->\n\n${body}`);
  }

  const parts = [
    `# ${section.title}`,
    '',
    `Generado automáticamente el **${generatedAt}** (commit \`${commit}\`).`,
    '',
    'Documento de apoyo del módulo PMDM. Algunos recursos embebidos (vídeos) se sustituyen por enlaces.',
    '',
    '---',
    '',
    buildTocMarkdown(tocEntries),
    chapters.join('\n\n---\n\n'),
    '',
  ];

  return parts.join('\n');
}

async function generatePdf(section, markdown, commit) {
  const dest = path.join(outDir, section.outFile);
  console.log(`→ Generando ${section.outFile} (${markdown.length} caracteres)…`);

  const pdf = await mdToPdf(
    {content: markdown},
    {
      dest,
      pdf_options: {
        format: 'A4',
        margin: {
          top: '18mm',
          right: '14mm',
          bottom: '18mm',
          left: '14mm',
        },
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: '<span></span>',
        footerTemplate: `
          <div style="font-size:9px;width:100%;padding:0 14mm;color:#555;display:flex;justify-content:space-between;">
            <span>PMDM · ${section.id} · ${commit}</span>
            <span>Página <span class="pageNumber"></span> / <span class="totalPages"></span></span>
          </div>
        `,
      },
      css: `
        body {
          font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
          font-size: 11pt;
          line-height: 1.45;
          color: #1a2e26;
        }
        h1 { font-size: 20pt; color: #0c1f17; page-break-before: avoid; }
        h2 { font-size: 15pt; color: #145c3a; margin-top: 1.4em; }
        h3 { font-size: 13pt; color: #145c3a; }
        /* El índice va justo tras la portada */
        h2:first-of-type {
          page-break-after: avoid;
        }
        ul, ol { margin-top: 0.4em; }
        li { margin: 0.2em 0; }
        li a { text-decoration: none; }
        pre, code {
          font-family: "Cascadia Code", "Fira Code", Consolas, monospace;
          font-size: 9pt;
        }
        pre {
          background: #f0f4f2;
          padding: 0.75em 1em;
          border-radius: 4px;
          overflow-x: auto;
          white-space: pre-wrap;
          word-break: break-word;
        }
        blockquote {
          border-left: 3px solid #e8a317;
          margin-left: 0;
          padding: 0.25em 0 0.25em 0.9em;
          color: #2a3b34;
        }
        img { max-width: 100%; }
        a { color: #145c3a; }
        hr { border: none; border-top: 1px solid #c5d4cc; margin: 1.5em 0; }
      `,
      launch_options: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    },
  );

  if (!pdf || !pdf.filename) {
    throw new Error(`No se pudo generar ${section.outFile}`);
  }
  console.log(`  OK ${dest}`);
}

async function main() {
  await fs.mkdir(outDir, {recursive: true});
  const commit = getCommitShort();
  const generatedAt = new Date().toISOString().slice(0, 10);

  for (const section of SECTIONS) {
    const markdown = await buildSectionMarkdown(section, commit, generatedAt);
    await generatePdf(section, markdown, commit);
  }

  console.log('PDF de secciones generados en static/pdf/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
