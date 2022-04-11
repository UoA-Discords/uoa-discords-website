import { useEffect, useRef, useState } from 'react';
import { Button, CircularProgress, Collapse, Fade, Stack, TextField } from '@mui/material';
import { DiscordAPI, Invite } from '@uoa-discords/shared-utils';
import useDebounce from '../../hooks/useDebounce';
import { steps } from './steps';
import ValidationStep from './ValidationStep';
import ValidIcon from '@mui/icons-material/Check';

interface AddServerPageProps {
    isOpen: boolean;
}

const AddServerPage = ({ isOpen }: AddServerPageProps) => {
    const inputRef = useRef<HTMLTextAreaElement>();

    const [isClientVerifying, setIsClientVerifying] = useState<boolean>(false);
    // const [isServerVerifying, setIsServerVerifying] = useState<boolean>(false);

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
    // const [serverStatus, setServerStatus] = useState<ApplicationResponses | null>(null);

    // autofocus text input on open
    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    // syntax validation
    useEffect(() => {
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

    // server validation
    useEffect(() => {
        // this will probably be an onClick
    }, []);

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
                    <Button size="large" variant="outlined" color="success">
                        Apply
                    </Button>
                </Fade>
            </Stack>
        </Fade>
    );
};

export default AddServerPage;
