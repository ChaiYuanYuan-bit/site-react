import React,{ useEffect, useState }  from 'react';
import { Outlet,useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Tabs,Table,Tag,Space,Avatar, Divider, List, Skeleton,Select,Input,Tooltip,ConfigProvider,Button,Form,Collapse,Pagination } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { $getOrderNum,$getOrders,$getStateType } from '../../../api/orders';
import {renderEmpty} from '../../../utils/emptyRender'
import './OrderManage.scss'

const { Panel } = Collapse;
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
    },[currentStateType,inputState,pageIndex,pageSize]) 
    // 获取总订单数量
    const loadOrderNum = async ()=>{
        try{
                const {success,message,orderNum} = await $getOrderNum({
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
    // 加载用户所有订单
    const loadAllOrders = async () => {
        try {
            let params = {
                "_limit":pageSize,
                "_page":pageIndex,
                "orderState":currentStateType==='all'?undefined:currentStateType,
            };
            //添加分页查询
            switch(searchType)
            {
                case 'all':break;
                case 'userName':
                    params = {...params,"orderDetail.username_like":inputState};
                    break;
                case 'storeName':
                    params = {...params,"orderDetail.storename_like":inputState};
                    break;
                case 'orderId':
                    params = {...params,"orderId_like":inputState};
                    break;
            }
            let data = await $getOrders(params)
            // console.log(data)
            data = data.map(item=>({
                id:item.id,
                orderInfo:{
                    orderId:item.orderId,
                    orderTime:item.orderTime,
                    finishTime:item.finishTime,
                },
                userInfo:{
                    userId:item.orderDetail.userId,
                    username:item.orderDetail.username,
                    roleTypeName:item.orderDetail.roleTypeName,
                },
                goodsInfo:{
                    storeType:item.orderDetail.goodsTypeName,
                    storeName:item.orderDetail.storeName,
                    comboTypeName:item.orderDetail.comboTypeName,
                    comboPrice:item.orderDetail.comboPrice,
                    dataRange:item.orderDetail.dataRange,
                    count:item.orderDetail.count,
                    days:item.orderDetail.days
                },
                orderMoney:{
                    totalPrice:item.orderDetail.totalPrice,
                    payType:item.orderDetail.payType
                },
                orderState:item.orderStateName,
            }))
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
        // console.log(value)
        setCurrentStateType(value);
        
    }
    // 下拉框状态
    const onSelectChange = (value) => {
        // console.log(value)
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
          title: '订单信息',
          dataIndex: 'orderInfo',
          key: 'orderInfo',
          render:((orderInfo,{orderState})=>(
            <>
                <div>
                    <p>订单编号：{orderInfo.orderId}</p>
                    <p>下单时间：{orderInfo.orderTime}</p>
                    {orderState==='待使用'?<p>付款时间：{orderInfo.finishTime}</p>:
                    orderState==='已取消'?<p>取消时间：{orderInfo.finishTime}</p>:<></>}
                </div>
            </>
          ))
        },
        {
          title: '用户信息',
          dataIndex: 'userInfo',
          key: 'userInfo',
          render:((userInfo)=>(
            <>
                <div>
                    <p>用户Id：{userInfo.userId}</p>
                    <p>用户名称：{userInfo.username}</p>
                    <p>用户类型：{userInfo.roleTypeName}</p>
                </div>
            </>
          ))
        },
        {
            title: '商品信息',
            dataIndex: 'goodsInfo',
            key: 'goodsInfo',
            render:((goodsInfo)=>(
                <>
                    <div>
                        <p>商家名称：{goodsInfo.storeName}</p>
                        <p>{goodsInfo.storeType==='hotels'?`房间类型：${goodsInfo.comboTypeName}`:
                        `套餐类型：${goodsInfo.comboTypeName}`}</p>
                        <p>{goodsInfo.storeType==='hotels'?`房间价格：${goodsInfo.comboPrice} 元`:
                        `套餐价格：${goodsInfo.comboPrice} 元`}</p>
                        <p>{goodsInfo.storeType==='hotels'?`房间数量：${goodsInfo.count} 间`:
                        goodsInfo.storeType==='scenics'?`套餐数量：${goodsInfo.count} 张`:`套餐数量：${goodsInfo.count} 份`}</p>
                        <p>{goodsInfo.storeType==='hotels'?`住房日期：${goodsInfo.dataRange[0]} 至 ${goodsInfo.dataRange[1]}，${goodsInfo.days+1}天${goodsInfo.days}晚`:
                        `使用时间：${goodsInfo.dataRange[0]} 至 ${goodsInfo.dataRange[1]}`}</p>
                    </div>
                </>
            ))
          },
          {
            title: '订单金额',
            dataIndex: 'orderMoney',
            key: 'orderMoney',
            render:((orderMoney)=>(
                <>
                    <p>商品金额：{orderMoney.totalPrice}</p>
                    <p>支付方式：{orderMoney.payType}</p>
                </>
            ))
          },
          {
            title: '订单状态',
            dataIndex: 'orderState',
            key: 'orderState',
            align:'center',
            render:((orderState)=>(
                <Tag color={orderState==='待付款'?'#faad14' :
                orderState==='待使用'?'#b7eb8f':
                orderState==='已取消'?'#d9d9d9':
                orderState==='待评价'?'#e6f4ff':'#52c41a'
            }>{orderState}</Tag>
            ))
          },
      ];
    return (
        <>
            <div className='manager-orderInfo'>
                <div className='header-info'>
                <Collapse defaultActiveKey={['1']} >
                    <Panel header="操作提示" key='1'>
                        <p>*订单状态有：待付款，待使用，已取消，待评价，已完成</p>
                        <p>*待付款订单取消后则为已关闭，待付款订单支付后则为待使用，待使用订单核销后即为待评价，待评价订单评价完成后即为已完成。</p>
                        <p>*查询方式有：（不区分大小写）商家名称检索，用户名称检索，订单号检索。</p>
                    </Panel>
                </Collapse>
                </div>
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
                        <ConfigProvider renderEmpty={renderEmpty}>
                            <Table 
                            columns={columns} 
                            dataSource={allOrders} 
                            pagination={false}
                            />
                        </ConfigProvider>
                    </div>
                        
                </div>
                <div className='content-footer'>
                    <Pagination 
                        showTotal={(total) => `共 ${total} 项`}
                        onChange={onPageChange}
                        showSizeChanger
                        onShowSizeChange={onShowSizeChange}
                        defaultPageSize={pageSize}
                        defaultCurrent={pageIndex} 
                        total={orderNum} />
                </div>
            </div>
            <Outlet/>
        </>
    );
}

export default OrderManage;
