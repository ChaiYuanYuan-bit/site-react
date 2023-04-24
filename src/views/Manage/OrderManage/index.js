import React,{ useEffect, useState }  from 'react';
import { Outlet} from 'react-router-dom';
import { Tabs,Table,Tag,Select,Input,ConfigProvider,Form,Collapse,Pagination,DatePicker,Button } from 'antd';
import { $getOrderNum,$getOrders,$getStateType } from '../../../api/orders';
import {renderEmpty} from '../../../utils/emptyRender'
import './OrderManage.scss'

const { RangePicker } = DatePicker;

const { Panel } = Collapse;
const OrderManage = () => {
    // 表单实例
    const [form] = Form.useForm();
    // 用户总订单数量
    const [orderNum,setOrderNum] = useState(0);
    // 用户的订单
    const [allOrders,setAllOrders] = useState([]);
    // 获取订单状态类型
    const [stateTypeList,setStateTypeList] = useState([]);
    // 当前所选订单状态
    const [currentStateType,setCurrentStateType] = useState('all');
    // 当前页码
    const [pageIndex,setPageIndex] = useState(1);
    // 默认显示条数
    const [pageSize,setpageSize] = useState(15);
    // 抽屉状态
    const [drawerOpen, setDrawerOpen] = useState(false);
    // 查询输入状态
    const [searchInput,setSearchInput] = useState({
        roleTypeName:'all',
        goodsType:'all'
    });

    useEffect(()=>{
        loadOrderNum();
        loadAllOrders();
        loadStateTypeList();
    },[currentStateType,pageSize,pageIndex,searchInput]) 
    // 获取总订单数量
    const loadOrderNum = async ()=>{
        try{
                const {success,message,orderNum} = await $getOrderNum({
                orderState:currentStateType==='all'?undefined:currentStateType,
                searchInput
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
            //添加分页查询
            let params = {
                "_limit":pageSize,
                "_page":pageIndex,
                "orderState":currentStateType==='all'?undefined:currentStateType,
                "orderId_like":searchInput.orderId?searchInput.orderId:undefined,
                "orderDetail.storeName_like":searchInput.storeName?searchInput.storeName:undefined,
                "orderDetail.username_like":searchInput.userName?searchInput.userName:undefined,
                "orderDetail.roleTypeName":searchInput.roleTypeName&&searchInput.roleTypeName!=='all'?searchInput.roleTypeName:undefined,
                "orderDetail.goodsTypeName":searchInput.goodsType&&searchInput.goodsType!=='all'?searchInput.goodsType:undefined,
            };
            if(searchInput.orderTime!==undefined&&searchInput.orderTime[0]&&searchInput.orderTime[1])
            {
                params = {...params,"orderTime_gte":searchInput.orderTime[0],"orderTime_lte":searchInput.orderTime[1]};
            }
            const data = await $getOrders(params)
            const new_data = data.map(item=>({
                key:item.id,
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
            setAllOrders(new_data)
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
        setCurrentStateType(value);
    }
    //页脚
    const onPageChange = (current) => {
        setPageIndex(current);
    }
    // 每页显示数目变化
    const onShowSizeChange = (current, pageSize) => {
        setpageSize(pageSize);
    };
    // 重置搜索项
    const handleResetInput = ()=>{
        setSearchInput({roleTypeName:'all',goodsType:'all'});
        form.resetFields();
    }
    const columns = [
        {
          title: 'ID',
          dataIndex: 'id',
          render: (text) => <a>{text}</a>,
        },
        {
          title: '订单信息',
          dataIndex: 'orderInfo',
          key: 'orderInfo',
          render:((orderInfo,{orderState})=>(
            <>
                <div style={{maxWidth:'350px'}}>
                    <p>订单编号：{orderInfo.orderId}</p>
                    <p>下单时间：{orderInfo.orderTime}</p>
                    {orderState==='待使用'?<p>付款时间：{orderInfo.finishTime}</p>:orderState==='已取消'?<p>取消时间：{orderInfo.finishTime}</p>:<></>}
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
                    <p>用户ID：{userInfo.userId}</p>
                    <p>用户名称：{userInfo.username}</p>
                    <p>用户权限：{userInfo.roleTypeName}</p>
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
                    <div  style={{maxWidth:'350px'}}>
                        <p>商家名称：{goodsInfo.storeName}</p>
                        <p>{goodsInfo.storeType==='hotels'?`房间类型：${goodsInfo.comboTypeName}`:`套餐类型：${goodsInfo.comboTypeName}`}</p>
                        <p>{goodsInfo.storeType==='hotels'?`房间价格：${goodsInfo.comboPrice} 元`:`套餐价格：${goodsInfo.comboPrice} 元`}</p>
                        <p>{goodsInfo.storeType==='hotels'?`房间数量：${goodsInfo.count} 间`:goodsInfo.storeType==='scenics'?`套餐数量：${goodsInfo.count} 张`:`套餐数量：${goodsInfo.count} 份`}</p>
                        <p>{goodsInfo.storeType==='hotels'?`住房日期：${goodsInfo.dataRange[0]} 至 ${goodsInfo.dataRange[1]}，${goodsInfo.days+1}天${goodsInfo.days}晚`:`使用时间：${goodsInfo.dataRange[0]} 至 ${goodsInfo.dataRange[1]}`}</p>
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
                <Tag color={orderState==='待付款'?'#faad14' :orderState==='待使用'?'#b7eb8f':orderState==='已取消'?'#d9d9d9':orderState==='待评价'?'#FF8C00':'#52c41a'
            }>{orderState}</Tag>
            ))
          }
      ];
    return (
        <>
            <div className='manager-orderInfo'>
                <div className='header-info'>
                <Collapse defaultActiveKey={['1']} >
                    <Panel header="操作提示" key='1'>
                        <p>*订单状态有：待付款，待使用，已取消，待评价，已完成</p>
                        <p>*待付款订单取消后则为已关闭，待付款订单支付后则为待使用，待使用订单核销后即为待评价，待评价订单评价完成后即为已完成。</p>
                        <p>*查询条件有：角色类型筛选、商品类型筛选、（不区分大小写）用户名称检索、下单时间检索、商家名称检索、订单号检索。</p>
                    </Panel>
                </Collapse>
                </div>
                <div className='select-tag'>
                <Form
                name="search"
                form={form}
                >
                    <div >
                    <Form.Item label="角色类型" name="roleTypeName"
                    >
                     <Select 
                     defaultValue={searchInput.roleTypeName}
                    options={[{value:'all',label:'全部'},
                        {value:'管理员',label:'管理员'},
                        {value:'普通员工',label:'普通员工'},
                        {value:'未授权',label:'未授权'},]}
                    onChange={value=>{setPageIndex(1);setSearchInput({...searchInput,roleTypeName:value})}}
                    />
                    </Form.Item>
                    <Form.Item
                    label="商品类型"
                    name="goodsType"
                    >
                    <Select 
                    defaultValue={searchInput.goodsType}
                    options={[{value:'all',label:'全部'},
                        {value:'hotels',label:'酒店'},
                        {value:'scenics',label:'景点'},
                        {value:'food',label:'美食'},]}
                    onChange={value=>{setPageIndex(1);setSearchInput({...searchInput,goodsType:value})}}
                    />
                    </Form.Item>
                    <Form.Item
                    label="用户名称"
                    name="userName">
                     <Input allowClear placeholder="请输入用户名称" onChange={event=>{setPageIndex(1);setSearchInput({...searchInput,userName:event.target.value.trim()})}}/>
                    </Form.Item>
                    </div>
                    <div className='form-right'>
                    <Form.Item
                    label="下单时间"
                    name="orderTime">
                      <RangePicker placeholder={['开始时间','结束时间']} showTime={{format: 'HH:mm'}} format="YYYY-MM-DD HH:mm" onChange={(_,dataString)=>{setPageIndex(1);setSearchInput({...searchInput,orderTime:dataString})}}/>
                    </Form.Item>
                    <Form.Item
                    label="订单搜索"
                    name="orderSearch">
                     <Input allowClear placeholder="请输入订单编号" onChange={event=>{setPageIndex(1);setSearchInput({...searchInput,orderId:event.target.value.trim()})}}/>
                    </Form.Item>
                    <Form.Item
                    label="商家名称"
                    name="storeName">
                     <Input allowClear placeholder="请输入商家名称" onChange={event=>{setPageIndex(1);setSearchInput({...searchInput,storeName:event.target.value.trim()})}}/>
                    </Form.Item>
                    </div>
                    <Button onClick={handleResetInput} className='reset-btn' type='primary'>重置搜索</Button>
                </Form></div>
                <Tabs className='tab'
                tabBarGutter={50}
                defaultActiveKey={currentStateType}
                onChange={handleTagChange}
                items={ stateTypeList.map((item) => {
                    return {
                    label: (<span>{item.description}</span>),
                    key: item.state,
                    };
                })}/>
                <div className='content'>
                    <div id='manager-orderInfo-content-list'>
                        <ConfigProvider renderEmpty={renderEmpty}>
                            <Table scroll={{x: "100%"}} columns={columns} dataSource={allOrders} pagination={false}/>
                        </ConfigProvider>
                    </div>
                </div>
                <div className='content-footer'>
                    <Pagination showTotal={(total) => `共 ${total} 项`}onChange={onPageChange} showSizeChanger onShowSizeChange={onShowSizeChange} defaultPageSize={pageSize} current={pageIndex} total={orderNum} />
                </div>
            </div>
            <Outlet/>
        </>
    );
}

export default OrderManage;
