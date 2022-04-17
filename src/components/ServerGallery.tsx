import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { getAllGuilds } from '../redux/slices/guildManager';
import ServerCard from './ServerCard';

const ServerGallery = () => {
    const servers = useSelector(getAllGuilds);

    return (
        <Grid container spacing={2}>
            {Object.keys(servers).map((e, i) => (
                <Grid item key={e} xs={12} md={6} lg={4}>
                    <ServerCard server={servers[e]} index={i} />
                </Grid>
            ))}
        </Grid>
    );
};

export default ServerGallery;
