import React,{useState} from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    HomeOutlined,
    VideoCameraOutlined,
    NotificationOutlined,
    MailOutlined
  } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Layout.scss'
const { Header, Sider, Content } = Layout;

//顶部菜单
const headerItems = [
    {
        label: '个人中心',
        key: 'mine',
        icon: <UserOutlined />,
        children: [
          {
            key:'myInfo',
            label: '个人信息',
          },
          {
            key:'setPwd',
            label: '修改密码',
          },
          {
              key:'exit',
              label: '退出系统',
            },
        ],
      },
    {
    label: '通知',
    key: 'note',
    icon: <NotificationOutlined />,
    },
    {
        label: '邮件',
        key: 'mail',
        icon: <MailOutlined />,
    },
    {
        label: '首页',
        key: 'home',
        icon: <HomeOutlined />,
    },
];

export default () => {
    //跳转路由
    const navigate = useNavigate();
    //顶部菜单蓝状态
    const [current, setCurrent] = useState('home');
    //退出
    const handleExit = ()=>{
        //清除系统缓存
        sessionStorage.clear()
        localStorage.clear()
        //跳转到登录页
        navigate('/')
    }

    const [collapsed, setCollapsed] = useState(false);

    //顶部菜单点击事件
    const handleTop = (e) => {
        setCurrent(e.key);
      };

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout className='ant-layout'>
      <Sider trigger={null}
       collapsible 
       collapsed={collapsed} 
       height={'100%'}
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
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display:'flex'
          }}
        >
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
         <Menu style={{flexDirection:'row-reverse',flex:1}} onClick={handleTop} selectedKeys={[current]} mode="horizontal" items={headerItems} />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          Content
        </Content>
      </Layout>
    </Layout>
    );
}