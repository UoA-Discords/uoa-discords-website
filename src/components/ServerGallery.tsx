import { Grid } from '@mui/material';
import sampleData from '../sampleData';
import ServerCard from './ServerCard';

const ServerGallery = () => {
    return (
        <Grid container spacing={2}>
            {sampleData.map((e, i) => (
                <Grid item key={i} xs={12} md={6} lg={4} xl={3}>
                    <ServerCard server={e} key={i} />
                </Grid>
            ))}
        </Grid>
    );
};

export default ServerGallery;
