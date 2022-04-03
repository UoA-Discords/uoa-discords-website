import { Guild } from '@uoa-discords/uoa-discords-shared-types/dist';

export default interface ExtendedGuild extends Guild {
    isAdmin: boolean;
    isBlacklisted: boolean;
    isDuplicate: boolean;
    isValid: boolean;
}
