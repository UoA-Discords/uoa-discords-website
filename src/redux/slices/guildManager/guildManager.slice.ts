import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DiscordAPI, RegisteredServer } from '@uoa-discords/shared-utils';
import { AxiosError } from 'axios';
import server from '../../../api';
import LoadedGuild from '../../../types/LoadedGuild';
import { StoreState } from '../../store';

export interface State {
    guilds: Record<string, LoadedGuild>;
}

export const initialState: State = {
    guilds: {},
};

const guildManagerSlice = createSlice({
    name: 'guildManager',
    initialState,
    reducers: {
        addGuilds(state, action: { payload: LoadedGuild[] }) {
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
    },
});

export const { addGuilds, removeGuildsById, removeAllGuilds } = guildManagerSlice.actions;

export const getAllGuilds = (state: StoreState) => state.guildManager.guilds;

export const loadGuilds = createAsyncThunk('guildManager/loadsGuilds', async (_, { getState, dispatch }) => {
    const guildQuery = await server.getServers();
    if (!guildQuery.success) {
        console.log('failed to get guilds', guildQuery.error);
        // TODO: error handling and showing
        return;
    }

    const unloadedGuilds = guildQuery.data; //

    const guildsInviteData = await Promise.all(unloadedGuilds.map((e) => DiscordAPI.getInviteData(e.inviteCode)));

    const erroredGuilds: (RegisteredServer & { error: AxiosError })[] = [];
    const loadedGuilds: LoadedGuild[] = [];

    for (let i = 0, len = unloadedGuilds.length; i < len; i++) {
        const registeredServer = unloadedGuilds[i];
        const inviteQuery = guildsInviteData[i];
        if (inviteQuery.success) {
            loadedGuilds.push({ ...registeredServer, invite: inviteQuery.data });
        } else {
            erroredGuilds.push({ ...registeredServer, error: inviteQuery.error });
        }
    }

    console.log(
        `Successfully loaded ${loadedGuilds.length} / ${unloadedGuilds.length} guilds (${erroredGuilds.length} errored)`,
    );

    dispatch(removeAllGuilds());
    dispatch(addGuilds(loadedGuilds));
});

export default guildManagerSlice.reducer;
