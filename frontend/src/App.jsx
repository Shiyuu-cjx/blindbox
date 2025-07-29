import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import BlindBoxDetailPage from './pages/BlindBoxDetailPage';
import OrdersPage from './pages/OrdersPage';
import ShowsPage from './pages/ShowsPage';
import AdminPage from './pages/AdminPage';
import AdminItemsPage from './pages/AdminItemsPage';
import ProfilePage from './pages/ProfilePage';

function NotFoundPage() { return <h1 className="text-3xl font-bold">404 - 页面未找到</h1>; }

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<HomePage />} />
                    <Route path="orders" element={<OrdersPage />} />
                    <Route path="shows" element={<ShowsPage />} />
                    <Route path="box/:id" element={<BlindBoxDetailPage />} />
                    <Route
                        path="admin"
                        element={<ProtectedRoute adminOnly={true}><AdminPage /></ProtectedRoute>}
                    />
                    <Route
                        path="admin/items/:seriesId"
                        element={<ProtectedRoute adminOnly={true}><AdminItemsPage /></ProtectedRoute>}
                    />
                    <Route path="profile" element={<ProfilePage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
}

export default App;
