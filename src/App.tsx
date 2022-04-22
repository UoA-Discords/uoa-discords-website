import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DiscordAPI } from '@uoa-discords/shared-utils';
import './App.css';
import AccountPage from './components/AccountPage';
import Auth from './components/Auth';
import LoginRedirect from './components/LoginRedirect';
import MainPage from './components/MainPage';
import NotFound from './components/NotFound';
import useDiscordAccess from './hooks/useDiscordAccess';
import useDiscordUser from './hooks/useDiscordUser';
import ApplicationsPage from './components/ApplicationsPage';
import { useDispatch } from 'react-redux';
import { loadGuilds } from './redux/slices/guildManager';
import { loadUserGuilds, loadUserLikes } from './redux/slices/user';

function App() {
    const dispatch = useDispatch();
    const { discordAccess } = useDiscordAccess();
    const { user, setUser } = useDiscordUser();

    useEffect(() => {
        dispatch(loadGuilds());
    }, [dispatch]);

    useEffect(() => {
        if (discordAccess && !user) {
            // logged in to discord but no user data
            DiscordAPI.getUserInfo(discordAccess.access_token).then((res) => {
                if (res.success) {
                    setUser(res.data);
                } else {
                    console.error(res.error);
                }
            });
        }
    }, [discordAccess, setUser, user]);

    useEffect(() => {
        if (discordAccess?.access_token) {
            dispatch(loadUserGuilds(discordAccess.access_token));
        }
    }, [discordAccess?.access_token, dispatch]);

    useEffect(() => {
        if (discordAccess?.access_token && user?.id) {
            dispatch(loadUserLikes({ userID: user.id, access_token: discordAccess.access_token }));
        }
    }, [discordAccess?.access_token, dispatch, user?.id]);

    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<MainPage />} />
                <Route path="auth" element={<Auth />} />
                <Route path="me" element={<AccountPage />} />
                <Route path="login" element={<LoginRedirect />} />
                <Route path="applications" element={<ApplicationsPage />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
