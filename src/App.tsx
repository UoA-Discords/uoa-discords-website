import React from 'react';
import { useCookies } from 'react-cookie';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Auth from './components/Auth';
import MainPage from './components/MainPage';
import LoginResponse from './types/LoginResponse';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<MainPage />} />
                <Route path="auth" element={<Auth />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
