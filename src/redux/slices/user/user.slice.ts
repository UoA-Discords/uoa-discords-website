import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DiscordAPI } from '@uoa-discords/shared-utils';
import server from '../../../api';
import { StoreState } from '../../store';

export interface State {
    userGuilds: Record<string, null>;
    likes: Record<string, null>;
}

export const initialState: State = {
    userGuilds: {},
    likes: {},
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserGuilds(state, action: { payload: string[] }) {
            action.payload.forEach((id) => {
                state.userGuilds[id] = null;
            });
        },
        clearUserGuilds(state) {
            state.userGuilds = {};
        },
        addLikes(state, action: { payload: string[] }) {
            action.payload.forEach((id) => {
                state.likes[id] = null;
            });
        },
        removeLikes(state, action: { payload: string[] }) {
            action.payload.forEach((id) => {
                delete state.likes[id];
            });
        },
        clearLikes(state) {
            state.likes = {};
        },
    },
});

export const { setUserGuilds, clearUserGuilds, addLikes, removeLikes, clearLikes } = userSlice.actions;

export const getUserGuilds = (state: StoreState) => state.user.userGuilds;

export const getUserLikes = (state: StoreState) => state.user.likes;

interface StoredUserGuilds {
    expires_at: number;
    guildIds: string[];
}

export const loadUserGuilds = createAsyncThunk('user/loadUserGuilds', async (access_token: string, { dispatch }) => {
    dispatch(clearUserGuilds());
    const existingEntry = localStorage.getItem('userGuilds');

    if (existingEntry) {
        const { guildIds, expires_at } = JSON.parse(existingEntry) as StoredUserGuilds;
        if (expires_at > Date.now()) {
            dispatch(setUserGuilds(guildIds));
            return;
        }
    }

    const userGuildsQuery = await DiscordAPI.getUserGuilds(access_token);
    if (userGuildsQuery.success) {
        const guildIds = userGuildsQuery.data.map((e) => e.id);
        dispatch(setUserGuilds(guildIds));
        const toSave: StoredUserGuilds = {
            expires_at: Date.now() + 1000 * 60 * 5, // 5 minutes from now
            guildIds,
        };
        localStorage.setItem('userGuilds', JSON.stringify(toSave));
    } else console.error(userGuildsQuery);
});

export const loadUserLikes = createAsyncThunk(
    'user/getLikes',
    async (props: { access_token: string; userID: string }, { dispatch }) => {
        dispatch(clearLikes());
        const likesQuery = await server.getLikes(props.userID, props.access_token);

        if (likesQuery.success) {
            dispatch(addLikes(likesQuery.data));
        } else console.error(likesQuery);
    },
);

export default userSlice.reducer;
