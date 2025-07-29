import React, { useState } from 'react';
import { createShow } from '../services/api';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Alert, Box, CircularProgress } from '@mui/material';

function CreateShowModal({ order, onClose, onShowCreated }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const showData = {
                title,
                content,
                image,
                orderId: order.id,
            };
            await createShow(showData);
            // --- 关键修正 ---
            // 成功后，直接调用父组件的回调函数，不再处理自身状态
            onShowCreated();
        } catch (err) {
            console.error("发布玩家秀失败:", err);
            setError(err.response?.data?.message || '发布失败，请稍后再试。');
            // 失败后，需要停止加载动画
            setIsSubmitting(false);
        }
    };

    if (!order) return null;

    return (
        <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
            <Box component="form" onSubmit={handleSubmit}>
                <DialogTitle>分享你的喜悦！</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        你正在为【{order.Item.name}】创建玩家秀
                    </DialogContentText>
                    <TextField autoFocus margin="dense" id="title" label="标题" type="text" fullWidth variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isSubmitting} />
                    <TextField margin="dense" id="content" label="分享内容" type="text" fullWidth multiline rows={4} variant="outlined" value={content} onChange={(e) => setContent(e.target.value)} required disabled={isSubmitting} />
                    <TextField margin="dense" id="image" label="图片链接 (可选)" type="text" fullWidth variant="outlined" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." disabled={isSubmitting} />
                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={isSubmitting}>取消</Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : '发布'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

export default CreateShowModal;
