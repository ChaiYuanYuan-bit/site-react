import React,{useEffect} from 'react';
import {notification} from 'antd'

const GlobalNotification = ({noteMsg}) => {
    const {type,description} = noteMsg
    const [api, contextHolder] = notification.useNotification();
    useEffect(()=>{
        //如果type有值，打开通知框
        if(type){
        api[type]({
            message:'系统提示',
            description,
            duration:1.2,
            });
        }
    },[noteMsg,api])
    return (
        <>
            {contextHolder}
        </>
    );
}

export default GlobalNotification;
