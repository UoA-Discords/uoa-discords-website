import { Stack, Tooltip, Typography } from '@mui/material';
import { Developers, Verifiers } from '@uoa-discords/shared-utils';

import VerifiedIcon from '@mui/icons-material/Verified';
import GitHubIcon from '@mui/icons-material/GitHub';
import FavoriteIcon from '@mui/icons-material/Favorite';

function useBadges(userId: string): JSX.Element {
    const isVerifier = Verifiers.has(userId);
    const isDeveloper = Developers.has(userId);
    const isOwner = userId === '240312568273436674';

    if (!isVerifier && !isDeveloper && !isOwner) return <></>;

    return (
        <Stack direction="row" spacing={1}>
            {isOwner && (
                <Tooltip title={<Typography>Site owner</Typography>} arrow>
                    <FavoriteIcon htmlColor="gold" />
                </Tooltip>
            )}
            {isVerifier && (
                <Tooltip title={<Typography>Server verifier</Typography>} arrow>
                    <VerifiedIcon htmlColor="lightgreen" />
                </Tooltip>
            )}
            {isDeveloper && (
                <Tooltip title={<Typography>Developer</Typography>} arrow>
                    <GitHubIcon color="secondary" />
                </Tooltip>
            )}
        </Stack>
    );
}

export default useBadges;
