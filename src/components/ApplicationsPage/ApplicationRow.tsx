import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
    Button,
    CircularProgress,
    Collapse,
    Fade,
    Grid,
    IconButton,
    Stack,
    TableCell,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material';
import { ApplicationServer, DiscordAPI, Invite, TagNames } from '@uoa-discords/shared-utils';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import TagSelector from '../TagSelector';
import InvalidIcon from '@mui/icons-material/Close';
import ValidIcon from '@mui/icons-material/Check';
import UserCard from '../UserCard';
import discordIcon from '../../images/discordIcon.svg';

export interface ApplicationRowProps {
    application: ApplicationServer;
    onTagsChange: (applicationId: string, newTags: TagNames[]) => void;
    onAccept: (applicationId: string) => void;
    onReject: (applicationId: string) => void;
}

const ApplicationRow = ({ application, onTagsChange, onAccept, onReject }: ApplicationRowProps) => {
    const [invite, setInvite] = useState<Invite | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        setInvite(null);
        setError('');
        DiscordAPI.getInviteData(application.inviteCode).then((res) => {
            if (res.success) {
                setInvite(res.data);
            } else {
                console.log(res);
                setError(res.error.message);
            }
        });
    }, [application.inviteCode]);

    const [tags, setTags] = useState<Set<TagNames>>(new Set(application.tags));
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const hasChangedTags = useMemo<boolean>(() => {
        return !(
            Array.from(tags).every((tag) => application.tags.includes(tag)) &&
            application.tags.every((tag) => tags.has(tag))
        );
    }, [application.tags, tags]);

    const handleTagsReset = useCallback(() => {
        setTags(new Set(application.tags));
    }, [application.tags]);

    const handleTagsChange = useCallback(
        (t: TagNames) => {
            if (tags.has(t)) tags.delete(t);
            else tags.add(t);

            setTags(new Set(tags));
        },
        [tags],
    );

    const handleTagsSave = useCallback(() => {
        onTagsChange(application._id, Array.from(tags));
    }, [application._id, onTagsChange, tags]);

    const guildImageIcon = useMemo<JSX.Element>(() => {
        if (!invite) return <CircularProgress />;
        return (
            <img
                className="discordProfilePicture"
                style={{ width: '50px' }}
                alt="Server icon"
                src={
                    invite.guild?.icon
                        ? `https://cdn.discordapp.com/icons/${invite.guild.id}/${invite.guild.icon}`
                        : discordIcon
                }
            />
        );
    }, [invite]);

    return (
        <>
            <TableRow>
                <TableCell component="th" scope="row">
                    <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
                        {guildImageIcon}
                        <span>{!invite ? `Loading ${application._id}` : invite.guild?.name || 'Unknown Guild'}</span>
                    </Stack>
                </TableCell>
                <TableCell align="right">
                    <Typography>
                        <UserCard user={application.addedBy}>
                            <span className="hoverableUserName">{application.addedBy.username}</span>
                        </UserCard>
                    </Typography>
                </TableCell>
                <TableCell align="right">{moment(application.addedAt).fromNow()}</TableCell>
                <TableCell align="right">
                    <IconButton size="small" onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Grid container spacing={1} sx={{ mb: 2, mt: 1 }}>
                            <Grid item xs={6} display="flex" flexDirection="column">
                                <Stack spacing={1} sx={{ flexGrow: 1 }}>
                                    <span>
                                        {!invite ? '-1' : invite.approximate_member_count} Members (
                                        {!invite ? '-1' : invite.approximate_presence_count} online)
                                    </span>
                                    {application.bot !== null && (
                                        <UserCard user={application.bot}>
                                            <span className="hoverableUserName">Bot: {application.bot.username}</span>
                                        </UserCard>
                                    )}
                                    <span>
                                        Invite:{' '}
                                        <a
                                            href={`https://discord.gg/${application.inviteCode}`}
                                            target="_blank"
                                            style={{ textDecoration: 'none' }}
                                            rel="noreferrer"
                                        >
                                            <Button variant="text" size="small" color="info">
                                                {application.inviteCode}
                                            </Button>
                                        </a>
                                    </span>
                                    {error && <span style={{ color: 'lightcoral' }}>Error: {error}</span>}
                                </Stack>
                                <Stack direction="row" spacing={1}>
                                    <Tooltip
                                        title={hasChangedTags ? 'Unsaved changes' : 'Will show on the public registry'}
                                    >
                                        <span>
                                            <Button
                                                color="success"
                                                size="large"
                                                variant="outlined"
                                                startIcon={<ValidIcon />}
                                                onClick={() => onAccept(application._id)}
                                                disabled={hasChangedTags}
                                            >
                                                Accept
                                            </Button>
                                        </span>
                                    </Tooltip>
                                    <Tooltip title="Will be able to reapply">
                                        <Button
                                            color="error"
                                            size="large"
                                            variant="outlined"
                                            startIcon={<InvalidIcon />}
                                            onClick={() => onReject(application._id)}
                                        >
                                            Reject
                                        </Button>
                                    </Tooltip>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography gutterBottom>
                                    Tags ({tags.size}){' '}
                                    <Fade in={hasChangedTags}>
                                        <span>
                                            <Button onClick={handleTagsSave}>save</Button>
                                            <Button onClick={handleTagsReset}>reset</Button>
                                        </span>
                                    </Fade>
                                </Typography>
                                <TagSelector selectedTags={tags} tagChangeCallback={handleTagsChange} />
                            </Grid>
                        </Grid>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

export default ApplicationRow;
