import type { MetaRecord } from 'nextra';
import { Title } from '../../../../components';

export default {
  'tenants': <Title title='Tenants' badge='new' />,
  'users': 'Users',
  'roles': 'Roles',
  'policies': 'Policies',
  'api-keys': 'API Keys',
} satisfies MetaRecord;
