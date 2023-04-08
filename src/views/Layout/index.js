import React from 'react';
import { useNavigate } from 'react-router-dom';

const Layout = () => {
    //跳转路由
    const navigate = useNavigate()  
    //退出
    const handleExit = ()=>{
        //清除系统缓存
        sessionStorage.clear()
        localStorage.clear()
        //跳转到登录页
        navigate('/')
    }
    return (
        <div>
            <button onClick={handleExit}>退出系统</button>
        </div>
    );
}

export default Layout;
