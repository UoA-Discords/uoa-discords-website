import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DiscordAPI, PublicRegisteredGuild } from '@uoa-discords/shared-utils';
import './App.css';
import AccountPage from './components/AccountPage';
import Auth from './components/Auth';
import LoginRedirect from './components/LoginRedirect';
import MainPage from './components/MainPage';
import NotFound from './components/NotFound';
import useDiscordAccess from './hooks/useDiscordAccess';
import useDiscordUser from './hooks/useDiscordUser';
import ApplicationsPage from './components/ApplicationsPage';
import server from './api';

function App() {
    const { discordAccess } = useDiscordAccess();
    const { user, setUser } = useDiscordUser();

    const [servers, setServers] = useState<PublicRegisteredGuild[]>([]);
    useEffect(() => {
        server.getServers().then((res) => {
            if (res.success) {
                setServers(res.data);
            } else {
                console.log('Failed to fetch servers');
                console.log(res);
            }
        });
    }, []);

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
                <Route index element={<MainPage servers={servers} />} />
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
