import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import MaskLayout from '../../../components/MaskLayout';
import { 
    LoadingOutlined, 
    SmileOutlined, 
    SolutionOutlined, 
    UserOutlined 
} from '@ant-design/icons';
import { Button,Steps,Popconfirm,Form,Input } from 'antd';

const Pay = ({sendNotification}) => {
    const [payClose,setPayClose] = useState(false)
    const navigate = useNavigate();
    // const handleBack = ()=>{
    // }

    const handleClose = ()=>{
        if(!payClose){
            sendNotification('info','已取消支付，订单详情请查看 “我的-订单信息”，3s...内将返回首页');
            setPayClose(true);
            setTimeout((value) =>{
                console.log(value)
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
    const onFinish = (value)=>{
        console.log(value)
    }
    return (
        <MaskLayout onClose = {handleClose}>

            <div ><Steps
            items={[
            {
                title: 'Login',
                status: 'finish',
                icon: <UserOutlined />,
            },
            {
                title: 'Verification',
                status: 'finish',
                icon: <SolutionOutlined />,
            },
            {
                title: 'Pay',
                status: 'process',
                icon: <LoadingOutlined />,
            },
            {
                title: 'Done',
                status: 'wait',
                icon: <SmileOutlined />,
            },
            ]}
            />
            <Form
            name='pay'
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
                <Button type="primary" htmlType="submit">支付</Button>
                <Popconfirm
                placement="topLeft"
                title='提示'
                description='确定要取消订单吗？'
                onConfirm={handleCancle}
                okText="确定"
                cancelText="我再想想"
                >
                <Button>取消订单</Button>
                </Popconfirm>
            </Form></div>
            <div >取消支付</div>
        </MaskLayout>
    );
}

export default Pay;
