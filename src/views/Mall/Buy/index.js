import React,{useEffect,useState,Component } from 'react';
import Select, { components } from "react-select";
import { useNavigate,useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AiFillMoneyCollect,AiOutlineVerified,AiOutlineCheckCircle,AiOutlineSolution} from 'react-icons/ai';
import { LoadingOutlined, SmileOutlined,ExceptionOutlined,FileDoneOutlined } from '@ant-design/icons';
import {VscError} from 'react-icons/vsc'
import {IoTicketOutline} from 'react-icons/io5'
import {Button,Steps} from 'antd'
import { $addOrder } from '../../../api/orders';
import makeAnimated from 'react-select/animated';
import MaskLayout from '../../../components/MaskLayout';
import './Buy.scss';

const { Option } = components;

const animatedComponents = makeAnimated();

const IconOption = (props) => (
<Option {...props}>
    <div style={{display:'flex',alignItems:'center'}}>
        <span style={{margin:'5px'}}>{props.data.icon}</span>
        <span>{props.data.label}</span>
    </div>
</Option>
);

const IconValue = ({children,...props}) => (
    <components.SingleValue {...props}>
        <div className='my-react-multi-select'>
            <span style={{margin:'5px'}}>{props.data.icon}</span>
            <span>{children}</span>
        </div>
         </components.SingleValue>
  );
// 下拉框选项
const options = [
    { value: "balancePay", label: "余额支付", icon: <AiFillMoneyCollect/>,color:'#fff',isFixed:true},
    { value: "ticketPay", label: "使用代金券", icon:<IoTicketOutline/>,color:'#ccc',isFixed:false}
  ];
// 选项过滤
const orderOptions = (values) => {
    return values
        .filter((v) => v.isFixed)
        .concat(values.filter((v) => !v.isFixed));
};

const Buy = ({sendNotification}) => {
    // 获取 当前用户信息
    const {info:userInfo} = useSelector(store=>store.userInfo);
    // 路由
    const navigate = useNavigate();
    // 获得location信息
    const location  = useLocation();
    // 提交状态
    const [addOrderState,setAddOrderState] = useState('wait');
    // select opntions
    const [value,setValue] = useState(orderOptions([options[0]]))
    useEffect(()=>{
        // console.log(location);
    },[])
    //提交订单
    const onFinish = async ()=>{
        //向后台提交订单,并跳转到支付页
        //设置状态为loading
        setAddOrderState('loading');
        //提交商品类型，商品id，套餐id，所选数量，所选日期，
        try {
           const {success,message,orderId} = await $addOrder({
                userId:userInfo.id,
                goodsTypeName:location.state.goodsTypeName,
                goodsId:location.state.currentGoodsInfo.id,
                comboId:location.state.currentCombo.comboTypeId,
                count:location.state.comboNumber,
                days:location.state.days,
                dataRange:location.state.dateStrings
            })
            if(success)
            {
                setAddOrderState('finish');
                sendNotification('success','成功创建订单!');
                navigate('/home/mall/pay',{
                    replace:true,
                    state:{
                        userId:userInfo.id,
                        orderId:orderId
                    }
                });
            }
        } catch (err) {
            setAddOrderState('error');
            sendNotification('error',err.message);
        }
    }
    // 返回事件处理
    const handleBack = ()=>{
        //提交订单时无法跳转
        if(addOrderState!=='loading')
        {
            navigate(-1);
        }
    }
    // 关闭窗口
    const handleClose = ()=>{
        //提交订单时无法跳转
        if(addOrderState!=='loading')
        {
            navigate('/home/mall',
            {
                replace:true
            });
        }
    }
    // 下拉框处理函数
    const handleSelectChange = (newValue,actionMeta)=>{
        // console.log(newValue,actionMeta);
        switch(actionMeta.action)
        {
            case 'select-option':break;
            case 'clear':
                newValue = options.filter((v) => v.isFixed);
                break;
        }
        setValue(orderOptions(newValue));
    }

    return (
        <MaskLayout title='填写订单' onBack={handleBack} onClose={handleClose}>
           <div className='buy-mycard-list'>
            <div className='buy-mycard-title'>
            <Steps
            size="middle"
            current={0}
            items={[
            {
                title: '确认信息',
                icon:<ExceptionOutlined />,
            },
            {
                title: addOrderState==='wait'?
                '提交订单':addOrderState==='loading'?
                '正在提交':addOrderState==='finish'?
                '完成提交':'提交失败',
                status:addOrderState,
                icon:addOrderState==='wait'?
                <FileDoneOutlined />:addOrderState==='loading'?
                <LoadingOutlined/>:addOrderState==='finish'?
                <AiOutlineCheckCircle/>:<VscError/>
            },
            {
                title: '验证密码',
                status:'wait',
                icon:<AiOutlineVerified />
            },
            {
                title: '支付成功',
                status:'wait',
                icon:<SmileOutlined />
            },
            ]}
            />
            </div>
            <div className='buy-mycard-info'>
                <div className='content'>
                    <img src={location.state.currentCombo.comboImgUrl}></img>
                    <div className='text'>
                        <h3>商家：{location.state.currentGoodsInfo.detail.name}</h3>
                        <div className='subtitle'>套餐类型：{location.state.currentCombo.comboTypeName}</div>
                        <p>单价：{location.state.currentCombo.comboPrice} 元</p>
                        <p>{location.state.goodsTypeName==='hotels'?`房间数量：${location.state.comboNumber} 间`:
                        location.state.goodsTypeName==='scenics'?`数量：${location.state.comboNumber} 张`:`数量：${location.state.comboNumber} 份`}</p>
                        <p>{location.state.goodsTypeName==='hotels'?'预定时间：':'使用期限：'}
                        {location.state.dateStrings[0]+' 至 '+location.state.dateStrings[1]} 
                        {location.state.goodsTypeName==='hotels'?`，${location.state.days+1}天${location.state.days}晚`:''}</p>
                    </div>
                </div>
               
            </div>
            <div className='buy-mycard-middle'>
                <div className = 'pay-box'>
                    <span className='pay-logo'>选择支付方式</span>
                    <span  className='pay-select'>
                        <Select
                        closeMenuOnSelect={true}
                        value={value}
                        isMulti
                        isSearchable
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={handleSelectChange}
                        defaultValue={options[0]}
                        options={options}
                        components={{ Option: IconOption ,MultiValue:IconValue,animatedComponents}}
                        />
                    </span>
                </div>
            </div>
            <div className='buy-mycard-footer'>
                <span>金额 ￥{location.state.comboNumber*location.state.currentCombo.comboPrice*location.state.days}</span>
                <Button type="primary" 
                disabled={addOrderState==='loading'?true:false} 
                loading={addOrderState==='loading'?true:false} 
                onClick={onFinish}>提交订单</Button>
            </div>
           </div>
        </MaskLayout>
    );
}

export default Buy;
