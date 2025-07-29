import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBlindBoxById, drawBlindBox } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ItemDetailModal from '../components/ItemDetailModal'; // 1. 引入新组件
import { Box, Grid, Typography, Button, Paper, CircularProgress, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Chip, CardActionArea } from '@mui/material';

function BlindBoxDetailPage() {
    const { id } = useParams();
    const [box, setBox] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [drawResult, setDrawResult] = useState(null);
    const { updateBalance } = useAuth();

    // --- 新增状态 ---
    const [selectedItem, setSelectedItem] = useState(null);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);

    useEffect(() => {
        const fetchBoxDetails = async () => {
            try {
                const response = await getBlindBoxById(id);
                setBox(response.data);
            } catch (err) {
                setError('获取盲盒详情失败。');
            } finally {
                setLoading(false);
            }
        };
        fetchBoxDetails();
    }, [id]);

    const handleDraw = async () => {
        setError('');
        setDrawResult(null);
        try {
            const response = await drawBlindBox(Number(id));
            setDrawResult(response.data);
            updateBalance(response.data.newBalance);
        } catch (err) {
            setError(err.response?.data?.message || '抽取失败，请稍后再试。');
        }
    };

    // --- 新增处理函数 ---
    const handleItemClick = (item) => {
        setSelectedItem(item);
        setIsItemModalOpen(true);
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;
    if (error && !box) return <Typography color="error" align="center" sx={{ py: 10 }}>{error}</Typography>;
    if (!box) return <Typography align="center" sx={{ py: 10 }}>未找到该盲盒系列。</Typography>;

    return (
        <Box>
            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <img src={box.image} alt={box.name} style={{ width: '100%', borderRadius: '8px' }} />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>{box.name}</Typography>
                            <Typography variant="body1" color="text.secondary" paragraph sx={{ whiteSpace: 'pre-line' }}>{box.description}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>¥{box.price}</Typography>
                            <Button variant="contained" size="large" fullWidth onClick={handleDraw}>立即抽取</Button>
                            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>系列内含款式</Typography>
            <Grid container spacing={2}>
                {box.Items?.map(item => (
                    <Grid item key={item.id} xs={6} sm={4} md={3} lg={2.4}>
                        {/* 2. 让卡片可点击 */}
                        <Paper elevation={1} sx={{ '&:hover': { boxShadow: 4 } }}>
                            <CardActionArea onClick={() => handleItemClick(item)}>
                                <Box sx={{ p: 1, textAlign: 'center' }}>
                                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px' }} />
                                    <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>{item.name}</Typography>
                                </Box>
                            </CardActionArea>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* ... (抽盒结果弹窗) ... */}
            <Dialog open={!!drawResult} onClose={() => setDrawResult(null)}>
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>{drawResult?.drawnItem.isSecret ? "惊天好运！" : "恭喜你！"}</DialogTitle>
                <DialogContent sx={{ textAlign: 'center' }}>
                    <DialogContentText>{drawResult?.message}</DialogContentText>
                    <Box component="img" src={drawResult?.drawnItem.image} alt={drawResult?.drawnItem.name} sx={{ width: 160, height: 160, objectFit: 'cover', borderRadius: 2, my: 2, mx: 'auto' }} />
                    <Typography variant="body2" color="text.secondary">{drawResult?.drawnItem.description}</Typography>
                    {drawResult?.drawnItem.isSecret && (<Chip label="隐藏款" color="warning" sx={{ mt: 2 }} />)}
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button onClick={() => setDrawResult(null)} variant="contained">太棒了！</Button>
                </DialogActions>
            </Dialog>

            {/* 3. 渲染新的款式详情弹窗 */}
            <ItemDetailModal item={selectedItem} open={isItemModalOpen} onClose={() => setIsItemModalOpen(false)} />
        </Box>
    );
}

export default BlindBoxDetailPage;
