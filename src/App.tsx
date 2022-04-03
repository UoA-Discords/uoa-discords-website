import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import AccountPage from './components/AccountPage';
import Auth from './components/Auth';
import LoginRedirect from './components/LoginRedirect';
import MainPage from './components/MainPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<MainPage />} />
                <Route path="auth" element={<Auth />} />
                <Route path="me" element={<AccountPage />} />
                <Route path="login" element={<LoginRedirect />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
