import { Button, Container, Grid, Modal, Stack, Typography } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedGuild, setSelectedGuildId } from '../../redux/slices/main';
import LoadedGuild from '../../types/LoadedGuild';
import discordIcon from '../../images/discordIcon.svg';
import UserCard from '../UserCard';

import AddBoxIcon from '@mui/icons-material/AddBox';
import CheckIcon from '@mui/icons-material/Check';
import LinkIcon from '@mui/icons-material/Link';
import moment from 'moment';

export interface SelectedGuildProps {
    guild: LoadedGuild;
}

const style = {
    position: 'absolute',
    top: '10%',
    left: '10%',
    right: '10%',
    bgcolor: 'background.paper',
    border: '2px solid gray',
    boxShadow: 24,
    p: 4,
};

const SelectedGuild = ({ guild }: SelectedGuildProps) => {
    const dispatch = useDispatch();
    const handleExit = useCallback(() => {
        dispatch(setSelectedGuildId(guild._id));
    }, [dispatch, guild._id]);

    const guildImageIcon = useMemo<string>(() => {
        if (guild.invite.guild?.icon) {
            return `https://cdn.discordapp.com/icons/${guild._id}/${guild.invite.guild.icon}`;
        }
        return discordIcon;
    }, [guild._id, guild.invite.guild?.icon]);

    return (
        <Modal open onClose={handleExit}>
            <Container sx={style} maxWidth="md">
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={6} md={4} sx={{ height: 'fit-content' }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <img
                                style={{ width: '128px' }}
                                src={guildImageIcon}
                                className="discordProfilePicture"
                                alt="Server icon"
                            />
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={8}>
                        <Typography variant="h3" gutterBottom>
                            {guild.invite.guild?.name || guild._id}
                        </Typography>
                        <Stack direction="row" spacing={3} alignItems="center">
                            <a
                                href={`https://discord.gg/${guild.inviteCode}`}
                                target="_blank"
                                style={{ textDecoration: 'none' }}
                                rel="noreferrer"
                            >
                                <Button
                                    variant="outlined"
                                    size="large"
                                    color="secondary"
                                    startIcon={<img src={discordIcon} alt="Discord logo" style={{ width: '20px' }} />}
                                >
                                    {guild.inviteCode}
                                </Button>
                            </a>
                            <Typography color="gray">
                                {guild.invite.approximate_member_count} Members (
                                <span style={{ color: 'lightgreen' }}>{guild.invite.approximate_presence_count}</span>{' '}
                                Online)
                            </Typography>
                        </Stack>
                    </Grid>
                    {guild.tags && (
                        <Grid item xs={12} sx={{ pb: 2 }}>
                            <Typography color="gray">Tags ({guild.tags.length})</Typography>
                            <Grid container spacing={3}>
                                {guild.tags.map((tag) => (
                                    <Grid item key={tag}>
                                        <Typography color="gray" key={tag}>
                                            {tag}
                                        </Typography>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    )}
                    <Grid item xs={6} md={4}>
                        <Stack>
                            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="flex-start">
                                <AddBoxIcon />
                                <span>Added by</span>
                                <UserCard user={guild.addedBy}>
                                    <span className="hoverableUserName">{guild.addedBy.username}</span>
                                </UserCard>
                            </Stack>
                            <Typography color="gray" textAlign="center">
                                {moment(guild.addedAt).fromNow()}
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <Stack>
                            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="flex-start">
                                <CheckIcon />
                                <span>Approved by</span>
                                <UserCard user={guild.approvedBy}>
                                    <span className="hoverableUserName">{guild.approvedBy.username}</span>
                                </UserCard>
                            </Stack>
                            <Typography color="gray" textAlign="center">
                                {moment(guild.approvedAt).fromNow()}
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="flex-start">
                            <LinkIcon />
                            <span>Invite by</span>
                            {guild.invite.inviter !== undefined ? (
                                <UserCard user={guild.invite.inviter}>
                                    <span className="hoverableUserName">{guild.invite.inviter.username}</span>
                                </UserCard>
                            ) : (
                                <span>n/a</span>
                            )}
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Modal>
    );
};

const SelectedGuildWrapper = () => {
    const selectedGuild = useSelector(getSelectedGuild);

    if (selectedGuild) return <SelectedGuild guild={selectedGuild} />;
    return <></>;
};

export default SelectedGuildWrapper;
