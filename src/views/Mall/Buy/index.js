import React from 'react';
import { useNavigate } from 'react-router-dom';
import MaskLayout from '../../../components/MaskLayout';

const Buy = () => {
    // 路由
    const navigate = useNavigate();
    const closeBuyPage = ()=>{
        navigate('/home/mall');
    }

    return (
        <MaskLayout onClose={closeBuyPage}>
           下单 .......
        </MaskLayout>
    );
}

export default Buy;
