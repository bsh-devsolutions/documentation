import type { MetaRecord } from 'nextra';
import { EndpointTitle } from '../../../../../components';

export default {
  'assign-admin': <EndpointTitle method='PUT' title='Assign Admin' />,
  'activate': <EndpointTitle method='POST' title='Activate' />,
  'deactivate': <EndpointTitle method='POST' title='Deactivate' />,
  'block': <EndpointTitle method='POST' title='Block' />,
} satisfies MetaRecord;
