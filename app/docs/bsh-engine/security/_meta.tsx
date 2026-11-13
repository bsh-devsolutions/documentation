import type { MetaRecord } from 'nextra';
import {Title} from "../../../../components";

export default {
  'tenants': 'Tenants',
  'users': 'Users',
  'roles': 'Roles',
  'policies': 'Policies',
  'api-keys': 'API Keys',
  'sessions': <Title title='Sessions' badge='new' />,
} satisfies MetaRecord;
