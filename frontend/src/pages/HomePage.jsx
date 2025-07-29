import React, { useState, useEffect, useCallback } from 'react';
import { getAllBlindBoxes } from '../services/api';
import BlindBoxCard from '../components/BlindBoxCard';

// 引入 MUI 组件
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress'; // 加载动画

function HomePage() {
    const [boxes, setBoxes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchBoxes = useCallback(async (search) => {
        try {
            setLoading(true);
            const response = await getAllBlindBoxes(search);
            setBoxes(response.data);
        } catch (err) {
            setError('获取盲盒数据失败，请稍后再试。');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBoxes('');
    }, [fetchBoxes]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchBoxes(searchTerm);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    盲盒列表
                </Typography>
                <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex' }}>
                    <TextField
                        size="small"
                        variant="outlined"
                        placeholder="搜索盲盒..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button type="submit" variant="contained" sx={{ ml: 1 }}>
                        搜索
                    </Button>
                </Box>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error" align="center" sx={{ py: 10 }}>{error}</Typography>
            ) : boxes.length > 0 ? (
                <Grid container spacing={4}>
                    {boxes.map(box => (
                        <Grid item key={box.id} xs={12} sm={6} md={4} lg={3}>
                            <BlindBoxCard box={box} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography align="center" sx={{ py: 10 }}>
                    没有找到匹配的盲盒系列。
                </Typography>
            )}
        </Box>
    );
}

export default HomePage;
