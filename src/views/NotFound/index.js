import React from 'react';
import { IoCart } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import './NotFound.scss'

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className='notfound-background'>
            <div className='main-content'>
                <div className='content'>
                    <h1>404 页面不存在 </h1>
                    <div onClick={()=>{navigate(-1,{replace:true})}} title='点击返回' className='back'>
                        <IoCart className='center-icon'/>
                        <h2 className='back-text'>点击返回</h2> 
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
