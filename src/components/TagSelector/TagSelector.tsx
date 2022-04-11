import { Chip, Grid, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { TagNames, Tags } from '@uoa-discords/shared-utils';
import LightTooltip from '../LightTooltip';

interface TagSelectorProps {
    tagChangeCallback: (t: Set<TagNames>) => void;
}

const TagSelector = ({ tagChangeCallback }: TagSelectorProps) => {
    const [selectedTags, setSelectedTags] = useState<Set<TagNames>>(new Set());

    const toggleTag = useCallback(
        (t: TagNames) => {
            return () => {
                if (selectedTags.has(t)) selectedTags.delete(t);
                else selectedTags.add(t);

                const newTagsSet = new Set(selectedTags);
                setSelectedTags(newTagsSet);
                tagChangeCallback(newTagsSet);
            };
        },
        [selectedTags, tagChangeCallback],
    );

    return (
        <Grid container spacing={1}>
            {Object.keys(Tags).map((e, index) => {
                const tagName = e as unknown as TagNames;
                const tag = Tags[tagName];
                const isSelected = selectedTags.has(tagName);

                return (
                    <Grid item key={index}>
                        <LightTooltip title={<Typography>{tag.description}</Typography>} arrow enterDelay={0}>
                            <Chip
                                label={tag.name}
                                variant="outlined"
                                color={isSelected ? 'success' : undefined}
                                clickable
                                onClick={toggleTag(tagName)}
                            />
                        </LightTooltip>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default TagSelector;
