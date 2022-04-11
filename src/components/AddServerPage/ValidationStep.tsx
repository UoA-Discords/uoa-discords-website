import React, { useEffect, useState } from 'react';
import { Fade, Tooltip, Typography, Stack } from '@mui/material';
import { StepReturn } from './steps';

import InvalidIcon from '@mui/icons-material/Close';
import ValidIcon from '@mui/icons-material/Check';
import WarningIcon from '@mui/icons-material/PriorityHigh';

const ValidationStep = ({ index, step }: { index: number; step: StepReturn }) => {
    const { passes, content, tooltip } = step;

    const [shouldFadeIn, setShouldFadeIn] = useState<boolean>(false);
    useEffect(() => {
        const randomDelay = index * 100;

        const timeout = setTimeout(() => setShouldFadeIn(true), randomDelay);

        return () => clearTimeout(timeout);
    }, [index]);

    if (passes && content === null) return <></>;

    return (
        <Fade in={shouldFadeIn}>
            <Stack direction="row" alignItems="center" spacing={1}>
                {passes === null ? (
                    <WarningIcon color="warning" />
                ) : passes ? (
                    <ValidIcon color="success" />
                ) : (
                    <InvalidIcon color="error" />
                )}
                <Tooltip title={tooltip ? <Typography>{tooltip}</Typography> : ''} arrow placement="right">
                    <span style={{ cursor: tooltip ? 'help' : 'unset' }}>{content}</span>
                </Tooltip>
            </Stack>
        </Fade>
    );
};
export default ValidationStep;
