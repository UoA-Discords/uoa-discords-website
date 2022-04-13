import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
    Button,
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
import { TagNames } from '@uoa-discords/shared-utils';
import moment from 'moment';
import { useCallback, useMemo, useState } from 'react';
import { ServerApplication } from '../../types/ServerApplication';
import TagSelector from '../TagSelector';
import InvalidIcon from '@mui/icons-material/Close';
import ValidIcon from '@mui/icons-material/Check';
import UserCard from '../UserCard';

export interface ApplicationRowProps {
    data: ServerApplication;
    onTagsChange: (applicationId: string, newTags: TagNames[]) => void;
    onAccept: (applicationId: string) => void;
    onReject: (applicationId: string) => void;
}

const ApplicationRow = ({ data, onTagsChange, onAccept, onReject }: ApplicationRowProps) => {
    const [tags, setTags] = useState<Set<TagNames>>(new Set(data.tags));
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const hasChangedTags = useMemo<boolean>(() => {
        return !(Array.from(tags).every((tag) => data.tags.includes(tag)) && data.tags.every((tag) => tags.has(tag)));
    }, [data.tags, tags]);

    const handleTagsReset = useCallback(() => {
        setTags(new Set(data.tags));
    }, [data.tags]);

    const handleTagsChange = useCallback(
        (t: TagNames) => {
            if (tags.has(t)) tags.delete(t);
            else tags.add(t);

            setTags(new Set(tags));
        },
        [tags],
    );

    const handleTagsSave = useCallback(() => {
        onTagsChange(data._id, Array.from(tags));
    }, [data._id, onTagsChange, tags]);

    return (
        <>
            <TableRow>
                <TableCell component="th" scope="row">
                    <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
                        <img
                            className="discordProfilePicture"
                            style={{ width: '50px' }}
                            alt="Server icon"
                            src={`https://cdn.discordapp.com/icons/${data.invite.guild?.id || ''}/${
                                data.invite.guild?.icon || ''
                            }`}
                        />
                        <span>{data.invite.guild?.name || 'Unknown Guild'}</span>
                    </Stack>
                </TableCell>
                <TableCell align="right">
                    <Typography>
                        <UserCard user={data.createdBy}>
                            <span className="hoverableUserName">{data.createdBy.username}</span>
                        </UserCard>
                    </Typography>
                </TableCell>
                <TableCell align="right">{moment(data.createdAt).fromNow()}</TableCell>
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
                                        {data.invite.approximate_member_count} Members (
                                        {data.invite.approximate_presence_count} online at time of submission)
                                    </span>
                                    {data.source === 'bot' && <span>Bot ID: {data.botId}</span>}
                                    <span>
                                        Invite:{' '}
                                        <a
                                            href={`https://discord.gg/${data.invite.code}`}
                                            target="_blank"
                                            style={{ textDecoration: 'none' }}
                                            rel="noreferrer"
                                        >
                                            <Button variant="text" size="small" color="info">
                                                {data.invite.code}
                                            </Button>
                                        </a>
                                    </span>
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
                                                onClick={() => onAccept(data._id)}
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
                                            onClick={() => onReject(data._id)}
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
