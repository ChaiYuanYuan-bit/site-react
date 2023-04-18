import React,{ useEffect, useState }  from 'react';
import { Outlet,useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Tabs,Table,Tag,Space,Avatar, Divider, List, Skeleton,Select,Input,Tooltip,ConfigProvider,Button,Form } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { $getOrderNum,$getOrders,$getStateType } from '../../../api/orders';
import {renderEmpty} from '../../../utils/emptyRender'
import './OrderManage.scss'

const OrderManage = () => {
    //获取redux中的用户信息
    const {info:userInfo} = useSelector(store=>store.userInfo)
    // 表单实例
    const [form] = Form.useForm();
    //infinite list状态
    const [loading, setLoading] = useState(false);
    // 用户总订单数量
    const [orderNum,setOrderNum] = useState(0);
    // 用户的订单
    const [allOrders,setAllOrders] = useState([]);
    // 路由
    const navigate = useNavigate();
    // 获取订单状态类型
    const [stateTypeList,setStateTypeList] = useState([]);
    // 当前所选订单状态
    const [currentStateType,setCurrentStateType] = useState('all');
    // 下拉框状态
    const [searchType,setSearchType] = useState('all');
    // 输入框状态
    const [inputState,setInputState] = useState('');
    // 当前页码
    const [pageIndex,setPageIndex] = useState(1);
    // 默认显示条数
    const [pageSize,setpageSize] = useState(15);
    // 抽屉状态
    const [drawerOpen, setDrawerOpen] = useState(false);
    // input
    // userId
    useEffect(()=>{
        loadOrderNum();
        loadAllOrders();
        loadStateTypeList();
    },[currentStateType,inputState]) 
    // 获取总订单数量
    const loadOrderNum = async ()=>{
        try{
                const {success,message,orderNum} = await $getOrderNum({
                userId:userInfo.id,
                orderState:currentStateType==='all'?undefined:currentStateType,
                searchType,
                keyWord:inputState
            });
            if(success)
            {
                setOrderNum(orderNum);
            }
            else{
                console.log(message)
            }
        }catch(error){
            console.log(error)
        }
    } 
    // 加载用户订单
    const loadAllOrders = async () => {
        try {
            let params = {
                "_limit":allOrders.length+10,
                "orderState":currentStateType==='all'?undefined:currentStateType,
            };

            switch(searchType)
            {
                case 'all':break;
                case 'userName':
                    params = {...params,"orderDetail.userName_like":inputState};
                    break;
                case 'storeName':
                    params = {...params,"orderDetail.storeName_like":inputState};
                    break;
                case 'orderId':
                    params = {...params,"orderId_like":inputState};
                    break;
            }
            const data = await $getOrders(params)
            console.log(data)
            
            setAllOrders(data)
        } catch (error) {
            console.log(error.message)
        }
    };
    // 加载订单状态列表
    const loadStateTypeList = async()=>{
        try {
            let stateList = await $getStateType();
            setStateTypeList([{id:0,state:'all',description:'全部订单'},...stateList]);
        } catch (error) {
            
        }
    }

    const handleTagChange = (value)=>{
        console.log(value)
        setCurrentStateType(value);
        
    }
    // 下拉框状态
    const onSelectChange = (value) => {
        console.log(value)
        setSearchType(value);
        form.resetFields();
    }
    // 输入框状态
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
        total:orderNum
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
          
        // {
        //   title: '角色',
        //   key: 'tags',
        //   dataIndex: 'tags',
        //   align:'center',
        //   render: (_, { tags }) => (
        //     <>
        //       {tags.map((tag) => {
        //         let color = tag.length > 5 ? 'geekblue' : 'green';
        //         if (tag==='管理员') color = 'geekblue';
        //         else if(tag === '普通员工') color='green';
        //         else if (tag === '未授权') color = 'volcano';
        //         return (
        //           <Tag color={color} key={tag}>
        //             {tag.toUpperCase()}
        //           </Tag>
        //         );
        //       })}
        //     </>
        //   ),
        // },
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
                    value: 'storeName',
                    label: '商家名称',
                },
                {
                    value: 'userName',
                    label: '用户名称',
                },
                {
                    value: 'orderId',
                    label: '订单号',
                },
                ]}
                />
                <Tabs className='tab'
                tabBarGutter={50}
                defaultActiveKey={currentStateType}
                onChange={handleTagChange}
                items={ stateTypeList.map((item) => {
                    return {
                    label: (
                        <span>
                        {item.description}
                        </span>
                    ),
                    key: item.state,
                    };
                })}/>
                <div className='employee-orderInfo-content'>
                    <div id='employee-orderInfo-content-list'>
                    <Table 
                    columns={columns} 
                    dataSource={allOrders} 
                    pagination={paginationProps}
                    />
                    </div>
                        {/* <Pagination 
                        showTotal={(total) => `共 ${total} 项`}
                        onChange={onPageChange}
                        showSizeChanger
                        onShowSizeChange={onShowSizeChange}
                        defaultPageSize={pageSize}
                        defaultCurrent={pageIndex} 
                        total={userNum} /> */}
                 
                        {/* <InfiniteScroll
                        dataLength={allOrders.length}
                        next={loadAllOrders}
                        hasMore={allOrders.length < orderNum}
                        loader={
                        <Skeleton
                            avatar
                            paragraph={{
                            rows: 1,
                            }}
                            active
                        />
                        }
                        endMessage={<Divider plain>没有更多订单啦 🤐</Divider>}
                        scrollableTarget="content"
                        >
                            <ConfigProvider renderEmpty={renderEmpty}>
                            <List
                            dataSource={allOrders}
                            renderItem={(item) => (
                                <List.Item 
                                key={item.orderId}
                                >
                                <List.Item.Meta
                                    avatar={<Avatar src={item.orderDetail.comboImgUrl} />}
                                    title={<a href="#">{item.orderDetail.storeName}</a>}
                                    description={
                                    <div>
                                        <p>用户名称：{item.orderDetail.userName}</p>
                                        <p>商家地址：{item.orderDetail.location}</p>
                                        <p>套餐类型：{item.orderDetail.comboTypeName}</p> 
                                        <p>订单价格：{item.orderDetail.totalPrice}元</p>
                                        <p>下单时间：{item.orderTime}</p>
                                        <p>订单编号：{item.orderId}</p>
                                        <br/>
                                    </div>}
                                />
                                </List.Item>
                                )}
                            />
                            </ConfigProvider>
                        </InfiniteScroll> */}
                    {/* </div> */}
                </div>
            </div>
            <Outlet/>
        </>
    );
}

export default OrderManage;
