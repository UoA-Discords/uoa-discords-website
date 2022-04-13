import { Chip, Grid, Typography } from '@mui/material';
import { TagNames, Tags } from '@uoa-discords/shared-utils';
import LightTooltip from '../LightTooltip';

interface TagSelectorProps {
    selectedTags: Set<TagNames>;
    tagChangeCallback: (t: TagNames) => void;
}

const TagSelector = ({ selectedTags, tagChangeCallback }: TagSelectorProps) => {
    return (
        <Grid container spacing={1}>
            {Object.keys(Tags).map((e, index) => {
                const tagName = parseInt(e) as TagNames;
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
                                onClick={() => tagChangeCallback(tagName)}
                            />
                        </LightTooltip>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default TagSelector;
