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
  getItem('商城', '/home/mall', <ShoppingOutlined />),
  getItem('我的', 'employee', <UserOutlined />, [
    getItem('订单信息', '/home/myOrder',<FileTextOutlined />),
  ]),
  getItem('后台管理', 'manager', <ToolOutlined />, [
    getItem('订单管理', '2',<FileDoneOutlined />),
    getItem('用户管理', '3',<UsergroupAddOutlined />),
  ]),
];

export default () => {
    // 跳转路由
    const navigate = useNavigate();
    // sider折叠状态
    const [collapsed, setCollapsed] = useState(false);
    // sider权限
    const [siderItem,setSiderItem] = useState([]);
    useEffect(()=>{ 
    //判断是否为登录状态
    const token = sessionStorage.getItem('token')
    if(sessionStorage.getItem('token'))
    {
      //获取用户类型
      const roleTypeId = jwtDecode(token).roleTypeId;
      if(roleTypeId===1)
      {
        setSiderItem(siderList.filter(item=>item.key!=='employee'));
      }
      else if(roleTypeId===2){
        setSiderItem(siderList.filter(item=>item.key!=='manager'));
      }
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
      navigate(e.key, { replace: true })
      sessionStorage.setItem('path',e.key);
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
                defaultSelectedKeys={sessionStorage.getItem('path')?sessionStorage.getItem('path'):'/home/mall'}
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