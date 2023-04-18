import React,{ useEffect, useState }  from 'react';
import { Outlet,useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Tag,Tabs,Space,Select,Table,Input,Tooltip,ConfigProvider,Button,Form,Pagination,Drawer  } from 'antd';
import { $getRole } from '../../../api/roleApi';
import {$getUserNum,$getAllUsers} from '../../../api/userApi'
import {renderEmpty} from '../../../utils/emptyRender'
import './UserManage.scss'

const UserManage = () => {
    // 表单实例
    const [form] = Form.useForm();
    // 用户数量
    const [userNum,setUserNum] = useState(0);
    // 所有用户的用户信息
    const [allUserInfo,setAllUserInfo] = useState([]);
    // 用户类型
    const [userType,setUserType] = useState([{id:0,roleName:'全部用户'}]);
    // 所选用户类型
    const [currentUserType,setCurrentUserType] = useState(0);
    // 下拉框状态
    const [searchType,setSearchType] = useState('all');
    // 输入框z状态
    const [inputState,setInputState] = useState('');
    // 当前页码
    const [pageIndex,setPageIndex] = useState(1);
    // 默认显示条数
    const [pageSize,setpageSize] = useState(15);
    // 抽屉状态
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(()=>{
        loadUserType();
        loadUserNum();
        loadAllUsers();
    },[currentUserType,inputState,pageSize,pageIndex]) 
    // 加载用户数量
    const loadUserNum = async()=>{
        try {
            let {success,num,message} = await $getUserNum({
                roleTypeId:currentUserType,
                searchType,
                keyWord:inputState
            });
            if(success)
            {
                setUserNum(num);
            }
            else{
                console.log(message)
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    // 加载用户类型
    const loadUserType = async()=>{
        try {
            let type = await $getRole();
            setUserType([{id:0,roleName:'全部用户'},...type]);
        } catch (error) {
            console.log(error)
        }
    }
    // 加载所有用户
    const loadAllUsers = async ()=>{
        try {
            let params = {
                "_limit":pageSize,
                "_page":pageIndex,
                "roleType.roleTypeId":currentUserType===0?undefined:currentUserType
            };
            switch(searchType)
            {
                case 'all':break;
                case 'username':
                    params = {...params,"username_like":inputState};
                    break;
                case 'phone':
                    params = {...params,"phone_like":inputState};
                    break;
                case 'email':
                    params = {...params,"email_like":inputState};
                    break;
            }
            let users = await $getAllUsers(params);
            users = users.map(item=>({
                key:item.id,
                id:item.id,
                username:item.username,
                phone:item.phone,
                email:item.email,
                balance:item.balance,
                roleTypeId:item.roleType.roleTypeId,
                tags:[item.roleType.roleTypeName]
            }))
            setAllUserInfo(users);
        } catch (error) {
            console.log(error)
        }
    }
    // Tag状态
    const handleTagChange = (value)=>{
        setCurrentUserType(value);
    }
    // 下拉框状态
    const onSelectChange = (value) => {
        setSearchType(value);
        form.resetFields();
    }
    // Input状态
    const onInputChange = (event) =>{
        setInputState(event.target.value.trim())
    }
    //页脚
    const onPageChange = (current) => {
      setPageIndex(current);
    }
    // 每页显示数目变化
    const onShowSizeChange = (current, pageSize) => {
        setpageSize(pageSize);
      };
    // 页脚设置
    const paginationProps = {
        showTotal:(total) => `共 ${total} 项`,
        onChange: onPageChange,
        showSizeChanger: true,
        onShowSizeChange: onShowSizeChange,
        defaultPageSize: pageSize,
        defaultCurrent: pageIndex,
        total:userNum
    };

    const columns = [
        {
          title: 'id',
          dataIndex: 'id',
          key: 'id',
          render: (text) => <a>{text}</a>,
        },
        {
          title: '用户名',
          dataIndex: 'username',
          key: 'username',
          align:'center',
        },
        {
          title: '电话',
          dataIndex: 'phone',
          key: 'phone',
          align:'center',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
            align:'center',
          },
        {
            title: '余额（元）',
            dataIndex: 'balance',
            key: 'balance',
            align:'center',
          },
          
        {
          title: '角色',
          key: 'tags',
          dataIndex: 'tags',
          align:'center',
          render: (_, { tags }) => (
            <>
              {tags.map((tag) => {
                let color = tag.length > 5 ? 'geekblue' : 'green';
                if (tag==='管理员') color = 'geekblue';
                else if(tag === '普通员工') color='green';
                else if (tag === '未授权') color = 'volcano';
                return (
                  <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                  </Tag>
                );
              })}
            </>
          ),
        },
        {
          title: '操作',
          key: 'action',
          align:'center',
          render: (_, {id}) => (
            <Space size="middle">
                <a onClick={()=>{setDrawerOpen(true)}}>修改</a>
              {/* <a>Invite {record.name}</a>
              <a>Delete</a> */}
            </Space>
          ),
        },
      ];

    return (
        <>
            <div className='employee-orderInfo'>
                <Form
                name="search"
                form={form}
                >
                    <Form.Item
                    label="查询"
                    name="search"
                    >
                     <Input 
                    allowClear
                    value={inputState}
                    placeholder="搜索"
                    onChange={onInputChange}
                    disabled={searchType==='all'?true:false}
                    />
                    </Form.Item>
                </Form>
                <Select
                showSearch
                defaultActiveFirstOption
                defaultValue={searchType}
                optionFilterProp="children"
                onChange={onSelectChange}
                filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={[
                    {
                        value: 'all',
                        label: '全部',
                    },
                    {
                        value: 'username',
                        label: '用户名',
                    },
                    {
                        value: 'phone',
                        label: '电话',
                    },
                    {
                        value: 'email',
                        label: '邮箱',
                    },
                ]}
                />
                <Tabs className='tab'
                tabBarGutter={50}
                defaultActiveKey={currentUserType}
                onChange={handleTagChange}
                items={ userType.map((item) => {
                    return {
                    label: (
                        <span>
                        {item.roleName}
                        </span>
                    ),
                    key: item.id,
                    };
                })}/>
                <div className='employee-orderInfo-content'>
                    <div id='employee-orderInfo-content-list'>
                    <Table 
                    columns={columns} 
                    dataSource={allUserInfo} 
                    pagination={paginationProps}
                    />
                        {/* <Pagination 
                        showTotal={(total) => `共 ${total} 项`}
                        onChange={onPageChange}
                        showSizeChanger
                        onShowSizeChange={onShowSizeChange}
                        defaultPageSize={pageSize}
                        defaultCurrent={pageIndex} 
                        total={userNum} /> */}
                    </div>
                </div>
            </div>
            <Drawer title="Basic Drawer" placement="right" onClose={()=>{setDrawerOpen(false)}} open={drawerOpen}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
            <Outlet/>
        </>
    );
}

export default UserManage;
