import React, { useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function BackgroundMusic({ src }) {
    const audioRef = useRef(null);
    const { user } = useAuth(); // 获取全局用户登录状态

    // 使用 useEffect 来监听 user 状态的变化
    useEffect(() => {
        // 检查 audio 元素是否存在
        if (audioRef.current) {
            if (user) {
                // 如果用户存在 (已登录)，则尝试播放音乐
                audioRef.current.play().catch(error => {
                    console.error("音乐播放失败:", error);
                });
            } else {
                // 如果用户不存在 (未登录或已退出)，则暂停音乐
                audioRef.current.pause();
            }
        }
    }, [user]); // 这个 effect 的依赖是 user，所以只在登录或退出时触发

    // 这个组件只负责播放逻辑，不需要在页面上显示任何东西
    return <audio ref={audioRef} src={src} loop />;
}

export default BackgroundMusic;
