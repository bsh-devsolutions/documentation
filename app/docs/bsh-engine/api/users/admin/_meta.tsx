import type { MetaRecord } from 'nextra';
import {EndpointTitle} from "../../../../../../components";

export default {
  'activate-account': <EndpointTitle method='POST' title='Activate Account' />,
  'resend-activation-email': <EndpointTitle method='POST' title='Resend Activation Email' />,
  'forget-password': <EndpointTitle method='POST' title='Forget Password' />,
} satisfies MetaRecord;
