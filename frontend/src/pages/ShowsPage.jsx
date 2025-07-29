import React, { useState, useEffect, useCallback } from 'react';
import { getAllShows, deleteShow } from '../services/api';
import ShowCard from '../components/ShowCard';
import SelectOrderForShowModal from '../components/SelectOrderForShowModal';
import CreateShowModal from '../components/CreateShowModal';
import { Box, Typography, Button, Grid, CircularProgress, TextField } from '@mui/material';

function ShowsPage() {
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // 新增：搜索词状态
    const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [orderToShow, setOrderToShow] = useState(null);

    const fetchShows = useCallback(async (search) => {
        try {
            setLoading(true);
            const response = await getAllShows(search);
            setShows(response.data);
        } catch (err) {
            setError('获取玩家秀数据失败，请稍后重试。');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchShows(''); // 初始加载
    }, [fetchShows]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchShows(searchTerm);
    };

    const handleDeleteShow = async (showId) => {
        if (window.confirm('确定要删除这个帖子吗？')) {
            try {
                await deleteShow(showId);
                fetchShows(searchTerm); // 删除后按当前搜索词刷新
            } catch (error) {
                console.error("删除帖子失败", error);
                alert('删除失败！');
            }
        }
    };

    const handleOrderSelected = (order) => {
        setIsSelectModalOpen(false);
        setOrderToShow(order);
        setIsCreateModalOpen(true);
    };

    const handleCreateModalClose = () => {
        setIsCreateModalOpen(false);
        setOrderToShow(null);
    };

    const handleShowCreated = () => {
        handleCreateModalClose();
        fetchShows(searchTerm); // 创建成功后按当前搜索词刷新
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    玩家秀广场
                </Typography>
                <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                        size="small"
                        variant="outlined"
                        placeholder="搜索帖子标题..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button type="submit" variant="contained" sx={{ ml: 1 }}>
                        搜索
                    </Button>
                </Box>
                <Button variant="contained" color="secondary" onClick={() => setIsSelectModalOpen(true)}>
                    发布新分享
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
            ) : error ? (
                <Typography color="error" align="center" sx={{ py: 10 }}>{error}</Typography>
            ) : shows.length === 0 ? (
                <Typography align="center" sx={{ py: 10 }}>没有找到匹配的帖子。</Typography>
            ) : (
                <Grid container spacing={4}>
                    {shows.map((show) => (
                        <Grid item key={show.id} xs={12} sm={6} md={4}>
                            <ShowCard show={show} onDelete={handleDeleteShow} onCommentAdded={() => fetchShows(searchTerm)} />
                        </Grid>
                    ))}
                </Grid>
            )}

            <SelectOrderForShowModal isOpen={isSelectModalOpen} onClose={() => setIsSelectModalOpen(false)} onOrderSelect={handleOrderSelected} />
            {isCreateModalOpen && <CreateShowModal order={orderToShow} onClose={handleCreateModalClose} onShowCreated={handleShowCreated} />}
        </Box>
    );
}

export default ShowsPage;
