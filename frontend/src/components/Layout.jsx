import React, { useState } from 'react';
import { Outlet, Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box, Link, Chip, Menu, MenuItem, IconButton, Avatar } from '@mui/material';
import backgroundImage from '../assets/background.jpg';
import BackgroundMusic from './BackgroundMusic'; // 1. 引入音乐组件

function Layout() {
    const { user, balance, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleLogout = () => {
        handleClose();
        logout();
        navigate('/login');
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
        }}>
            {/* 2. 在这里放置音乐组件 */}
            <BackgroundMusic src="/background-music.mp3" />

            <AppBar position="fixed" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link component={RouterLink} to="/" underline="none" color="primary" sx={{ fontWeight: 'bold' }}>
                            界园-盲盒
                        </Link>
                    </Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <Button component={RouterLink} to="/" sx={{ color: 'text.primary' }}>首页</Button>
                        <Button component={RouterLink} to="/orders" sx={{ color: 'text.primary' }}>我的订单</Button>
                        <Button component={RouterLink} to="/shows" sx={{ color: 'text.primary' }}>用户广场</Button>
                        {user?.role === 'admin' && <Button component={RouterLink} to="/admin" sx={{ color: 'error.main' }}>后台管理</Button>}
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    {user && (
                        <>
                            <Chip label={`余额: ¥${balance.toFixed(2)}`} color="success" variant="outlined" sx={{ mr: 2 }} />
                            <IconButton onClick={handleMenu} size="small">
                                <Avatar sx={{ width: 32, height: 32 }}>{user.username.charAt(0)}</Avatar>
                            </IconButton>
                            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                                <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>账号设置</MenuItem>
                                <MenuItem onClick={handleLogout}>退出登录</MenuItem>
                            </Menu>
                        </>
                    )}
                </Toolbar>
            </AppBar>

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(5px)', borderRadius: 2, p: 3 }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}

export default Layout;
