import { User } from '@uoa-discords/shared-utils';
import discordIcon from '../images/discordIcon.svg';

export interface DiscordIconReturn {
    src: string;
    alt: string;
}

function getDiscordIcon(user: User): DiscordIconReturn {
    if (user.avatar) {
        return {
            src: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
            alt: `${user.username}'s Discord profile`,
        };
    }

    return {
        src: discordIcon,
        alt: `Discord logo`,
    };
}

export default getDiscordIcon;
