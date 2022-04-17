import { configureStore } from '@reduxjs/toolkit';
import guildManagerSlice, { State as GuildManagerState } from './slices/guildManager';
import mainSlice, { State as MainState } from './slices/main';

export interface StoreState {
    guildManager: GuildManagerState;
    main: MainState;
}

const store = configureStore({
    reducer: {
        guildManager: guildManagerSlice,
        main: mainSlice,
    },
});

export default store;
