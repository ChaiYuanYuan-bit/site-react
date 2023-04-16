import { useRoutes } from "react-router-dom";
import { useEffect,useState } from "react";
import { useDispatch } from 'react-redux';
import jwtDecode from "jwt-decode";
import { setInfo } from "./redux/UserInfo";
import { setMsg } from "./redux/Notification";
import { $getOne } from "./api/userApi";
import GlobalNotification from './components/GlobalNotification'
import routes from "./routes";

function App() {
  // redux 分发 hooks
  const dispatch = useDispatch();
  // 加载登录用户信息
  const loadUserInfo = async ()=>{
    //判断是否为登录状态
    const token = sessionStorage.getItem('token');
    if(token)
    {
        //获取登录id
        const userId = jwtDecode(token).id;
        try{
           //根据登录id获取用户信息
            const {success,message,userInfo} = await $getOne({id:userId});
            if(success)
            {
              //保存用户到redux
              dispatch(setInfo({info:{...userInfo}}));
            }
            else{
              dispatch(setMsg({msg:{type:'error',description:message}}));
            }
        }
        catch(err)
        {
          dispatch(setMsg({msg:{type:'error',description:err.message}}));
        }
       
    }
  }

  //全局消息设置
  const sendNotification = (type,description)=>{
    dispatch(setMsg({msg:{type,description}}));
    setTimeout(()=>{
      clearNotification();
    },200)
  }
  // 重置全集消息框
  const clearNotification = ()=>{
    dispatch(setMsg({msg:{type:'',description:''}}));
  }
  useEffect(()=>{
    loadUserInfo();
},[]);
  
  //路由组件
  const element = useRoutes(routes({loadUserInfo,sendNotification}));
  return (
    <>
      {element}
      {/* 全局消息通知 */}
      <GlobalNotification/>
    </>
  );
}

export default App;
