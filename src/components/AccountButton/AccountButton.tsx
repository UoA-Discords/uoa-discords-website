import { Collapse } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useCookies } from 'react-cookie';
import { v4 as uuid } from 'uuid';
import discordIcon from '../../images/discordIcon.svg';
import LoginResponse from '../../types/LoginResponse';
import './AccountButton.css';

const CLIENT_ID = '958568584349618227';
const SCOPES = ['guilds', 'identify'].join('%20');
const REDIRECT_URI = encodeURIComponent(`${window.location.origin}/auth`);

const AccountButton = () => {
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [cookies, setCookie] = useCookies<'oauth_state', { oauth_state?: string; user?: LoginResponse }>([
        'oauth_state',
    ]);

    console.log(cookies);

    const handleLogin = useCallback(() => {
        const state = uuid();
        setCookie('oauth_state', state, { sameSite: 'strict' });
        window.location.href = `https://discord.com/api/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${SCOPES}&state=${state}&redirect_uri=${REDIRECT_URI}&prompt=consent`;
    }, [setCookie]);

    return (
        <div
            onMouseOver={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="noSelect accountButton"
            onClick={handleLogin}
        >
            <img src={discordIcon} height="20" alt="Discord Logo" />
            <Collapse in={isHovered} orientation="horizontal">
                <span>Log in</span>
            </Collapse>
        </div>
    );
};

export default AccountButton;
