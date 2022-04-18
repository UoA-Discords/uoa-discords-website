import { Chip, Grid, Typography } from '@mui/material';
import { TagNames, TagDescriptionsMap } from '@uoa-discords/shared-utils';
import LightTooltip from '../LightTooltip';

interface TagSelectorProps {
    selectedTags: Set<TagNames>;
    tagChangeCallback: (t: TagNames) => void;
}

const TagSelector = ({ selectedTags, tagChangeCallback }: TagSelectorProps) => {
    return (
        <Grid container spacing={1}>
            {Object.keys(TagDescriptionsMap).map((e, index) => {
                const tagName = e as TagNames;
                const isSelected = selectedTags.has(tagName);

                return (
                    <Grid item key={index}>
                        <LightTooltip
                            title={<Typography>{TagDescriptionsMap[tagName]}</Typography>}
                            arrow
                            enterDelay={0}
                        >
                            <Chip
                                label={tagName}
                                variant="outlined"
                                color={isSelected ? 'success' : undefined}
                                clickable={!!tagChangeCallback}
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
