import React,{useState} from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import { LoadingOutlined, SmileOutlined, ExceptionOutlined } from '@ant-design/icons';
import { HiOutlineEmojiSad} from 'react-icons/hi'
import { VscError } from 'react-icons/vsc'
import { AiFillSafetyCertificate,AiOutlineVerified,AiOutlineInfoCircle,AiOutlineCheckCircle } from 'react-icons/ai'
import { Button,Steps,Popconfirm,Form,Input } from 'antd';
import { $verifyPWD,$payOrder } from '../../api/pay';
import { $cancelOrder } from '../../api/orders';
import MaskLayout from '../../components/MaskLayout';
import encrypt from '../../utils/encrypt';
import './Pay.scss'

const Pay = ({sendNotification}) => {
    // 获取表单实例
    const [form] = Form.useForm();
    //路由
    const navigate = useNavigate();
    // 路由hook
     const location = useLocation();
    // popConfirm的开关状态
    const [popOpen,setPopOpen] = useState(false);
    // 验证密码状态
    const [verifedState,setVerifiedState] = useState('wait');
    // 支付状态
    const [payState,setPayState] = useState('wait');
    // 取消订单状态
    const [cancelState,setCancelState] = useState('wait');

    //关闭支付页面
    const handleClose = ()=>{
        //当前有操作正在进行时无法点击退出
        if(payState!=='loading'&&verifedState!=='loading'&&cancelState!=='loading')
        {
            navigate(sessionStorage.getItem('path'),
            {
                replace:true
            });
            if(sessionStorage.getItem('path')&&!sessionStorage.getItem('path').indexOf('mall')===-1)
            {
                // console.log(!sessionStorage.getItem('path').indexOf('mall'))
                window.location.reload()
            }
            sendNotification('info','订单详情请查看 “我的-订单信息”');
        }
    }
    //取消订单
    const handleCancle = ()=>{
        //设置取消按钮状态
        setCancelState('loading');
        return new Promise((resolve) => {
            $cancelOrder({orderId:location.state.orderId})
            .then(response=>{
                if(response.success)
                {
                    resolve(null);
                    setCancelState('finish');
                    //设置取消按钮状态
                    setTimeout(()=>{
                        setPopOpen(false);
                        setCancelState('finish');
                    },200)
                    sendNotification('success',response.message);
                     //延时返回
                    setTimeout(()=>{
                        navigate(sessionStorage.getItem('path'),
                        {
                            replace:true
                        });
                        window.location.reload()
                    },500)
                }
                else{
                    setCancelState('error');
                    sendNotification('error',response.message);
                    setTimeout(()=>{
                        setPopOpen(false);
                    },200)
                }
            })
            .catch(error=>{
                setCancelState('error');
                resolve(null);
                // console.log(error.message);
                sendNotification('error',error.message)
                setTimeout(()=>{
                    setPopOpen(false);
                },100)
            })
          });
    }
    // 取消订单按钮点击事件
    const handlePopBtnClick = ()=>{
        //重置状态
        setCancelState('wait');
        //开关气泡提醒
        setPopOpen(!popOpen);
    }
    //验证支付密码并发起支付请求
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
                        navigate(sessionStorage.getItem('path'),
                        {
                            replace:true
                        });
                        window.location.reload();
                    },500);
                }
                else{
                    setPayState('error');
                    sendNotification('error',message);
                }
            }
            else{
                setVerifiedState('error');
                // console.log(message)
            }
        } catch (err) {
            setVerifiedState('wait');
            setPayState('wait');
            sendNotification('error',err.message);
        }
    }

    return (
        <MaskLayout 
        hiddenBack={true} 
        title='支付订单' 
        onClose = {handleClose}>
            <div className='pay-content'>
                <div className='pay-steps'>
                    <Steps
                    size="middle"
                    current={1}
                    items={[
                    {
                        title: '确认信息',
                        icon:<ExceptionOutlined />,
                    },
                    {
                        title: '提交订单',
                        status:'finish'
                    },
                    {
                        title: verifedState==='wait'?'验证密码':verifedState==='loading'?'验证中':verifedState==='finish'?'验证成功':'密码错误',
                        status:verifedState,
                        icon:verifedState==='wait'?<AiOutlineVerified />:verifedState==='loading'?<LoadingOutlined />:verifedState==='finish'?<AiFillSafetyCertificate/>:<VscError />
                    },
                    {
                        title: payState==='wait'?'支付成功':payState==='loading'?'支付中':payState==='finish'?'支付成功':'支付失败',
                        status:payState,
                        icon:payState==='wait'?<SmileOutlined />:payState==='loading'?<LoadingOutlined />:payState==='finish'?<SmileOutlined/>:<HiOutlineEmojiSad />
                    },
                    ]}
                    />           
                </div>
                <div className='pay-verify'>
                        <h2 className='h2'>安全收银台<p className='p'>保障您的账号安全</p></h2>
                    <Form
                    name='pay'
                    form = {form}
                    labelCol={{
                        span: 6,
                    }}
                    wrapperCol={{
                        span: 18,
                    }}
                    style={{
                        maxWidth: 350,
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
                        <Popconfirm
                        open={popOpen}
                        placement="topLeft"
                        title='提示'
                        icon = {cancelState==='wait'?<AiOutlineInfoCircle color='#ffc107'/>:cancelState==='loading'?<LoadingOutlined />:cancelState==='finish'?<AiOutlineCheckCircle color='#1AAD19'/>:<VscError color='#ff4d4f'/>}
                        description={cancelState==='wait'?'确定要取消订单吗？':cancelState==='loading'?'正在取消，请稍等':cancelState==='finish'?'取消成功':'取消失败'
                        }
                        onCancel={handlePopBtnClick}
                        onConfirm={handleCancle}
                        okText="确定"
                        cancelText="我再想想"
                        >
                        <Button 
                        loading={cancelState==='loading'?true:false}
                        onClick={handlePopBtnClick}
                        disabled={verifedState==='loading'||payState === 'loading'||cancelState==='loading'||cancelState==='finish'?true:false}>
                            取消订单
                        </Button>
                        </Popconfirm>
                        <Button 
                        disabled={verifedState==='loading'||payState === 'loading'||cancelState==='loading'||cancelState==='finish'?true:false}
                        onClick={handleClose}
                        >
                            稍后支付
                        </Button>
                        <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={payState==='loading'||verifedState==='loading'?true:false}
                        disabled={
                        payState==='loading'||payState==='finish'||verifedState==='loading'||cancelState === 'loading'||cancelState==='finish'?true:false}>
                            支付
                        </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </MaskLayout>
    );
}
export default Pay;
