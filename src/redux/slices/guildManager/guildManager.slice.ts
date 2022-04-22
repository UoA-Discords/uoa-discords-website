import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ServerWithInviteInfo } from '@uoa-discords/shared-utils';
import server from '../../../api';
import { StoreState } from '../../store';

export interface State {
    guilds: Record<string, ServerWithInviteInfo>;
}

export const initialState: State = {
    guilds: {},
};

const guildManagerSlice = createSlice({
    name: 'guildManager',
    initialState,
    reducers: {
        addGuilds(state, action: { payload: ServerWithInviteInfo[] }) {
            action.payload.forEach((guild) => {
                state.guilds[guild._id] = guild;
            });
        },
        removeGuildsById(state, action: { payload: string[] }) {
            action.payload.forEach((id) => {
                delete state.guilds[id];
            });
        },
        removeAllGuilds(state) {
            state.guilds = {};
        },
        modifyGuildLikes(state, action: { payload: { guildId: string; modifier: number } }) {
            state.guilds[action.payload.guildId].likes += action.payload.modifier;
        },
    },
});

export const { addGuilds, removeGuildsById, removeAllGuilds, modifyGuildLikes } = guildManagerSlice.actions;

export const getAllGuilds = (state: StoreState) => state.guildManager.guilds;

export const loadGuilds = createAsyncThunk('guildManager/loadsGuilds', async (_, { getState, dispatch }) => {
    const guildQuery = await server.getServers();
    if (!guildQuery.success) {
        console.log('failed to get guilds', guildQuery.error);
        // TODO: error handling and showing
        return;
    }

    dispatch(removeAllGuilds());
    dispatch(addGuilds(guildQuery.data));
});

export default guildManagerSlice.reducer;
