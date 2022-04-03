import {
    Button,
    CircularProgress,
    Container,
    FormControlLabel,
    FormGroup,
    Grid,
    Modal,
    Stack,
    Switch,
    Typography,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import useDiscordAccess, { FullDiscordAccessResponse } from '../../hooks/useDiscordAccess';
import useUser, { FullUserResponse } from '../../hooks/useUser';
import ExtendedGuild from '../../types/ExtendedGuild';
import HomeButton from '../HomeButton';
import AddGuildCard from './AddGuildCard';
import SelectedGuildModal from './SelectedGuildModal';

interface AddGuildProps {
    userCookie: FullUserResponse;
    discordCookie: FullDiscordAccessResponse;
}

const AddGuild = ({ userCookie, discordCookie }: AddGuildProps) => {
    const [allGuilds, setAllGuilds] = useState<ExtendedGuild[]>([]);
    const [validGuilds, setValidGuilds] = useState<ExtendedGuild[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<{ during: string; message: string } | null>(null);

    const [isFiltering, setIsFiltering] = useState<boolean>(false);
    const guildsToShow = useMemo<ExtendedGuild[]>(() => {
        if (isFiltering) return validGuilds;
        else return allGuilds;
    }, [allGuilds, isFiltering, validGuilds]);

    const [selectedGuild, setSelectedGuild] = useState<ExtendedGuild | null>(null);

    const handleSelect = useCallback((guild: ExtendedGuild | null) => {
        return () => setSelectedGuild(guild);
    }, []);

    // initial guild fetch
    useEffect(() => {
        api.getDiscordGuilds(discordCookie.discordAccess.access_token)
            .then(({ data, status, statusText }) => {
                if (status !== 200) {
                    console.warn(
                        `Got status code ${status} on token refresh attempt with message: ${statusText}`,
                        data,
                    );
                }

                data.sort((a, b) => a.name.localeCompare(b.name));
                const newGuilds: ExtendedGuild[] = data.map((guild) => {
                    const isAdmin = (parseInt(guild.permissions, 10) & (1 << 3)) !== 0;
                    const isBlacklisted = false;
                    const isDuplicate = false;

                    return {
                        ...guild,
                        isAdmin,
                        isBlacklisted,
                        isDuplicate,
                        isValid: isAdmin && !isBlacklisted && !isDuplicate,
                    };
                });

                setAllGuilds(newGuilds);
                setValidGuilds(
                    newGuilds.filter((guild) => guild.isAdmin && !guild.isBlacklisted && !guild.isDuplicate),
                );
            })
            .catch((error) => {
                setError({
                    during: `fetching your Discord servers:`,
                    message: error instanceof Error ? error.message : 'Unknown',
                });
            })
            .finally(() => setIsLoading(false));
    }, [discordCookie.discordAccess.access_token]);

    if (isLoading) {
        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: '100vh' }}>
                <Typography variant="h3" gutterBottom>
                    Fetching Servers
                </Typography>
                <CircularProgress size={80} />
            </Stack>
        );
    }

    if (error) {
        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: '100vh' }}>
                <Typography variant="h3" gutterBottom color="lightcoral">
                    Error
                </Typography>
                <Typography>An error occurred {error.during}</Typography>
                <Typography color="gray">{error.message}</Typography>
            </Stack>
        );
    }

    if (!allGuilds.length) {
        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: '100vh' }}>
                <Typography variant="h3" gutterBottom>
                    No Servers Found 💀
                </Typography>
                <Typography>You don't seem to be in any servers</Typography>
            </Stack>
        );
    }

    if (isFiltering && !validGuilds.length) {
        return (
            <Container>
                <Stack alignItems="center">
                    <Typography variant="h4" textAlign="center" gutterBottom>
                        Choose a Server
                    </Typography>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={true}
                                    size="small"
                                    onChange={(e) => setIsFiltering(e.target.checked)}
                                />
                            }
                            label="Elegible Only (0)"
                        />
                    </FormGroup>
                </Stack>
                <Typography textAlign="center" sx={{ mt: 10 }}>
                    You don't seem to be in any elegible servers
                </Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ scrollbarGutter: 'stable', maxHeight: '100vh', overflowY: 'auto', pb: 3 }}>
            <Stack alignItems="center">
                <Typography variant="h4" textAlign="center" gutterBottom>
                    Choose a Server
                </Typography>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isFiltering}
                                size="small"
                                onChange={(e) => setIsFiltering(e.target.checked)}
                            />
                        }
                        label={
                            isFiltering ? `Elegible Only (${validGuilds.length})` : `All Servers (${allGuilds.length})`
                        }
                    />
                </FormGroup>
            </Stack>
            <Grid container spacing={2} sx={{ mt: 1 }}>
                {guildsToShow.map((guild, index) => (
                    <Grid item key={`${guild.id}-${index}`} xs={12} sm={6} lg={4} onClick={handleSelect(guild)}>
                        <AddGuildCard guild={guild} />
                    </Grid>
                ))}
            </Grid>
            <Modal open={!!selectedGuild} onClose={handleSelect(null)}>
                <div>
                    <SelectedGuildModal
                        guild={selectedGuild}
                        accessToken={discordCookie.discordAccess.access_token}
                        handleClose={handleSelect(null)}
                    />
                </div>
            </Modal>
        </Container>
    );
};

const AddGuildWrapper = () => {
    const discordAccessCookie = useDiscordAccess();
    const userCookie = useUser();

    if (!userCookie.user || !discordAccessCookie.discordAccess) {
        return (
            <Container>
                <Typography variant="h3" gutterBottom>
                    Login Required
                </Typography>
                <Typography>You need to log in to add a server.</Typography>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                    <Button variant="outlined" sx={{ mt: 1 }}>
                        Log in
                    </Button>
                </Link>
            </Container>
        );
    }

    return (
        <>
            <HomeButton />
            <AddGuild
                userCookie={userCookie as FullUserResponse}
                discordCookie={discordAccessCookie as FullDiscordAccessResponse}
            />
        </>
    );
};

export default AddGuildWrapper;
