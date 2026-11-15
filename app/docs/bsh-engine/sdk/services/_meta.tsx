import type { MetaRecord } from "nextra";
import {Title} from "../../../../../components";

export default {
    'auth': 'Authentication',
    'auth-sessions': <Title title='Auth Sessions' badge='new' />,
    'signing-keys': <Title title='Signing Keys' badge='new' />,
    'entities': 'Entities',
    'users': 'Users',
    'tenants': 'Tenants',
    'status': 'Status',
    'image': 'Image',
    'mailing': 'Mailing',
    'api-key': 'API Key',
    'settings': 'Settings',
    'caching': 'Caching',
    'plugin': 'Plugins',
    'utils': {
        title: 'Utils',
        display: 'hidden',
    },
} satisfies MetaRecord;
