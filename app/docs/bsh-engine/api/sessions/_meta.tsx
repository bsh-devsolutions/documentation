import type { MetaRecord } from 'nextra';
import { EndpointTitle } from '../../../../../components';

export default {
  'current': <EndpointTitle method='GET' title='Current Session' />,
  'get': <EndpointTitle method='GET' title='Get Session' />,
  'revoke': <EndpointTitle method='DELETE' title='Revoke' />,
} satisfies MetaRecord;
