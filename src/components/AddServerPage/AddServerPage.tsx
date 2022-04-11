import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, CircularProgress, Collapse, Fade, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { DiscordAPI, Invite, TagNames, WebApplication } from '@uoa-discords/shared-utils';
import useDebounce from '../../hooks/useDebounce';
import { steps } from './steps';
import ValidationStep from './ValidationStep';
import ValidIcon from '@mui/icons-material/Check';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import server from '../../api';
import TagSelector from '../TagSelector';

interface AddServerPageProps {
    isOpen: boolean;
    access_token: string;
}

const AddServerPage = ({ isOpen, access_token }: AddServerPageProps) => {
    const inputRef = useRef<HTMLTextAreaElement>();

    const [isClientVerifying, setIsClientVerifying] = useState<boolean>(false);
    const [isServerVerifying, setIsServerVerifying] = useState<boolean>(false);

    const [input, setInput] = useState<string>('');
    const debouncedInput = useDebounce<string>(input, 1000);

    // syntax validation
    const [validationStatus, setValidationStatus] = useState<
        null | { valid: true; code: string } | { valid: false; reason: string }
    >(null);

    // guild validation
    const [inviteStatus, setInviteStatus] = useState<Invite | null>(null);
    const [isSubmittable, setIsSubmittable] = useState<boolean>(false);

    // server validation
    const [serverStatus, setServerStatus] = useState<string | true | null>(null);
    const [isVerifierOverride, setIsVerifierOverride] = useState<boolean>(false);

    const [tags, setTags] = useState<TagNames[]>([]);
    const handleTagsChange = useCallback((t: Set<TagNames>) => {
        setTags(Array.from(t));
    }, []);

    // autofocus text input on open
    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    // syntax validation
    useEffect(() => {
        setIsSubmittable(false);
        setServerStatus(null);
        const invite = debouncedInput;
        if (!invite.trim().length) {
            setValidationStatus(null);
            return;
        }

        try {
            const url = new URL(invite);
            if (url.host !== 'discord.gg') {
                setValidationStatus({ reason: 'Invite must be from Discord', valid: false });
                return;
            }
            const payload = url.pathname.slice(1);
            if (!payload.length) {
                setValidationStatus({ reason: 'Invalid invite code', valid: false });
                return;
            }
            setValidationStatus({ code: payload, valid: true });
        } catch (error) {
            if (invite.startsWith('discord.gg/')) {
                const payload = invite.slice('discord.gg/'.length);
                if (!payload.length) {
                    setValidationStatus({ reason: 'Invalid invite code', valid: false });
                    return;
                }
                setValidationStatus({ code: payload, valid: true });
            } else {
                setValidationStatus(null);
            }
        }
    }, [debouncedInput]);

    // guild validation
    useEffect(() => {
        if (validationStatus === null || !validationStatus.valid) {
            setIsClientVerifying(false);
            setInviteStatus(null);
            return;
        }

        setIsClientVerifying(true);
        DiscordAPI.getInviteData(validationStatus.code).then((res) => {
            setIsClientVerifying(false);
            if (res.success) {
                setInviteStatus(res.data);

                setIsSubmittable(steps.every((e) => e(res.data).passes !== false));
            } else {
                console.error(res.error);
                setInviteStatus(null);
                setValidationStatus({ reason: `No server found`, valid: false });
            }
        });
    }, [validationStatus]);

    const submitApplication = useCallback(() => {
        if (!inviteStatus) return;

        const body: WebApplication = {
            inviteCode: inviteStatus.code,
            authToken: access_token,
            tags,
        };

        setIsServerVerifying(true);
        server.makeApplication(body).then((res) => {
            setIsServerVerifying(false);
            if (res.success) {
                setServerStatus(true);
                const { verifierOverride } = res.data;
                setIsVerifierOverride(verifierOverride);
            } else {
                if (res.error.response?.data) {
                    setServerStatus(res.error.response.data as string);
                } else {
                    if (!res.error.response) {
                        setServerStatus(`No response - servers are probably down`);
                    } else {
                        setServerStatus(
                            `Unknown error occurred${
                                res.error.response?.status ? ` (${res.error.response.status})` : ''
                            }`,
                        );
                    }
                }
            }
        });
    }, [access_token, inviteStatus, tags]);

    return (
        <Fade in={isOpen}>
            <Stack spacing={1} sx={{ mt: 3, pb: 5 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        label={
                            validationStatus === null
                                ? 'Paste invite link here'
                                : validationStatus.valid === true
                                ? 'Valid invite'
                                : validationStatus.reason
                        }
                        color={
                            validationStatus === null
                                ? 'primary'
                                : validationStatus.valid === true
                                ? 'success'
                                : 'error'
                        }
                        inputRef={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="https://discord.gg/abc123"
                        fullWidth
                    />
                    <div
                        style={{
                            position: 'relative',
                            height: '50px',
                            width: '50px',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Fade in={!!inviteStatus?.guild?.icon}>
                            {!!inviteStatus?.guild?.icon ? (
                                <img
                                    src={`https://cdn.discordapp.com/icons/${inviteStatus.guild.id}/${inviteStatus.guild.icon}`}
                                    alt="Discord server icon"
                                    style={{ width: '100%' }}
                                    className="discordProfilePicture"
                                />
                            ) : (
                                <span></span>
                            )}
                        </Fade>
                    </div>
                </Stack>
                <Collapse in={isClientVerifying || !!inviteStatus}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        {isClientVerifying ? <CircularProgress size={24} /> : <ValidIcon />}
                        <span style={{ color: 'gray' }}>
                            {isClientVerifying ? 'Loading' : 'Loaded'} data for{' '}
                            <span style={{ color: 'lightgray' }}>
                                {!!inviteStatus
                                    ? inviteStatus.guild?.name || 'unknown guild'
                                    : validationStatus?.valid
                                    ? validationStatus.code
                                    : 'unknown invite'}
                            </span>
                        </span>
                    </Stack>
                </Collapse>
                {!!inviteStatus && steps.map((e, i) => <ValidationStep step={e(inviteStatus)} index={i} key={i} />)}
                <Fade in={isSubmittable}>
                    <Stack>
                        <Typography color="gray" gutterBottom>
                            Select Tags (optional)
                        </Typography>
                        <TagSelector tagChangeCallback={handleTagsChange} />
                    </Stack>
                </Fade>
                <Fade in={isSubmittable}>
                    <Button
                        size="large"
                        variant="outlined"
                        color="success"
                        onClick={submitApplication}
                        disabled={isServerVerifying || serverStatus !== null}
                    >
                        Apply
                    </Button>
                </Fade>
                <Collapse in={isServerVerifying || !!serverStatus}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        {isServerVerifying ? (
                            <CircularProgress size={24} />
                        ) : serverStatus === true ? (
                            <DoneAllIcon color="success" />
                        ) : (
                            <ErrorOutlineIcon color="error" />
                        )}
                        {isServerVerifying ? (
                            <span style={{ color: 'gray' }}>Making request</span>
                        ) : (
                            <span style={{ color: serverStatus === true ? 'lightgreen' : 'lightcoral' }}>
                                {serverStatus === true ? 'Application submitted!' : serverStatus}
                            </span>
                        )}
                    </Stack>
                </Collapse>
                <Fade in={(isServerVerifying || !!serverStatus) && isVerifierOverride}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <ErrorOutlineIcon color="disabled" />
                        <Tooltip title="Since you are a server verifier, you can have more than application at a time.">
                            <span style={{ color: 'gray' }}>Overriding application limit</span>
                        </Tooltip>
                    </Stack>
                </Fade>
            </Stack>
        </Fade>
    );
};

export default AddServerPage;
