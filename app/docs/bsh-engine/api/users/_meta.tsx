import type { MetaRecord } from 'nextra';
import { EndpointTitle } from '../../../../../components';

export default {
  'init-user': <EndpointTitle method='POST' title='Initialize User'/>,
  'invite-user': <EndpointTitle method='POST' title='Invite User'/>,
  'get-current-user': <EndpointTitle method='GET' title='Get Current User'/>,
  'update-profile': <EndpointTitle method='PUT' title='Update Profile'/>,
  'update-password': <EndpointTitle method='PUT' title='Update Password'/>,
  'update-picture': <EndpointTitle method='POST' title='Update Picture'/>,
} satisfies MetaRecord;
