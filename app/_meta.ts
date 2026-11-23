import type { MetaRecord } from 'nextra'

export default {
  '*': {
    type: 'page',
    theme: {
      timestamp: true,
      pagination: true,
      copyPage: false
    }
  },
  'index': {
    title: 'Home',
    display: 'hidden',
    theme: {
      layout: 'full',
      typesetting: 'default',
    }
  },
  'Bsh Engine': {
    title: 'Bsh Engine',
    href: '/docs/bsh-engine',
  },
  'Bsh Engine SDK': {
    title: 'Engine SDK',
    href: '/docs/bsh-engine/sdk',
  },
  'Bsh Engine API': {
    title: 'API Reference',
    href: '/docs/bsh-engine/api',
  },
  'docs': {
    type: 'doc',
    display: 'children',
  }
} satisfies MetaRecord
