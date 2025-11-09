import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/project-structure',
        'getting-started/first-changes',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      collapsed: false,
      items: [
        'architecture/overview',
        'architecture/monorepo',
        'architecture/data-layer',
        'architecture/api-layer',
        'architecture/state-management',
      ],
    },
    {
      type: 'category',
      label: 'Features',
      items: [
        'features/authentication',
        'features/tasks',
        'features/shopping',
        'features/calendar',
        'features/labels',
        'features/payments',
      ],
    },
    {
      type: 'category',
      label: 'Development',
      items: [
        'development/conventions',
        'development/styling',
        'development/i18n',
        'development/testing',
      ],
    },
    {
      type: 'category',
      label: 'Deployment',
      items: [
        'deployment/environment-config',
        'deployment/railway',
        'deployment/mobile',
      ],
    },
  ],
  api: [
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/overview',
        'api/authentication',
        'api/tasks',
        'api/shopping',
        'api/calendar',
        'api/labels',
      ],
    },
  ],
};

export default sidebars;

