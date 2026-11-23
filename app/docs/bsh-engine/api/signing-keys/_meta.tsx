import type { MetaRecord } from 'nextra';
import { EndpointTitle } from '../../../../../components';

export default {
  'rotate': <EndpointTitle method='POST' title='Rotate' />,
  'expire': <EndpointTitle method='POST' title='Expire' />,
  'jwks': <EndpointTitle method='GET' title='JWKS' />,
} satisfies MetaRecord;
