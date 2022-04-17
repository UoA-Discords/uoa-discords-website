import { Invite, RegisteredServer } from '@uoa-discords/shared-utils';

export default interface LoadedGuild extends RegisteredServer {
    invite: Invite;
}
