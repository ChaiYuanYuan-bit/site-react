import React,{useEffect} from 'react';
import { useSelector } from 'react-redux';
import {notification} from 'antd'

const GlobalNotification = () => {
    //获取消息状态
    const {msg} = useSelector((store)=>store.message);
    const {type,description} = msg
    const [api, contextHolder] = notification.useNotification();
    useEffect(()=>{
        //如果type有值，打开通知框
        if(type){
        api[type]({
            message:'系统提示',
            description,
            duration:3.5,
            });
        }
    },[msg,api])
    return (
        <>
            {contextHolder}
        </>
    );
}

export default GlobalNotification;
