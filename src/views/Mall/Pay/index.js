import React,{useState} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate,useLocation } from 'react-router-dom';
import {  LoadingOutlined, SmileOutlined,ExceptionOutlined, CheckSquareOutlined, } from '@ant-design/icons';
import { HiOutlineEmojiSad} from 'react-icons/hi'
import {VscError} from 'react-icons/vsc'
import {AiFillSafetyCertificate,AiOutlineVerified,} from 'react-icons/ai'
import { Button,Steps,Popconfirm,Form,Input } from 'antd';
import { $verifyPWD,$payOrder } from '../../../api/pay';
import MaskLayout from '../../../components/MaskLayout';
import encrypt from '../../../utils/encrypt';

const Pay = ({sendNotification,clearNotification}) => {
    // 获取 当前用户信息
    const {info:userInfo} = useSelector(store=>store.userInfo);
    // 验证密码状态
    const [verifedState,setVerifiedState] = useState('wait');
    // 支付状态
    const [payState,setPayState] = useState('wait');
    // 获取表单实例
    const [form] = Form.useForm();
    const [payClose,setPayClose] = useState(false)
    const navigate = useNavigate();
    const location = useLocation();
    // const handleBack = ()=>{
    // }

    const handleClose = ()=>{
        if(!payClose){
            sendNotification('info','已取消支付，订单详情请查看 “我的-订单信息”，3s...内将返回首页');
            setPayClose(true);
            setTimeout((value) =>{
                navigate('/home/mall',
                {
                    replace:true
                });
            } , 3000);
        }
    }
    const handleCancle = ()=>{
        return new Promise((resolve) => {
            setTimeout(() =>{
                resolve(null);
                sendNotification('success','订单已取消');
            } , 1000);
          });
    }
    const onFinish = async ({password})=>{
        setVerifiedState('loading');
        try {
            //验证支付密码
            const {success,message} = await $verifyPWD(
                {
                    userId:location.state.userId,
                    password:encrypt(password)
                });
            if(success)
            {
                setVerifiedState('finish');
                setPayState('loading');
                //支付订单
                const {success,message} = await $payOrder(
                    {
                        orderId: location.state.orderId
                    });
                if(success)
                {
                    sendNotification('success',message);
                    setPayState('finish');
                    setTimeout(()=>{
                        navigate('/home/mall',
                        {
                            replace:true
                        });
                    },500);
                }
                else{
                    setPayState('error');
                }
            }
            else{
                setVerifiedState('error');
            }
        } catch (err) {
            setVerifiedState('wait');
            setPayState('wait');
            sendNotification('error',err.message);
        }
    }
    return (
        <MaskLayout onClose = {handleClose} >
            <div className='pay-content'>
                <Steps
                size="small"
                current={2}
                items={[
                {
                    title: '确认信息',
                    icon: <ExceptionOutlined />,
                },
                {
                    title: '提交订单',
                    icon: <CheckSquareOutlined />,
                    status:'finish'
                },
                {
                    title: verifedState==='wait'?
                    '验证密码':verifedState==='loading'?
                    '验证中':verifedState==='finish'?
                    '验证成功':'密码错误',
                    status:verifedState,
                    icon:verifedState==='wait'?
                    <AiOutlineVerified />:verifedState==='loading'?
                    <LoadingOutlined />:verifedState==='finish'?
                    <AiFillSafetyCertificate/>:<VscError />
                },
                {
                    title: payState==='wait'?
                    '支付成功':payState==='loading'?
                    '支付中':payState==='finish'?
                    '支付成功':'支付失败',
                    status:payState,
                    icon:payState==='wait'?
                    <SmileOutlined />:payState==='loading'?
                    <LoadingOutlined />:payState==='finish'?
                    <SmileOutlined/>:<HiOutlineEmojiSad />
                },
                ]}
                />
                <Form
                name='pay'
                form = {form}
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    maxWidth: 600,
                }}
                autoComplete="off"
                onFinish={onFinish}
                >
                    <Form.Item
                    label="支付密码"
                    name="password"
                    rules={[
                        {
                        required: true,
                        message: '请输入您的支付密码!',
                        },
                    ]}
                    >
                    <Input.Password/>
                    </Form.Item>
                    <div className='pay-button'>
                    <Button 
                    type="primary" 
                    htmlType="submit" 
                    disabled={payState==='loading'||
                    payState==='finish'||
                    verifedState==='loading'||
                    verifedState==='finish'?true:false}>
                        支付
                    </Button>
                    <Popconfirm
                    placement="topLeft"
                    title='提示'
                    description='确定要取消订单吗？'
                    onConfirm={handleCancle}
                    okText="确定"
                    cancelText="我再想想"
                    >
                    <Button 
                    disabled={verifedState==='loading'||verifedState==='finish'?true:false}>
                        取消订单
                    </Button>
                    <Button disabled={verifedState==='loading'||verifedState==='finish'?true:false}>
                        稍后支付
                    </Button>
                    </Popconfirm>
                    </div>
                </Form>
            </div>
        </MaskLayout>
    );
}

export default Pay;
