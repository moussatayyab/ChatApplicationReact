import React, { useEffect, useState } from 'react'; // Import useState
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import {isUserLoggedIn } from '../auth/service/storage/storage';
import { useLocation } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const [isUser, setIsUser] = useState(false); // State to hold customer status
    const location = useLocation();

    const handleSignOut = () => {
        navigate("/login");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }

    useEffect(() => {
        // Define an async function to fetch user roles
        const fetchUserRoles = async () => {
            try {
                const isUser = await isUserLoggedIn(); // Check if customer
                setIsUser(isUser); // Set isCustomer state
            } catch (error) {
                console.error("Error fetching user roles:", error);
            }
        };

        // Call the async function
        fetchUserRoles();
    }, [location]); // Run only once on component mount

    return (
        <>
            {!isUser && (
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                Chat App
                            </Typography>
                            <Button component={Link} to="/login" color="inherit">Login</Button>
                            <Button component={Link} to="/register" color="inherit">Register</Button>
                        </Toolbar>
                    </AppBar>
                </Box>
            )}
           
            {isUser && (
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                Chat App
                            </Typography>
                            <Button component={Link} to="/user/dashboard" color="inherit">Dashboard</Button>
                            <Button component={Link} to="/user/chat" color="inherit">Inbox</Button>
                            <Button color="inherit" onClick={handleSignOut}>Logout</Button>
                        </Toolbar>
                    </AppBar>
                </Box>
            )}
        </>
    )
}

export default Header;
