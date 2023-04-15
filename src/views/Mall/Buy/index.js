import React,{useEffect,useState,Component } from 'react';
import Select, { components } from "react-select";
import { useNavigate,useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AiFillMoneyCollect} from 'react-icons/ai';
import {IoTicketOutline} from 'react-icons/io5'
import {Button} from 'antd'
import { $addOrder } from '../../../api/orders';
import MaskLayout from '../../../components/MaskLayout';
import './Buy.scss';

const { Option } = components;

const IconOption = props => (
<Option {...props}>
    <div style={{display:'flex',alignItems:'center'}}>
        <span style={{margin:'5px',backgroundColor:props.color}}>{props.data.icon}</span>
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

const options = [
    { value: "wechatPay", label: "余额支付", icon: <AiFillMoneyCollect/>,color:'#1AAD19'},
    { value: "aliPay", label: "使用代金券", icon:<IoTicketOutline/>,color:'#1678ff'}
  ];

const Buy = ({sendNotification}) => {
    // 获取 当前用户信息
    const {info:userInfo} = useSelector(store=>store.userInfo);
    // 路由
    const navigate = useNavigate();
    // 获得location信息
    const location  = useLocation();
    // 提交状态
    const [addOrderState,setAddOrderState] = useState('notLoading');
    useEffect(()=>{
        
    },[])
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
                count:location.state.comboNumber
            })
            if(success)
            {
                setAddOrderState('notLoading');
                sendNotification('success',message);
                navigate('/home/mall/pay',{
                    replace:true,
                    state:{
                        userId:userInfo.id,
                        orderId:orderId
                    }
                });
            }
        } catch (err) {
            setAddOrderState('notLoading');
            sendNotification('error',err.message);
            navigate('/home/mall',{
                replace:true
            });
        }
    }
    const handleBack = ()=>{
        navigate(-1);
    }
    const handleClose = ()=>{
        navigate('/home/mall',
        {
            replace:true
        });
    }
    return (
        <MaskLayout onBack={handleBack} onClose={handleClose}>
           <div className='buy-mycard-list'>
            <div className='buy-mycard-info'>
                <h3>{location.state.currentGoodsInfo.detail.name}</h3>
            </div>
            <div className='buy-mycard-info'>
                <img src={location.state.currentCombo.comboImgUrl}></img>
                <div className='content'>
                    <h3>套餐类型：{location.state.currentCombo.comboTypeName}</h3>
                    <p>单价：{location.state.currentCombo.comboPrice}</p>
                    <p>数量：{location.state.comboNumber}</p>
                </div>
            </div>
            <div className='buy-mycard-little'>
                <div className = 'pay-box'>
                    <span className='pay-logo'>选择支付方式</span>
                    <span  className='pay-select'>
                        <Select
                        closeMenuOnSelect={true}
                        isMulti = {true}
                        isSearchable={false}
                        defaultValue={options[0]}
                        options={options}
                        components={{ Option: IconOption ,MultiValue:IconValue}}
                        />
                    </span>
                </div>
            </div>
            <div className='buy-mycard-little'>
                <span>金额 ￥{location.state.comboNumber*location.state.currentCombo.comboPrice}</span>
                <Button type="primary" disabled={addOrderState==='loading'?true:false} loading={addOrderState==='loading'?true:false} onClick={onFinish}>提交订单</Button>
            </div>
           </div>
        </MaskLayout>
    );
}

export default Buy;
