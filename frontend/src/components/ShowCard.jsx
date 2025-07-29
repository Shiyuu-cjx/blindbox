import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createComment } from '../services/api';
import { Card, CardContent, CardMedia, Typography, Box, Avatar, IconButton, Collapse, TextField, Button, List, ListItem, ListItemAvatar, ListItemText, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CommentIcon from '@mui/icons-material/Comment';

function ShowCard({ show, onDelete, onCommentAdded }) {
    // --- 关键修正 ---
    // 增加全面的安全检查，如果核心数据不存在，则不渲染此卡片
    if (!show || !show.User || !show.Order || !show.Order.Item) {
        return null;
    }

    const { user } = useAuth();
    const [expanded, setExpanded] = useState(false);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleExpandClick = () => setExpanded(!expanded);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim() || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await createComment(show.id, { content: comment });
            setComment('');
            if (onCommentAdded) {
                onCommentAdded();
            }
        } catch (error) {
            console.error("评论失败", error);
            alert('评论失败，请稍后再试。');
        } finally {
            setIsSubmitting(false);
        }
    };

    const canDelete = user && (user.role === 'admin' || user.id === show.User.id);

    return (
        <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <CardMedia component="img" height="194" image={show.image || show.Order.Item.image} alt={show.title} />
            <CardContent>
                <Typography variant="h6">{show.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{show.content}</Typography>
            </CardContent>
            <Box sx={{ p: 2, mt: 'auto', borderTop: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: 24, height: 24, mr: 1 }}>{show.User.username.charAt(0)}</Avatar>
                    <Typography variant="caption">{show.User.username}</Typography>
                </Box>
                <Box>
                    <IconButton onClick={handleExpandClick}><CommentIcon /></IconButton>
                    {canDelete && <IconButton color="error" onClick={() => onDelete(show.id)}><DeleteIcon /></IconButton>}
                </Box>
            </Box>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography variant="subtitle2">评论区</Typography>
                    <List dense>
                        {(show.Comments || []).map(c => (
                            <ListItem key={c.id}>
                                <ListItemAvatar><Avatar sx={{ width: 24, height: 24 }}>{c.User?.username?.charAt(0) || '?'}</Avatar></ListItemAvatar>
                                <ListItemText primary={c.User?.username || '匿名用户'} secondary={c.content} />
                            </ListItem>
                        ))}
                    </List>
                    <Divider sx={{ my: 1 }} />
                    <Box component="form" onSubmit={handleCommentSubmit} sx={{ display: 'flex', gap: 1 }}>
                        <TextField size="small" fullWidth label="添加评论..." value={comment} onChange={(e) => setComment(e.target.value)} disabled={isSubmitting} />
                        <Button type="submit" variant="contained" size="small" disabled={isSubmitting}>
                            {isSubmitting ? '发送中...' : '发送'}
                        </Button>
                    </Box>
                </CardContent>
            </Collapse>
        </Card>
    );
}

export default ShowCard;
