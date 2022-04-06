import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DiscordAPI } from '@uoa-discords/shared-utils';
import './App.css';
import AccountPage from './components/AccountPage';
import Apply from './components/Apply';
import Auth from './components/Auth';
import LoginRedirect from './components/LoginRedirect';
import MainPage from './components/MainPage';
import NotFound from './components/NotFound';
import useDiscordAccess from './hooks/useDiscordAccess';
import useDiscordUser from './hooks/useDiscordUser';

function App() {
    const { discordAccess } = useDiscordAccess();
    const { user, setUser } = useDiscordUser();

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

    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<MainPage />} />
                <Route path="auth" element={<Auth />} />
                <Route path="me" element={<AccountPage />} />
                <Route path="login" element={<LoginRedirect />} />
                <Route path="apply" element={<Apply />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
