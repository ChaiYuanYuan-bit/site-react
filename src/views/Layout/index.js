import React,{useState,useEffect} from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
  } from '@ant-design/icons';
import { Layout, Menu, theme} from 'antd';
import { useNavigate,Outlet } from 'react-router-dom';
import './Layout.scss'
const { Header, Sider, Content } = Layout;

export default () => {
    // 跳转路由
    const navigate = useNavigate();
    // 配置默认路由路径
    const [route,setRoute] = useState('/home/mall')
    useEffect(()=>{
    },[])
    //退出
    const handleExit = ()=>{
        //清除系统缓存
        sessionStorage.clear()
        localStorage.clear()
        //跳转到登录页
        navigate('/')
    }
    const [collapsed, setCollapsed] = useState(false);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout>
          <Sider 
          background={colorBgContainer}
          trigger={null}
          collapsible 
          collapsed={collapsed} 
          >
            <div className="logo" ></div>
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={['1']}
              items={[
                {
                  key: '1',
                  icon: <UserOutlined />,
                  label: 'nav 1',
                },
                {
                  key: '2',
                  icon: <VideoCameraOutlined />,
                  label: 'nav 2',
                },
                {
                  key: '3',
                  icon: <UploadOutlined />,
                  label: 'nav 3',
                },
              ]}
            />
          </Sider>
          <Layout
            style={{
              background: '#eee',
              display:'flex',
              flexDirection:'column',
            }}
          >
            <Header
              style={{
                padding: 0,
                background: colorBgContainer,
                display:'flex'
              }}
            >
              <button onClick={handleExit}>退出</button>
              <button onClick={()=>{navigate('/home/mall')}}>去购物</button>
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: () => setCollapsed(!collapsed),
              })}
            </Header>
         
            <Content
              style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
              }}
            >
              <Outlet/>
            </Content>
          </Layout>
        </Layout>
    );
}