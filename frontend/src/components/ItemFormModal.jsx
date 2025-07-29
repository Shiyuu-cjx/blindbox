import React, { useState, useEffect } from 'react';
import { createItem, updateItem } from '../services/api';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Alert, FormControlLabel, Checkbox } from '@mui/material';

function ItemFormModal({ open, onClose, item, seriesId, onSave }) {
    const [formData, setFormData] = useState({ name: '', image: '', description: '', isSecret: false });
    const [error, setError] = useState('');
    const isEditMode = Boolean(item);

    useEffect(() => {
        if (item) {
            setFormData({ ...item }); // 使用副本，避免直接修改 props
        } else {
            setFormData({ name: '', image: '', description: '', isSecret: false });
        }
    }, [item, open]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async () => {
        setError('');
        try {
            // 确保 BlindBoxId 被正确传递
            const dataToSend = { ...formData, BlindBoxId: seriesId };
            if (isEditMode) {
                await updateItem(item.id, dataToSend);
            } else {
                await createItem(dataToSend);
            }
            onSave();
            onClose();
        } catch (err) {
            console.error("保存款式失败:", err); // 增加详细的错误日志
            setError('操作失败，请检查输入内容或查看控制台。');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{isEditMode ? '编辑款式' : '添加新款式'}</DialogTitle>
            <DialogContent>
                <TextField name="name" label="款式名称" value={formData.name} onChange={handleChange} fullWidth margin="dense" required />
                <TextField name="image" label="图片链接" value={formData.image} onChange={handleChange} fullWidth margin="dense" required />
                <TextField name="description" label="描述" value={formData.description} onChange={handleChange} fullWidth margin="dense" multiline rows={2} />
                <FormControlLabel control={<Checkbox name="isSecret" checked={formData.isSecret || false} onChange={handleChange} />} label="是否为隐藏款" />
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>取消</Button>
                <Button onClick={handleSubmit} variant="contained">保存</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ItemFormModal;
