import React from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function ItemDetailModal({ item, open, onClose }) {
    if (!item) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ m: 0, p: 2 }}>
                {item.name}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box component="img" src={item.image} alt={item.name} sx={{ width: '100%', borderRadius: 2, mb: 2 }} />
                <Typography gutterBottom>
                    {item.description || '暂无详细描述。'}
                </Typography>
                {item.isSecret && (
                    <Typography color="error" variant="subtitle2">
                        这是一个隐藏款！
                    </Typography>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default ItemDetailModal;
