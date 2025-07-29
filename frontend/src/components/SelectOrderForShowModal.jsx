import React, { useState, useEffect } from 'react';
import { getMyOrders, getAllShows } from '../services/api';

// 引入 MUI 组件
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function SelectOrderForShowModal({ isOpen, onClose, onOrderSelect }) {
    const [availableOrders, setAvailableOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            const fetchAvailableOrders = async () => {
                setLoading(true);
                try {
                    const [ordersResponse, showsResponse] = await Promise.all([getMyOrders(), getAllShows()]);
                    const shownOrderIds = new Set(showsResponse.data.map(show => show.OrderId));
                    const unshownOrders = ordersResponse.data.filter(order => !shownOrderIds.has(order.id));
                    setAvailableOrders(unshownOrders);
                } catch (error) {
                    console.error("获取可分享订单失败", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchAvailableOrders();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>选择一个订单来分享</DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
                ) : availableOrders.length > 0 ? (
                    <List>
                        {availableOrders.map(order => (
                            <ListItemButton key={order.id} onClick={() => onOrderSelect(order)}>
                                <ListItemAvatar>
                                    <Avatar variant="rounded" src={order.Item.image} />
                                </ListItemAvatar>
                                <ListItemText primary={order.Item.name} secondary={new Date(order.createdAt).toLocaleDateString()} />
                            </ListItemButton>
                        ))}
                    </List>
                ) : (
                    <Typography align="center" sx={{ p: 4 }}>你没有可以分享的新订单了。</Typography>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default SelectOrderForShowModal;
