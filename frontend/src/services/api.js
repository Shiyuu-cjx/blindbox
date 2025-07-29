import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' }
});

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// 用户认证 API
export const registerUser = (userData) => apiClient.post('/users/register', userData);
export const loginUser = (userData) => apiClient.post('/users/login', userData);
export const changePassword = (passwordData) => apiClient.put('/users/change-password', passwordData);

// 盲盒 API
export const getAllBlindBoxes = (searchTerm = '') => apiClient.get(`/blindboxes?search=${searchTerm}`);
export const getBlindBoxById = (id) => apiClient.get(`/blindboxes/${id}`);
export const createBlindBox = (boxData) => apiClient.post('/blindboxes', boxData);
export const updateBlindBox = (id, boxData) => apiClient.put(`/blindboxes/${id}`, boxData);
export const deleteBlindBox = (id) => apiClient.delete(`/blindboxes/${id}`);

// 订单 API
export const drawBlindBox = (blindBoxId) => apiClient.post('/orders', { blindBoxId });
export const getMyOrders = () => apiClient.get('/orders');

// 玩家秀 API - [已升级]
export const getAllShows = (searchTerm = '') => apiClient.get(`/shows?search=${searchTerm}`);
export const createShow = (showData) => apiClient.post('/shows', showData);
export const deleteShow = (showId) => apiClient.delete(`/shows/${showId}`);
export const createComment = (showId, commentData) => apiClient.post(`/comments/show/${showId}`, commentData);

// 款式管理 API
export const createItem = (itemData) => apiClient.post('/items', itemData);
export const updateItem = (id, itemData) => apiClient.put(`/items/${id}`, itemData);
export const deleteItem = (id) => apiClient.delete(`/items/${id}`);
