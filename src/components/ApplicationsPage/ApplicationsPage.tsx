import {
    Container,
    Typography,
    LinearProgress,
    Button,
    Stack,
    TableContainer,
    Paper,
    TableHead,
    TableRow,
    TableCell,
    Table,
    TableBody,
} from '@mui/material';
import { TagNames } from '@uoa-discords/shared-utils';
import { AxiosError } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import server from '../../api';
import useDiscordAccess from '../../hooks/useDiscordAccess';
import { ServerApplication } from '../../types/ServerApplication';
import NotFound from '../NotFound';
import ApplicationRow from './ApplicationRow';

const ApplicationsPage = ({ access_token }: { access_token: string }) => {
    const [loading, setIsLoading] = useState<boolean>(true);
    const [errored, setIsErrored] = useState<false | AxiosError>(false);
    const [applications, setApplications] = useState<ServerApplication[]>([]);

    const refreshApplications = useCallback(() => {
        setIsLoading(true);
        server.getApplications(access_token).then((res) => {
            setIsLoading(false);
            if (res.success) {
                setApplications(res.data);
            } else {
                setIsErrored(res.error);
            }
        });
    }, [access_token]);

    useEffect(() => {
        refreshApplications();
    }, [refreshApplications]);

    const handleAccept = useCallback(
        (applicationId: string) => {
            server.acceptApplication(access_token, applicationId).then((res) => {
                if (res.success) {
                    setApplications(applications.filter(({ _id }) => _id !== applicationId));
                } else {
                    setIsErrored(res.error);
                }
            });
        },
        [access_token, applications],
    );

    const handleReject = useCallback(
        (applicationId: string) => {
            server.rejectApplication(access_token, applicationId).then((res) => {
                if (res.success) {
                    setApplications(applications.filter(({ _id }) => _id !== applicationId));
                } else {
                    setIsErrored(res.error);
                }
            });
        },
        [access_token, applications],
    );

    const handleTagsChange = useCallback(
        (applicationId: string, newTags: TagNames[]) => {
            server.modifyTags(access_token, applicationId, newTags).then((res) => {
                if (res.success) {
                    const editedApplication = applications.find((app) => app._id === applicationId);
                    if (editedApplication) {
                        editedApplication.tags = newTags;
                        setApplications([...applications]);
                    } else {
                        throw new Error(`Tried to update tags on a nonexistant application, ID: ${applicationId}`);
                    }
                }
            });
        },
        [access_token, applications],
    );

    if (loading) {
        return (
            <Container>
                <Typography variant="h2" textAlign="center" gutterBottom>
                    Getting Applications
                </Typography>
                <LinearProgress />
            </Container>
        );
    }
    if (errored) {
        return (
            <Container>
                <Typography variant="h2" textAlign="center" gutterBottom>
                    Error
                </Typography>
                <LinearProgress color="error" variant="determinate" value={100} />
                <Stack alignItems="center" spacing={1} sx={{ mt: 2 }}>
                    <Typography variant="h5" color="gray" textAlign="center">
                        {errored.response?.data || 'Unknown error occurred getting applications'}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <Button variant="outlined" size="large">
                                Home
                            </Button>
                        </Link>
                    </Stack>
                </Stack>
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h2" gutterBottom textAlign="center">
                {applications.length} Application{applications.length !== 1 ? 's' : ''}
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Server</TableCell>
                            <TableCell align="right">Submitted By</TableCell>
                            <TableCell align="right">Submitted</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {applications.map((e, i) => (
                            <ApplicationRow
                                key={e._id}
                                data={e}
                                onTagsChange={handleTagsChange}
                                onAccept={handleAccept}
                                onReject={handleReject}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

const ApplicationsPageWrapper = () => {
    const { discordAccess } = useDiscordAccess();
    if (!discordAccess) {
        return <NotFound />;
    }

    return <ApplicationsPage access_token={discordAccess.access_token} />;
};

export default ApplicationsPageWrapper;
