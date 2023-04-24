import React,{useState,useEffect} from 'react';
import {Button,Form, Input, Select} from 'antd'
import {LeftOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { pwd_regex, phone_regex } from '../../config';
import { $getRole,$regUser } from '../../api/role';
import encrypt from '../../utils/encrypt'
import "./Register.scss";

const Register = ({sendNotification}) => {
    // 表单实例
    const [form] = Form.useForm();
    // 路由跳转
    const navigate = useNavigate();
    // 角色列表
    const [roleType,setRoleType] = useState([]);
    // 显示角色列表
    const [showRoleType,setShowRoleType] = useState([]);

    useEffect(()=>{
        //判断用户是否已登录
        if(sessionStorage.getItem('token')){
            navigate('/home');
        }
        else{
            loadRoleType();
        }
    },[])
    
    const loadRoleType = async ()=>{
        try{
            let data = await $getRole();
            setRoleType(data);
            let roleType = data.map(item=>({value:item.id,label:item.roleName}));
            setShowRoleType(roleType.filter(item=>item.label!=='未授权'));
        }
        catch(err){
            sendNotification('error',err.message);
        }
    }
    //提交表单   
    const onFinish = async (values) => {
        //整理用户注册信息
        const type = roleType.find(item=>item.id===values.roleTypeId)
        const userInfo = {
            username: values.username,
            password: encrypt(values.password),
            phone: values.phone,
            email:values.email,
            roleType:{
              roleTypeId:type.id,
              roleTypeName:type.roleName
            },
        };
        try 
        {
            const {success,message} = await $regUser(userInfo);
            if(success)
            {
                sendNotification('success',message);
                navigate('/');
            }
            else{
                sendNotification('error',message);
            }

        } 
        catch (err) {
          sendNotification('error',err.message);
        }
    };
    //重置表单
    const onReset = () => {
      form.resetFields();
    };

    return (
        <div className='register-page'>
          <div className='header'>
            <Button className='back-btn'
            type="primary"
            icon={<LeftOutlined />}
            onClick={()=>{navigate('/')}}
            >
            返回
            </Button>
            <div className='welcome-register'>欢迎注册EIS内购网站</div>
            <div className='displayedtext'>00000000</div>
          </div>
          
          <div className='register-form'>
            <Form 
              name="register-form"
              form={form}
              labelCol={{
                  span: 5,
              }}
              wrapperCol={{
                  span: 15,
              }}
              initialValues={{
                  username: '',
                  password:'',
                  prefix: '86'
              }}
              onFinish={onFinish}
              autoComplete="off"
              >
              <Form.Item
                  label="用户名"
                  name="username"
                  hasFeedback
                  rules={[
                  () => ({
                      validator(_, value) {
                        if (value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('用户名为空'));
                      },
                    }),
                  ]}
              >
                  <Input />
              </Form.Item>
                  
              <Form.Item
                  label="密码"
                  name="password"
                  hasFeedback
                  rules={[
                  {
                      required: true,
                      message: "请输入密码",
                  },
                  () => ({
                      validator(_, value) {
                        if (!value || pwd_regex.test(value)) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('密码格式错误（密码为6-12位，只能由数字或字母组成）'));
                      },
                    }),
                  ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
              name="confirmPwd"
              label="确认密码"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: '请再次输入密码!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次密码输入不一致'));
                  },
                }),
              ]}
              >
              <Input.Password />
              </Form.Item>

              <Form.Item
                name="phone"
                label="手机号"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: '请输入手机号!',
                  },
                  () => ({
                    validator(_, value) {
                      if (!value || phone_regex.test(value) ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('请勿输入正确的手机号！'));
                    },
                  }),
                ]}
              >
              <Input
                style={{
                  width: '100%',
                }}
              />
              </Form.Item>

              <Form.Item
                  label="邮箱"
                  name="email"
                  hasFeedback
                  rules={[
                      {
                          type: 'email',
                          message: '请输入有效的邮箱',
                      },
                      {
                          required: true,
                          message: "请输入邮箱",
                      },
                  ]}
              >
                  <Input/>
              </Form.Item>
              <Form.Item
                  label="角色"
                  name="roleTypeId"
                  rules={[
                      {
                          required: true,
                          message: "请选择角色类型",
                      },
                  ]}
              >
                  <Select
                  placeholder="请选择角色类型"
                  defaultActiveFirstOption
                  options={showRoleType}
                  />
              </Form.Item>
                <Form.Item 
                    wrapperCol={{
                    offset: 0,
                    span:24,
                    }}
                >
                  <div className='register-form-button'>
                    <Button  type="primary" htmlType="submit">
                        注册
                    </Button>
                    <Button onClick={onReset} style={{marginLeft:'5em'}} type="primary">
                        重置
                    </Button>
                  </div>
                    
                </Form.Item>
            </Form>
          </div>
        </div>
    );
}

export default Register;
