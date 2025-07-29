import React, { useState, useEffect } from 'react';
import { createBlindBox, updateBlindBox } from '../services/api';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Alert } from '@mui/material';

function BlindBoxFormModal({ open, onClose, box, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        series: '',
        price: '',
        image: '',
        description: '',
    });
    const [error, setError] = useState('');
    const isEditMode = Boolean(box);

    useEffect(() => {
        if (box) {
            setFormData(box);
        } else {
            // Reset form for "add" mode
            setFormData({ name: '', series: '', price: '', image: '', description: '' });
        }
    }, [box, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setError('');
        try {
            if (isEditMode) {
                await updateBlindBox(box.id, formData);
            } else {
                await createBlindBox(formData);
            }
            onSave(); // 通知父组件保存成功
            onClose(); // 关闭弹窗
        } catch (err) {
            setError('操作失败，请检查输入内容。');
            console.error(err);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{isEditMode ? '编辑盲盒系列' : '添加新系列'}</DialogTitle>
            <DialogContent>
                <TextField name="name" label="系列名称" value={formData.name} onChange={handleChange} fullWidth margin="dense" required />
                <TextField name="series" label="副标题/分类" value={formData.series} onChange={handleChange} fullWidth margin="dense" />
                <TextField name="price" label="价格" type="number" value={formData.price} onChange={handleChange} fullWidth margin="dense" required />
                <TextField name="image" label="主图链接" value={formData.image} onChange={handleChange} fullWidth margin="dense" required />
                <TextField name="description" label="描述" value={formData.description} onChange={handleChange} fullWidth margin="dense" multiline rows={3} />
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>取消</Button>
                <Button onClick={handleSubmit} variant="contained">保存</Button>
            </DialogActions>
        </Dialog>
    );
}

export default BlindBoxFormModal;
