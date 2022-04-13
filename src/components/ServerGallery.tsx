import { Grid } from '@mui/material';
import { PublicRegisteredGuild } from '@uoa-discords/shared-utils';
import ServerCard from './ServerCard';

export interface ServerGalleryProps {
    servers: PublicRegisteredGuild[];
}

const ServerGallery = ({ servers }: ServerGalleryProps) => {
    return (
        <Grid container spacing={2}>
            {servers.map((e, i) => (
                <Grid item key={i} xs={12} md={6} lg={4} xl={3}>
                    <ServerCard server={e} key={i} />
                </Grid>
            ))}
        </Grid>
    );
};

export default ServerGallery;
