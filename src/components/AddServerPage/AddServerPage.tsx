import { useEffect, useRef, useState } from 'react';
import { Button, CircularProgress, Collapse, Fade, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { DiscordAPI, HelperAPI, Invite, VerificationLevels } from '@uoa-discords/shared-utils';
import useDebounce from '../../hooks/useDebounce';
import moment from 'moment';
import InvalidIcon from '@mui/icons-material/Close';
import ValidIcon from '@mui/icons-material/Check';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

type ValidationStepFunction = (
    i: Invite,
) => [passes: boolean | 'maybe', content: string | JSX.Element, tooltip?: string];

const verificationLevelNameMap: Record<VerificationLevels, string> = {
    [VerificationLevels.NONE]: 'no',
    [VerificationLevels.LOW]: 'a low',
    [VerificationLevels.MEDIUM]: 'a medium',
    [VerificationLevels.HIGH]: 'a high',
    [VerificationLevels.VERY_HIGH]: 'a very high',
};

const validationSteps: ValidationStepFunction[] = [
    (i) => {
        if (i.expires_at) {
            return [
                false,
                <>
                    Invite expires <span style={{ color: 'lightcoral' }}>{moment(i.expires_at).fromNow()}</span>
                </>,
            ];
        } else return [true, "Invite doesn't expire"];
    },
    (i) => {
        if (i.approximate_member_count < 100) {
            return [
                false,
                <>
                    {i.guild?.name || 'Unknown guild'} does not have enough members (
                    <span style={{ color: 'lightcoral' }}>{i.approximate_member_count}</span> / 100)
                </>,
            ];
        } else return [true, 'Has > 100 members'];
    },
    (i) => {
        if (i.guild?.verification_level === undefined) return ['maybe', 'Unknown verification level'];
        if (i.guild.verification_level >= VerificationLevels.LOW)
            return [
                true,
                <>
                    {i.guild.name || 'unknown guild'} has{' '}
                    <span style={{ color: 'lightgreen' }}>{verificationLevelNameMap[i.guild.verification_level]}</span>{' '}
                    verification level
                </>,
            ];
        return [
            'maybe',
            <>
                {i.guild.name || 'unknown guild'} has <span style={{ color: 'lightcoral' }}>no</span> verification level
            </>,
            'Recommended verification level is low or greater',
        ];
    },
];

const ValidationStep = ({ invite, index, step }: { invite: Invite; index: number; step: ValidationStepFunction }) => {
    const [passed, payload, tooltip] = step(invite);

    const [shouldFadeIn, setShouldFadeIn] = useState<boolean>(false);
    useEffect(() => {
        const randomDelay = index * 100;

        const timeout = setTimeout(() => setShouldFadeIn(true), randomDelay);

        return () => clearTimeout(timeout);
    }, [index]);

    return (
        <Fade in={shouldFadeIn}>
            <Tooltip title={tooltip ? <Typography>{tooltip}</Typography> : ''} arrow placement="right">
                <Stack direction="row" alignItems="center" spacing={1}>
                    {passed === 'maybe' ? (
                        <PriorityHighIcon color="warning" />
                    ) : passed ? (
                        <ValidIcon color="success" />
                    ) : (
                        <InvalidIcon color="error" />
                    )}
                    <span>{payload}</span>
                </Stack>
            </Tooltip>
        </Fade>
    );
};

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

                setIsSubmittable(HelperAPI.verifyGuild(res.data) === true);
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
                    <div style={{ position: 'relative', height: '50px', width: '50px' }}>
                        <Fade in={!!inviteStatus?.guild?.icon}>
                            <img
                                src={`https://cdn.discordapp.com/icons/${inviteStatus?.guild?.id || ''}/${
                                    inviteStatus?.guild?.icon || ''
                                }`}
                                alt="Discord server icon"
                                style={{ height: '100%' }}
                                className="discordProfilePicture"
                            />
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
                {!!inviteStatus &&
                    validationSteps.map((e, i) => <ValidationStep step={e} index={i} invite={inviteStatus} key={i} />)}
                <Fade in={isSubmittable}>
                    <Button size="large" variant="outlined" color="success" style={{ marginRight: '59px' }}>
                        Apply
                    </Button>
                </Fade>
            </Stack>
        </Fade>
    );
};

export default AddServerPage;
