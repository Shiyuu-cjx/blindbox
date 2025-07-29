import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [balance, setBalance] = useState(0); // 新增：余额状态

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedBalance = localStorage.getItem('balance'); // 同时检查本地存储的余额
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    setUser({ token, ...decoded });
                    if (savedBalance) {
                        setBalance(parseFloat(savedBalance));
                    }
                } else {
                    localStorage.clear(); // Token 过期，清空所有信息
                }
            } catch (error) {
                console.error("Token 解码失败", error);
                localStorage.clear();
            }
        }
    }, []);

    const login = (token, initialBalance) => {
        localStorage.setItem('token', token);
        localStorage.setItem('balance', initialBalance); // 登录时存储余额
        const decoded = jwtDecode(token);
        setUser({ token, ...decoded });
        setBalance(parseFloat(initialBalance));
    };

    const logout = () => {
        localStorage.clear(); // 退出时清空所有信息
        setUser(null);
        setBalance(0);
    };

    // 新增：更新余额的函数
    const updateBalance = (newBalance) => {
        localStorage.setItem('balance', newBalance);
        setBalance(parseFloat(newBalance));
    };

    return (
        <AuthContext.Provider value={{ user, balance, login, logout, updateBalance }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
