import { Fade, Slide, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDoneInitialLoad, setDoneInitialLoad } from '../../redux/slices/main';

const title: string = 'uoa-discords.com';
const subtitle: string = "An Unspecified University's Discord Server Catalogue";

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
    const dispatch = useDispatch();
    const doneInitialLoad = useSelector(getDoneInitialLoad);

    const [shouldFadeInSubtitle, setShouldFadeInSubtitle] = useState<boolean>(false);

    useEffect(() => {
        let timeouts: NodeJS.Timeout[] = [];
        if (!doneInitialLoad) {
            const delay = delayFormula(title.length, true);
            timeouts.push(
                setTimeout(() => dispatch(setDoneInitialLoad(true)), delay + 2000),
                setTimeout(() => setShouldFadeInSubtitle(true), delay + 500),
            );
        }

        return () => timeouts.forEach((e) => clearTimeout(e));
    }, [dispatch, doneInitialLoad]);

    if (doneInitialLoad) {
        return (
            <Stack alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="h2" textAlign="center">
                    {title}
                </Typography>
                <Typography color="gray">{subtitle}</Typography>
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
                <Typography color="gray">{subtitle}</Typography>
            </Slide>
        </Stack>
    );
};

export default Title;
