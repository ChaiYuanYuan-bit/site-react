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
            trigger={null}
            collapsible 
            collapsed={collapsed} 
            >
              <div className="back-firstpage"><a onClick={()=>{navigate('/home/mall')}}>首页</a></div>
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
            <div>Made by Group：“SHU高材生”  |  Group Member： 柴园园 & 卞钟晗</div>
            </div>
          </Layout>
      </Layout>
    );
}