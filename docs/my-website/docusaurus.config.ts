import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "AI Planner Documentation",
  tagline: "Complete guide for AI Planner web and mobile applications",
  favicon: "img/favicon.ico",

  future: {
    v4: true,
  },

  url: "https://planemy.com",
  baseUrl: "/",

  organizationName: "ksarpe",
  projectName: "aiplanner-app",

  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en", "pl"],
    localeConfigs: {
      en: {
        label: "English",
      },
      pl: {
        label: "Polski",
      },
    },
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/ksarpe/ohana-mgnmt/tree/main/docs/my-website/",
          routeBasePath: "/",
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/aiplanner-social-card.jpg",
    colorMode: {
      defaultMode: "dark",
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "AI Planner",
      logo: {
        alt: "AI Planner Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "docs",
          position: "left",
          label: "Docs",
        },
        {
          type: "docSidebar",
          sidebarId: "api",
          position: "left",
          label: "API",
        },
        {
          type: "localeDropdown",
          position: "right",
        },
        {
          href: "https://github.com/ksarpe/ohana-mgnmt",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Documentation",
          items: [
            {
              label: "Getting Started",
              to: "/getting-started",
            },
            {
              label: "Architecture",
              to: "/architecture",
            },
            {
              label: "API Integration",
              to: "/api-integration",
            },
          ],
        },
        {
          title: "Features",
          items: [
            {
              label: "Tasks",
              to: "/features/tasks",
            },
            {
              label: "Shopping",
              to: "/features/shopping",
            },
            {
              label: "Calendar",
              to: "/features/calendar",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/ksarpe/ohana-mgnmt",
            },
            {
              label: "Railway (Backend)",
              href: "https://aiplanner-back-production.up.railway.app",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} AI Planner. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ["typescript", "javascript", "bash", "json", "jsx", "tsx"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
