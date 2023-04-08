import React, {useEffect} from "react";
import {useNavigate} from 'react-router-dom'
import { Button, Form, Input } from "antd";
import encrypt from '../../utils/encrypt'
import {$login} from '../../api/userApi'
import "./Login.scss";

const Login = ({setNoteMsg,loadUserInfo}) => {
    //表单
    let [form] = Form.useForm();
    //导航;
    let navigate = useNavigate()

    //判断是否已登录
    useEffect(()=>{
        if(sessionStorage.getItem('token')){
            navigate('/layout');
        }
    },[]);
    
    //表单成功提交方法
    const onFinish = async (values) => {
        //对密码进行加密
        values.password  = encrypt(values.password);
        const {message,success} = await $login(values);
        //判断是否登录成功
        if(success){
            navigate('/layout')
            setNoteMsg({type:'success',description:message})
            loadUserInfo();
        }
        else{
            setNoteMsg({type:'error',description:message})
        }
    };

    return (
        <div className="login">
            <div className="content">
                <h2>酒店后台管理系统</h2>
                <Form
                name="basic"
                form={form}
                labelCol={{
                    span: 4,
                }}
                wrapperCol={{
                    span: 18,
                }}
                initialValues={{
                    username: '',
                    password:''
                }}
                onFinish={onFinish}
                autoComplete="off"
                >
                <Form.Item
                    label="账号"
                    name="username"
                    rules={[
                    {
                        required: true,
                        message: "请输入账号",
                    },
                    ]}
                >
                    <Input />
                </Form.Item>
                    
                <Form.Item
                    label="密码"
                    name="password"
                    rules={[
                    {
                        required: true,
                        message: "请输入密码",
                    },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                    offset: 4,
                    span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        登录
                    </Button>
                    <Button onClick={()=>{
                        form.resetFields()
                    }} style={{marginLeft:'10px'}} type="primary" htmlType="submit">
                        取消
                    </Button>
                </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;
