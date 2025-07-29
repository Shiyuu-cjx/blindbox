import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// 引入 MUI 组件
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Box from '@mui/material/Box';

function BlindBoxCard({ box }) {
    return (
        <Card sx={{ maxWidth: 345, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' } }}>
            <CardActionArea component={RouterLink} to={`/box/${box.id}`}>
                <CardMedia
                    component="img"
                    height="140"
                    image={box.image}
                    alt={box.name}
                    sx={{ height: 200, objectFit: 'cover' }}
                />
                <CardContent>
                    <Typography gutterBottom variant="h6" component="div" noWrap>
                        {box.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {box.series}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                            ¥{box.price}
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default BlindBoxCard;
