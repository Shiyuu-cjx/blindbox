import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBlindBoxes, deleteBlindBox } from '../services/api';
import BlindBoxFormModal from '../components/BlindBoxFormModal';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, CircularProgress, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt'; // 新图标

function AdminPage() {
    const [boxes, setBoxes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBox, setEditingBox] = useState(null);
    const navigate = useNavigate(); // 使用 navigate

    const fetchBoxes = async () => {
        setLoading(true);
        try {
            const response = await getAllBlindBoxes();
            setBoxes(response.data);
        } catch (error) {
            console.error("获取盲盒列表失败", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBoxes(); }, []);

    const handleDelete = async (id) => {
        if (window.confirm('确定要删除这个盲盒系列吗？所有关联的款式也会被删除！')) {
            await deleteBlindBox(id);
            fetchBoxes();
        }
    };

    const handleOpenModal = (box = null) => {
        setEditingBox(box);
        setIsModalOpen(true);
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    盲盒系列管理
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
                    添加新系列
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>系列名称</TableCell>
                            <TableCell>价格</TableCell>
                            <TableCell align="right">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {boxes.map((box) => (
                            <TableRow key={box.id}>
                                <TableCell>{box.id}</TableCell>
                                <TableCell>{box.name}</TableCell>
                                <TableCell>¥{box.price}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title="管理款式">
                                        <IconButton color="success" onClick={() => navigate(`/admin/items/${box.id}`)}>
                                            <ListAltIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="编辑系列信息">
                                        <IconButton color="primary" onClick={() => handleOpenModal(box)}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="删除系列">
                                        <IconButton color="error" onClick={() => handleDelete(box.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <BlindBoxFormModal open={isModalOpen} onClose={() => setIsModalOpen(false)} box={editingBox} onSave={fetchBoxes} />
        </Box>
    );
}

export default AdminPage;
