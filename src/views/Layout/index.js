import React,{useState,useEffect} from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    PoweroffOutlined,
    FileTextOutlined,
    UsergroupAddOutlined,
    ToolOutlined,
    FileDoneOutlined
  } from '@ant-design/icons';
import { Layout, Menu, theme,Button,Carousel} from 'antd';
import { useNavigate,Outlet } from 'react-router-dom';
import './Layout.scss'
const { Header, Sider, Content } = Layout;

export default () => {
    // 跳转路由
    const navigate = useNavigate();
    // 配置默认路由路径
    const [route,setRoute] = useState('/home/mall')
    useEffect(()=>{
      navigate('/home/mall');
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
    
    function getItem(label, key, icon, children, type) {
      return {
        key,
        icon,
        children,
        label,
        type,
      };
    }


    return (
      <Layout>
          <Sider 
            style={{minHeight:'100vh'}}
            background={colorBgContainer}
            trigger={null}
            collapsible 
            collapsed={collapsed} 
            height={'100%'}
            >
              <div className="logo" ><p>EIS系统</p></div>
              <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['1']}
                items={[
                  getItem('我的', 'sub1', <UserOutlined />, [
                    getItem('订单信息', '1',<FileTextOutlined />),
                  ]),
                  getItem('后台管理', 'sub2', <ToolOutlined />, [
                    getItem('订单管理', '2',<FileDoneOutlined />),
                    getItem('用户管理', '3',<UsergroupAddOutlined />),
                  ]),
                ]}
              />

          </Sider>

          <Layout className="site-layout" >
            <Header
               style={{
                padding: 0,
                background: colorBgContainer, 
               }}
            >
              <button onClick={handleExit}>退出</button>
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: () => setCollapsed(!collapsed),
              })}
              {/* <div className='video'>
                <video src="http://localhost:3000/island.mp4" autoplay muted loop></video>
              </div> */}
              <Button
                className='exit'
                onClick={handleExit}
                type="primary"
                icon={<PoweroffOutlined />}
              >
                退出登录
              </Button>
            </Header>
         
            <Content
              style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
                overflow:'auto',
              }}
            >
              <Outlet/>
            </Content>
          </Layout>
      </Layout>
    );
}