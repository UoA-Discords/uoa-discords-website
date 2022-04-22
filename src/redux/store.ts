import { configureStore } from '@reduxjs/toolkit';
import guildManagerSlice, { State as GuildManagerState } from './slices/guildManager';
import mainSlice, { State as MainState } from './slices/main';
import userSlice, { State as UserState } from './slices/user';

export interface StoreState {
    guildManager: GuildManagerState;
    main: MainState;
    user: UserState;
}

const store = configureStore({
    reducer: {
        guildManager: guildManagerSlice,
        main: mainSlice,
        user: userSlice,
    },
});

export default store;
