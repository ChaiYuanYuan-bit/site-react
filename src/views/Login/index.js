import React, {useEffect} from "react";
import { Link } from "react-router-dom";
import {useNavigate} from 'react-router-dom';
import {ShoppingCartOutlined,UserOutlined,LockOutlined} from '@ant-design/icons';
import { Button, Form, Input } from "antd";
import encrypt from '../../utils/encrypt'
import { $login, $getOne } from '../../api/user'
import jwtDecode from "jwt-decode";
import { setInfo } from "../../redux/UserInfo";
import { useDispatch } from "react-redux";
import "./Login.scss";

const Login = ({sendNotification}) => {
    //表单
    let [form] = Form.useForm();
    //导航;
    let navigate = useNavigate();
    // redux 分发 hooks
    const dispatch = useDispatch();

    //判断是否已登录
    useEffect(()=>{
        if(sessionStorage.getItem('token')){
            navigate('/home');
        }
    },[]);
    
    //表单成功提交方法.
    const onFinish = async (values) => {
        try{
                //对密码进行加密
                values.password  = encrypt(values.password);
                const {message,success} = await $login(values);
                //判断是否登录成功
                if(success){
                const token = sessionStorage.getItem('token');
                //获取登录id
                const userId = jwtDecode(token).id;
                //根据登录id获取用户信息
                const {userInfo} = await $getOne({id:userId});
                //保存用户到redux
                dispatch(setInfo({info:{...userInfo}}));
                navigate('/home');
            }
            else{
                sendNotification('error',message);
            }
        }
        catch(err)
        {
            sendNotification('error',err.message);
        }
    };

    return (
        <div className="login-page">
                <h1 className="logo-name">
                    <div><span className="first-letter">E</span>nterprise</div>
                    <div><span className="first-letter">&nbsp;I</span>nternal</div>
                    <div style={{whiteSpace:'nowrap'}}><span className="first-letter">S</span>hopping<ShoppingCartOutlined rotate={330} style={{display:"inline-block", fontSize: '240px', color: '#1678ff' }}/></div>
                </h1>
            <div className="login">EIS：一款面向企业员工的内购网站
            <div className="card">
                <h2 className="welcome-login">Hi，欢迎登录</h2>
                <Form
                    name="basic"
                    form={form}
                    labelCol={{
                        span: 5,
                    }}
                    wrapperCol={{
                        span: 20,
                    }}
                    initialValues={{
                        username:'',
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
                    <Input prefix={<UserOutlined />}/>
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
                    <Input.Password prefix={<LockOutlined />}/>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                        offset: 5,
                        span: 19,
                        }}
                    >
                        <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button >
                        <br/>
                        <p className="register-link">没有账号？<Link to="/register">点击注册</Link></p>
                        </Form.Item>
                        
                    </Form.Item>
                </Form>
            </div>
            </div>
        </div>
    );
};

export default Login;
