import { createSlice } from '@reduxjs/toolkit';
import { ServerWithInviteInfo } from '@uoa-discords/shared-utils';
import { StoreState } from '../../store';

export interface State {
    doneInitialLoad: boolean;
    selectedGuildId: string | null;
}

export const initialState: State = {
    doneInitialLoad: false,
    selectedGuildId: null,
};

const mainSlice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        setDoneInitialLoad(state, action: { payload: boolean }) {
            state.doneInitialLoad = action.payload;
        },
        setSelectedGuildId(state, action: { payload: string }) {
            if (state.selectedGuildId === action.payload) {
                state.selectedGuildId = null;
            } else {
                state.selectedGuildId = action.payload;
            }
        },
    },
});

export const { setDoneInitialLoad, setSelectedGuildId } = mainSlice.actions;

export const getDoneInitialLoad = (state: StoreState) => state.main.doneInitialLoad;

export const getSelectedGuild = (state: StoreState): ServerWithInviteInfo | null => {
    if (state.main.selectedGuildId === null) {
        return null;
    }
    const id = state.main.selectedGuildId;
    if (state.guildManager.guilds[id] === undefined) {
        console.log(`ID of selected guild (${id}) doesn't exist!`);
        return null;
    }
    return state.guildManager.guilds[id];
};

export default mainSlice.reducer;
