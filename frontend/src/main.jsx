import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx';
import CssBaseline from '@mui/material/CssBaseline'; // 1. 引入 CssBaseline

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <CssBaseline /> {/* 2. 在这里添加 CssBaseline 组件 */}
            <App />
        </AuthProvider>
    </React.StrictMode>,
)
