import type { MetaRecord } from 'nextra';
import { EndpointTitle } from '../../../../../components';

export default {
  'rotate': <EndpointTitle method='POST' title='Rotate' />,
  'expire': <EndpointTitle method='POST' title='Expire' />,
} satisfies MetaRecord;
