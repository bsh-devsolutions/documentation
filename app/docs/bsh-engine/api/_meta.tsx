import type { MetaRecord } from 'nextra';
import { Title } from "../../../../components";

export default {
  'persistence-id': 'Persistence ID',
  'authentication': 'Authentication',
  'entities': 'Entities',
  'tenants': <Title title='Tenants' badge='new' />,
  'users': 'Users',
  'files': 'Files',
  'mailing': 'Mailing',
  'api-keys': 'API Keys',
  'settings': 'Settings',
  'plugins': 'Plugins',
  'api-docs': <Title title='API Docs' badge='planned' />,
  'rate-limit': <Title title='Rate Limit' badge='planned' />,
} satisfies MetaRecord
