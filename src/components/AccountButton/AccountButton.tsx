import { Collapse } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import useUser from '../../hooks/useUser';
import discordIcon from '../../images/discordIcon.svg';
import './AccountButton.css';

const AccountButton = () => {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const { user } = useUser();

    if (user)
        return (
            <Link to="/me">
                <div
                    onMouseOver={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="noSelect accountButton"
                >
                    <img
                        src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                        height="20"
                        alt="Your Discord profile"
                    />
                    <Collapse in={isHovered} orientation="horizontal">
                        <span>{user.username}</span>
                    </Collapse>
                </div>
            </Link>
        );

    return (
        <Link to="/login">
            <div
                onMouseOver={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="noSelect accountButton"
            >
                <img src={discordIcon} height="20" alt="Discord Logo" />
                <Collapse in={isHovered} orientation="horizontal">
                    <span>Log in</span>
                </Collapse>
            </div>
        </Link>
    );
};

export default AccountButton;
