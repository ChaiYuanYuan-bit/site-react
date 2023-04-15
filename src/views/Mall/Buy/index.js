import React,{useEffect,useState,Component } from 'react';
import Select, { components } from "react-select";
import { useNavigate,useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AiFillMoneyCollect,AiOutlineVerified,AiOutlineCheckCircle,AiOutlineSolution} from 'react-icons/ai';
import { ExceptionOutlined,CheckSquareOutlined,LoadingOutlined, SmileOutlined } from '@ant-design/icons';
import {VscError} from 'react-icons/vsc'
import {IoTicketOutline} from 'react-icons/io5'
import {Button,Steps} from 'antd'
import { $addOrder } from '../../../api/orders';
import MaskLayout from '../../../components/MaskLayout';
import './Buy.scss';

const { Option } = components;

const IconOption = (props) => (
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
    const [addOrderState,setAddOrderState] = useState('wait');
    useEffect(()=>{
        console.log(location);
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
    const handleBack = ()=>{
        //提交订单时无法跳转
        if(addOrderState!=='loading')
        {
            navigate(-1);
        }
    }
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
    return (
        <MaskLayout title='填写订单' onBack={handleBack} onClose={handleClose}>
            <Steps
            size="small"
            current={1}
            items={[
            {
                title: addOrderState==='wait'?
                '提交订单':addOrderState==='loading'?
                '正在提交':addOrderState==='finish'?
                '完成提交':'提交失败',
                status:addOrderState,
                icon:addOrderState==='wait'?
                <AiOutlineSolution/>:addOrderState==='loading'?
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
