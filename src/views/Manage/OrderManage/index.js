import React,{ useEffect, useState }  from 'react';
import { Outlet,useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Tabs,Avatar, Divider, List, Skeleton,Select,Input,Tooltip,ConfigProvider,Button,Form } from 'antd';
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
    const [orders,setOrders] = useState([]);
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
    // input
    // userId
    useEffect(()=>{
        loadOrderNum();
        loadMoreData();
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
    const loadMoreData = async () => {
        if (loading) {
        return;
        }
        setLoading(true);
        try {
            let params = {
                "_limit":orders.length+10,
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
            setOrders(data)
            setLoading(false);
        } catch (error) {
            setLoading(false);
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
    
    const onInputChange = (event) =>{
        setInputState(event.target.value.trim())
    }
    const handleToPay = (orderId)=>{
        navigate(`/home/mine/pay`,{
            replace:true,
            state:{userId:userInfo.id,
                orderId
            }
        });
    }
    return (
        <>
            <div className='manager-orderInfo'>
                <div className='select-tag'>
                    <span className='myselect'> <Select
                    style={{width:'100%'}}
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
                /></span>
               <span className='myform'>  <Form
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
                </Form></span>
              
                </div>
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
                <div className='content'>
                    <div id='manager-orderInfo-content-list'>
                        <InfiniteScroll
                        dataLength={orders.length}
                        next={loadMoreData}
                        hasMore={orders.length < orderNum}
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
                        scrollableTarget="manager-orderInfo-content-list"
                        >
                            <ConfigProvider renderEmpty={renderEmpty}>
                            <List
                            dataSource={orders}
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
                        </InfiniteScroll>
                    </div>
                </div>
            </div>
            <Outlet/>
        </>
    );
}

export default OrderManage;
