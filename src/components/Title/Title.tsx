import { Fade, Slide, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

const title: string = 'uoa-discords.com';

/** (Possibly) Random delay calculator for fading transition.
 * @param {number} index - The index of this character in the title string.
 * @param {boolean} [mostDelay=false] - Whether to return the largest delay possible.
 */
function delayFormula(index: number, mostDelay: boolean = false): number {
    return index * 80;
}

const SingleCharacter = ({ char, index }: { char: string; index: number }) => {
    const [shouldFadeIn, setShouldFadeIn] = useState<boolean>(false);

    useEffect(() => {
        const randomDelay = delayFormula(index);

        const timeout = setTimeout(() => setShouldFadeIn(true), randomDelay);

        return () => clearTimeout(timeout);
    }, [index]);

    return (
        <Fade in={shouldFadeIn}>
            <span>{char}</span>
        </Fade>
    );
};

const Title = () => {
    const [{ titleTransition }, setCookie] = useCookies<'titleTransition', { titleTransition?: boolean }>([
        'titleTransition',
    ]);

    const [shouldFadeInSubtitle, setShouldFadeInSubtitle] = useState<boolean>(false);

    useEffect(() => {
        let timeouts: NodeJS.Timeout[] = [];
        if (!titleTransition) {
            const delay = delayFormula(title.length, true);
            timeouts.push(
                setTimeout(() => setCookie('titleTransition', true), delay + 2000),
                setTimeout(() => setShouldFadeInSubtitle(true), delay + 500),
            );
        }

        return () => timeouts.forEach((e) => clearTimeout(e));
    }, [setCookie, titleTransition]);

    if (titleTransition) {
        return (
            <Stack alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="h2" textAlign="center">
                    {title}
                </Typography>
                <Typography color="gray">An Unspecified University's Discord Server Catalogue</Typography>
            </Stack>
        );
    }

    return (
        <Stack alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h2" textAlign="center">
                {title.split('').map((char, index) => (
                    <SingleCharacter char={char} index={index} key={index} />
                ))}
            </Typography>
            <Slide in={!!shouldFadeInSubtitle}>
                <Typography color="gray">An Unspecified University's Discord Server Catalogue</Typography>
            </Slide>
        </Stack>
    );
};

export default Title;
