import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../services/api';
import { Box, Typography, TextField, Button, Container, Paper, Alert, Snackbar } from '@mui/material';

function ProfilePage() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { logout } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('新密码与确认密码不匹配！');
            return;
        }
        if (newPassword.length < 6) {
            setError('新密码长度不能少于6位！');
            return;
        }

        try {
            await changePassword({ oldPassword, newPassword });
            setSuccess('密码修改成功！为了安全，请重新登录。');
            setTimeout(() => {
                logout(); // 3秒后自动退出登录
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || '操作失败，请稍后再试。');
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    账户设置
                </Typography>
                <Typography variant="h6" component="h2" gutterBottom>
                    修改密码
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField type="password" label="旧密码" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} fullWidth margin="normal" required />
                    <TextField type="password" label="新密码" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} fullWidth margin="normal" required />
                    <TextField type="password" label="确认新密码" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth margin="normal" required />
                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                        确认修改
                    </Button>
                </Box>
            </Paper>
            <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
                    {success}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default ProfilePage;
