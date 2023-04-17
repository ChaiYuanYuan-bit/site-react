import React,{ useEffect, useState,useRef }  from 'react';
import { Outlet,useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { SearchOutlined } from '@ant-design/icons';
import { Tabs,Avatar, Divider, List, Skeleton,Select,Input,Tooltip,ConfigProvider,Button } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { $getOrderNum,$getOrders,$getStateType } from '../../../api/orders';
import {renderEmpty} from '../../../utils/emptyRender'
import './OrderManage.scss'

const OrderManage = () => {
    const {info:userInfo} = useSelector(store=>store.userInfo)
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
    const [selectState,setSelectState] = useState('all');
    // 输入框ref
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
                selectState,
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
            const data = await $getOrders({
                "_limit":orders.length+10,
                "orderState":currentStateType==='all'?undefined:currentStateType
            })
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
        setSelectState(value);
    }
    
    const onInputChange = (value) =>{
        setInputState(value)
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
                <div className='select'>
                <Select 
                showSearch
                defaultActiveFirstOption
                defaultValue={selectState}
                optionFilterProp="children"
                onChange={onSelectChange}
                // onSearch={onSearch}
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
                <Input 
                allowClear
                placeholder="搜索"
                onChange={onInputChange}
                disabled={selectState==='all'?true:false}
                 />
                <Tooltip title="search">
                    <Button 
                    shape="circle"
                    disabled={selectState==='all'?true:false}
                    icon={<SearchOutlined />} />
                </Tooltip>
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
                                key={item.orderDetail.storeName}
                                actions={item.orderState==='payed'?
                                [<h3>待使用</h3>]:item.orderState==='unpay'?
                                [<a onClick={()=>{handleToPay(item.orderId)}}>去付款</a>]:item.orderState==='canceled'?
                                [<h3>已取消</h3>]:<></>}
                                >
                                <List.Item.Meta
                                    avatar={<Avatar src={item.orderDetail.comboImgUrl} />}
                                    title={<a href="#">{item.orderDetail.storeName}</a>}
                                    description={
                                    <div>
                                        {/* <img src="" alt=""> */}
                                        <p>商家地址：{item.orderDetail.location}</p>
                                        <p>套餐类型：{item.orderDetail.comboTypeName}</p> 
                                        {/* <p>{item.orderDetail.comboIntro}</p> */}
                                        {/* <p>支付方式：余额支付</p> */}
                                        <p>下单时间：{item.orderTime}</p>
                                        <p>订单编号：{item.orderId}</p>
                                        <br/>
                                    </div>}
                                />
                                <div>￥{item.orderDetail.totalPrice}</div>
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
