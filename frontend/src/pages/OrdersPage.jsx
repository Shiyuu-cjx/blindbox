import React, { useState, useEffect } from 'react';
import { getMyOrders, getAllShows } from '../services/api';
import { useNavigate } from 'react-router-dom';
import CreateShowModal from '../components/CreateShowModal';
import ItemDetailModal from '../components/ItemDetailModal'; // 1. 引入新组件
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Button, Paper, CircularProgress, ListItemButton } from '@mui/material';

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [shownOrderIds, setShownOrderIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const navigate = useNavigate();

    // --- 新增状态 ---
    const [selectedItem, setSelectedItem] = useState(null);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const [ordersResponse, showsResponse] = await Promise.all([getMyOrders(), getAllShows()]);
                setOrders(ordersResponse.data);
                const shownIds = new Set(showsResponse.data.map(show => show.OrderId));
                setShownOrderIds(shownIds);
            } catch (err) {
                setError('获取数据失败，请稍后重试。');
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const handleOpenModal = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    // --- 新增处理函数 ---
    const handleItemClick = (item) => {
        setSelectedItem(item);
        setIsItemModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
        setIsModalOpen(false);
    };

    const handleShowCreated = () => navigate('/shows');

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;
    if (error) return <Typography color="error" align="center" sx={{ py: 10 }}>{error}</Typography>;

    return (
        <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>我的订单历史</Typography>
            {orders.length === 0 ? (
                <Typography align="center" sx={{ py: 10 }}>你还没有抽取过任何盲盒哦！</Typography>
            ) : (
                <List sx={{ width: '100%' }}>
                    {orders.map((order) => {
                        if (!order.Item || !order.Item.BlindBox) return null;
                        const isShown = shownOrderIds.has(order.id);
                        return (
                            <Paper key={order.id} elevation={2} sx={{ mb: 2 }}>
                                {/* 2. 使用 ListItemButton 使其可点击 */}
                                <ListItemButton>
                                    <ListItem
                                        onClick={() => handleItemClick(order.Item)}
                                        secondaryAction={
                                            isShown ? (
                                                <Button variant="outlined" disabled>已分享</Button>
                                            ) : (
                                                <Button variant="contained" color="secondary" onClick={(e) => { e.stopPropagation(); handleOpenModal(order); }}>
                                                    去秀一下
                                                </Button>
                                            )
                                        }
                                        sx={{ pl: 0 }} // 移除 ListItem 的默认左边距
                                    >
                                        <ListItemAvatar>
                                            <Avatar variant="rounded" src={order.Item.image} sx={{ width: 56, height: 56, mr: 2 }} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={<Typography variant="h6">{order.Item.name}</Typography>}
                                            secondary={`来自系列: ${order.Item.BlindBox.name} | 订单日期: ${new Date(order.createdAt).toLocaleDateString()}`}
                                        />
                                    </ListItem>
                                </ListItemButton>
                            </Paper>
                        );
                    })}
                </List>
            )}
            {isModalOpen && <CreateShowModal order={selectedOrder} onClose={handleCloseModal} onShowCreated={handleShowCreated} />}
            {/* 3. 渲染新的款式详情弹窗 */}
            <ItemDetailModal item={selectedItem} open={isItemModalOpen} onClose={() => setIsItemModalOpen(false)} />
        </Box>
    );
}

export default OrdersPage;
