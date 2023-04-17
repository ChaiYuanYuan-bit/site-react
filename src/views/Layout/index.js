import React,{useState,useEffect} from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    PoweroffOutlined,
    FileTextOutlined,
    UsergroupAddOutlined,
    ToolOutlined,
    FileDoneOutlined,
    ShoppingOutlined,
  } from '@ant-design/icons';
import { Layout, Menu,Button} from 'antd';
import { useNavigate,Outlet } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { useSelector } from 'react-redux';
import './Layout.scss'

const { Header, Sider, Content } = Layout;

//sider item包装
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

//sider选项
const siderList = [
  getItem('商城', 'mall', <ShoppingOutlined />),
  getItem('我的', 'employee', <UserOutlined />, [
    getItem('订单信息', 'mine',<FileTextOutlined />),
  ]),
  getItem('后台管理', 'manager', <ToolOutlined />, [
    getItem('订单管理', 'orders',<FileDoneOutlined />),
    getItem('用户管理', 'users',<UsergroupAddOutlined />),
  ]),
];

export default () => {
    // 跳转路由
    const navigate = useNavigate();
    // 取出用户信息
    const {info:userInfo} = useSelector(store=>store.userInfo);
    // sider折叠状态
    const [collapsed, setCollapsed] = useState(false);
    // sider权限
    const [siderItem,setSiderItem] = useState([]);
    useEffect(()=>
    { 
      //判断是否为登录状态
      const token = sessionStorage.getItem('token')
      if(sessionStorage.getItem('token'))
      {
        //获取用户类型
        const roleTypeId = userInfo.roleType.roleTypeId;
        setSiderItem(siderList);
        // if(roleTypeId===1)
        // {
        //   setSiderItem(siderList.filter(item=>item.key!=='employee'));
        // }
        // else if(roleTypeId===2){
        //   setSiderItem(siderList.filter(item=>item.key!=='manager'));
        // }
        const path = sessionStorage.getItem('path');
        //如果保存过路径，就跳转到上一次路径
        if(path)
        {
          navigate(path,{
            replace:true
          });
        }
        else{
          navigate('/home/mall',{
            replace:true
          });
        }
      }
      else{
        navigate('/');
      }
    },[])
    //退出
    const handleExit = ()=>{
        //清除系统缓存
        sessionStorage.clear()
        localStorage.clear()
        //跳转到登录页
        navigate('/')
    }

    // sider点击跳转
    const onClick = (e) => {
      switch(e.key)
      {
        case 'mall':
          navigate('/home/mall', { replace: false });
          sessionStorage.setItem('path','/home/mall');
          break;
        case 'mine':
          navigate('/home/mine', { replace: false});
          sessionStorage.setItem('path','/home/mine');
          break;
        case 'orders':
          navigate('/home/orders', { replace: false});
          sessionStorage.setItem('path','/home/orders');
          break;
        case 'users':
          navigate('/home/users', { replace: false});
          sessionStorage.setItem('path','/home/users');
          break;
      }
    }
    //返回sider所选的按键
    const getPath = ()=>{
      const path = sessionStorage.getItem('path');
      if(path)
      {
        if(path.includes('mall'))
        {
          return 'mall';
        } 
        else if(path.includes('mine'))
        {
          return 'mine'
        }
        else if(path.includes('orders'))
        {
          return 'orders';
        }
        else if(path.includes('users'))
        {
          return 'users';
        }
      }
      return 'mall';
    }

    return (
      <Layout>
          <Sider 
            trigger={null}
            collapsible 
            collapsed={collapsed} 
            >
              <div className="logo">
                {/* EIS商城 &nbsp; <ShoppingCartOutlined rotate={330} style={{ fontSize: '22px', color: '#91caff' }}/> */}
              </div>
              <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={getPath()}
                defaultOpenKeys={['employee','manager']}
                onClick={onClick}
                items={siderItem}
              />
          </Sider>

            <Layout className="ant-layout-right" >
              <Header >
                {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                  className: 'trigger',
                  onClick: () => setCollapsed(!collapsed),
                })}

              <Button
                className='exit'
                onClick={handleExit}
                type="primary"
                icon={<PoweroffOutlined />}
              >
                退出登录
              </Button>
            </Header>
         
            <Content className='content'>
              <Outlet/>
            </Content>
            <div className='footer'>
            <div>本网站为：携程前端训练营-结营大作业</div>
            <div>Create by Group：“SHU高材生”  |  Group Member： 柴园园 & 卞钟晗</div>
            </div>
          </Layout>
      </Layout>
    );
}