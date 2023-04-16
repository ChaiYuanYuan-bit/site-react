import React,{ useEffect, useState }  from 'react';
import {FcBusinessman,FcManager} from 'react-icons/fc';
import { Outlet,useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Tabs,Avatar, Divider, List, Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { $getOrderNum,$getOrders,$getStateType } from '../../api/orderInfo';
import './OrderInfo.scss'

let testTab = [
    {id:1,description:'全部订单'},
    {id:2,description:'未出行'},
    {id:3,description:'待付款'},
    {id:4,description:'待评价'},
]

const actionType = {
    payed:[<h3>已完成</h3>],
    unpay:[<Link key="list-loadmore-edit">去付款</Link>, <Link to='/home/mall' key="list-loadmore-more">取消订单</Link>],
    canceled:[<h3>已取消</h3>]
}

const OrderInfo = () => {
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
    const [currentStateType,setCurrentStateType] = useState('all')
    // userId
    useEffect(()=>{
        loadOrderNum();
        loadMoreData();
        loadStateTypeList();
    },[currentStateType]) 
    // 获取用户的总订单数量
    const loadOrderNum = async ()=>{
        try{
            const {success,message,orderNum} = await $getOrderNum({
                userId:userInfo.id,
                orderState:currentStateType==='all'?undefined:currentStateType
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
                "orderDetail.userId":userInfo.id,
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
            stateList = stateList.filter(item=>item.id!==3&&item.id!==5)
            setStateTypeList([{id:0,state:'all',description:'全部订单'},...stateList]);
        } catch (error) {
            
        }
    }
    const handleTagChange = (value)=>{
        console.log(value)
        setCurrentStateType(value);
        
    }
    const handleToPay = (orderId)=>{
        navigate(`/home/pay`,{
            replace:true,
            state:{userId:userInfo.id,
                orderId
            }
        });
    }
    return (
        <>
            <div className='employee-orderInfo'>
                <div className='employee-orderInfo-header'>
                    <div className='topInfo'>
                        <div className='avatar' title='普通员工'>
                            <FcBusinessman className='svg'/>
                        </div>
                        <div><span>{userInfo.username}</span></div>
                    </div>
                    <div className='bottomInfo'>
                        <div><span>钱包余额 <br></br>{userInfo.balance}</span></div>
                        <div><span>优惠券</span></div>
                    </div>
                </div>
                <Tabs className='tab'
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
                        scrollableTarget="content"
                        >
                        <List
                        dataSource={orders}
                        renderItem={(item) => (
                            <List.Item 
                            key={item.orderDetail.storeName}
                            actions={item.orderState==='payed'?
                            [<h3>已完成</h3>]:item.orderState==='unpay'?
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
                        </InfiniteScroll>
                    </div>
                </div>
            </div>
            <Outlet/>
        </>
    );
}

export default OrderInfo;
