import type { MetaRecord } from 'nextra';
import { EndpointTitle } from '../../../../../components';

export default {
  'install-zip': <EndpointTitle method='POST' title='Install from ZIP'/>,
  'install-core': <EndpointTitle method='POST' title='Install Core Plugin'/>
} satisfies MetaRecord;
