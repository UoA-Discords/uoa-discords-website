import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import api from './api';
import './App.css';
import AccountPage from './components/AccountPage';
import AddGuild from './components/AddGuild';
import Auth from './components/Auth';
import LoginRedirect from './components/LoginRedirect';
import MainPage from './components/MainPage';
import useDiscordAccess from './hooks/useDiscordAccess';
import useUser from './hooks/useUser';

function App() {
    const { discordAccess } = useDiscordAccess();
    const { user, setUser } = useUser();

    useEffect(() => {
        if (discordAccess && !user) {
            // logged in to discord but no user data
            api.getUserInfo(discordAccess.access_token)
                .then(({ status, statusText, data }) => {
                    if (status !== 200) {
                        console.warn(
                            `Got status code ${status} trying to get user data with message: ${statusText}`,
                            data,
                        );
                    }

                    setUser(data);
                })
                .catch((e) => {
                    console.error(e);
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
                <Route path="apply" element={<AddGuild />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
