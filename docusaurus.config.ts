import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Programación Multimedia y Dispositivos Móviles',
  tagline: 'Página del módulo con la documentación y los ejemplos del curso',
  favicon: 'img/favicon_io/favicon32.png',

  // Set the production url of your site here
  url: 'https://resuacode.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/pmdm-ds/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'resuacode', // Usually your GitHub org/user name.
  projectName: 'pmdm-ds', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'PMDM',
      logo: {
        alt: 'My Site Logo',
        src: 'img/main/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Inicio',
        },
        {
          href: 'https://github.com/resuacode',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Inicio',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Más',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/resuacode',
            },
            {
              label: 'YouTube',
              href: 'https://www.youtube.com/@resuacode',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} resuacode by Daniel Resúa.<br>Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['java', 'kotlin', 'csharp'],
    },
  } satisfies Preset.ThemeConfig,

  plugins:[
  [
    require.resolve("@easyops-cn/docusaurus-search-local"),
    ({
       hashed: true,
     }),
  ],
],
};


export default config;
