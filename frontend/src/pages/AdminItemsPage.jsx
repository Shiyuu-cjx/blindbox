import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { getBlindBoxById, deleteItem } from '../services/api';
import ItemFormModal from '../components/ItemFormModal';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, CircularProgress, Link, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function AdminItemsPage() {
    const { seriesId } = useParams();
    const [series, setSeries] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const fetchItems = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getBlindBoxById(seriesId);
            setSeries(response.data);
        } catch (error) {
            console.error("获取数据失败", error);
            setError('获取款式列表失败，请稍后重试。');
        } finally {
            setLoading(false);
        }
    }, [seriesId]);

    useEffect(() => { fetchItems(); }, [fetchItems]);

    const handleDelete = async (id) => {
        if (window.confirm('确定要删除这个款式吗？')) {
            try {
                await deleteItem(id);
                fetchItems(); // 成功后刷新
            } catch (err) {
                console.error("删除款式失败:", err);
                alert('删除失败，请查看控制台获取更多信息。');
            }
        }
    };

    const handleOpenModal = (item = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!series) return <Typography>系列未找到。</Typography>;

    return (
        <Box>
            <Link component={RouterLink} to="/admin" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ArrowBackIcon sx={{ mr: 1 }} />
                返回系列管理
            </Link>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    管理款式: {series.name}
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
                    添加新款式
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>款式名称</TableCell>
                            <TableCell>隐藏款?</TableCell>
                            <TableCell align="right">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {series.Items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.isSecret ? '是' : '否'}</TableCell>
                                <TableCell align="right">
                                    <IconButton color="primary" onClick={() => handleOpenModal(item)}><EditIcon /></IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(item.id)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <ItemFormModal open={isModalOpen} onClose={() => setIsModalOpen(false)} item={editingItem} seriesId={seriesId} onSave={fetchItems} />
        </Box>
    );
}

export default AdminItemsPage;
