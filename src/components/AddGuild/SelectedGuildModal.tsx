import {
    Box,
    Button,
    List,
    Fade,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    CircularProgress,
} from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import ExtendedGuild from '../../types/ExtendedGuild';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import SecurityIcon from '@mui/icons-material/Security';
import FlipIcon from '@mui/icons-material/Flip';

import SendIcon from '@mui/icons-material/Send';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: `min(600, 90%)`,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    maxHeight: '100vh',
    overflowY: 'auto',
};

const Recommendations: [text: JSX.Element, icon: JSX.Element][] = [
    [
        <span>
            Disable <span style={{ color: 'pink' }}>@everyone</span> pings
        </span>,
        <AlternateEmailIcon color="disabled" />,
    ],
    [<span>Set a medium or higher verification level</span>, <SecurityIcon color="disabled" />],
    [<span>Enable media scanning for all members</span>, <FlipIcon color="disabled" />],
];

const ApplicationProcess: [text: JSX.Element, icon: JSX.Element][] = [
    [<span>Application is sent to our database</span>, <SendIcon color="disabled" />],
    [<span>We will verify your application</span>, <PersonSearchIcon color="disabled" />],
    [<span>Server added to main page</span>, <PlaylistAddCheckIcon color="success" />],
];

const SelectedGuildModal = ({
    guild,
    accessToken,
    handleClose,
}: {
    guild: ExtendedGuild | null;
    accessToken: string;
    handleClose: () => void;
}) => {
    const image = useMemo<string>(() => {
        if (!guild) return '';
        else if (guild.icon) return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
        else return `https://avatars.githubusercontent.com/u/102650663`;
    }, [guild]);

    const [expandedItem, setExpandedItem] = useState<number>(0);

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleExpansion = useCallback(
        (index: number) => {
            return () => {
                if (expandedItem === index) setExpandedItem(-1);
                else setExpandedItem(index);
            };
        },
        [expandedItem],
    );

    if (!guild) {
        console.warn(`Modal open but no selected guild!`);
        return <></>;
    }

    return (
        <Box sx={style}>
            <Stack direction="row">
                <img src={image} height="64" width="64" alt={`${guild.name}'s icon`} style={{ borderRadius: '50%' }} />
                <Typography variant="h6" component="h2" sx={{ ml: 1 }}>
                    {guild.name}
                </Typography>
            </Stack>
            <Typography sx={{ mt: 2 }} color="gray" variant="body2" gutterBottom>
                Anyone will be able to join <span style={{ color: 'gold' }}>{guild.name}</span> through this website
                once added, please make sure to prepare accordingly.
            </Typography>
            <Accordion disableGutters square expanded={expandedItem === 0} onChange={handleExpansion(0)}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Recommended Moderation Actions</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List sx={{ color: 'gray' }} dense disablePadding>
                        {Recommendations.map(([tip, icon], i) => (
                            <ListItem key={i} disableGutters sx={{ pt: 0, pb: 0 }}>
                                <ListItemButton>
                                    <ListItemIcon children={icon} />
                                    <ListItemText primary={tip} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </AccordionDetails>
            </Accordion>
            <Accordion disableGutters square expanded={expandedItem === 1} onChange={handleExpansion(1)}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Application Process</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List sx={{ color: 'gray' }} dense disablePadding>
                        {ApplicationProcess.map(([tip, icon], i) => (
                            <ListItem key={i} disableGutters sx={{ pt: 0, pb: 0 }}>
                                <ListItemButton>
                                    <ListItemIcon children={icon} />
                                    <ListItemText primary={tip} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </AccordionDetails>
            </Accordion>
            <Stack direction="row" sx={{ mt: 3 }} justifyContent="space-between">
                <Fade in>
                    <Button
                        variant="outlined"
                        color="success"
                        disabled={isSubmitting}
                        onClick={() => setIsSubmitting(true)}
                    >
                        {isSubmitting ? 'Submitting' : 'Submit'}
                    </Button>
                </Fade>
                <Fade in={isSubmitting} unmountOnExit mountOnEnter>
                    <CircularProgress sx={{ mr: 1 }} />
                </Fade>
                <Fade in={!isSubmitting} unmountOnExit mountOnEnter>
                    <Button variant="outlined" color="error" onClick={handleClose}>
                        Cancel
                    </Button>
                </Fade>
            </Stack>
        </Box>
    );
};

export default SelectedGuildModal;
