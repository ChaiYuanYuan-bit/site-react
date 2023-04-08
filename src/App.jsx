import { useRoutes } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import jwtDecode from "jwt-decode";
import { setInfo } from "./redux/UserInfo";
import { $getOne } from "./api/userApi";
import GlobalNotification from './components/GlobalNotification'
import routes from "./routes";

function App() {
  // 通知框状态
  let [noteMsg,setNoteMsg] = useState({type:'',description:''});

  // redux 分发 hooks
  const dispatch = useDispatch();

  // 加载登录用户信息
  const loadUserInfo = ()=>{
    //判断是否为登录状态
    const token = sessionStorage.getItem('token');
    if(token)
    {
        //获取登录id
        const userId = jwtDecode(token).id;
        // //根据登录id获取用户信息
        $getOne({id:userId})
        .then(response=>dispatch(setInfo(response.userInfo)))
    }
  }
  
  useEffect(()=>{
    loadUserInfo();
},[])
  
  //路由组件
  const element = useRoutes(routes({setNoteMsg,loadUserInfo}));
  return (
    <div>
      {element}
      {/* 全局消息通知 */}
      <GlobalNotification noteMsg = {noteMsg}/>
    </div>
  );
}

export default App;
