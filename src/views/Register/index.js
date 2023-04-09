import React,{useState,useEffect} from 'react';
import {Button,Form, Input, Select,} from 'antd'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setMsg } from '../../redux/Notification';
import { pwd_regex, phone_regex } from '../../config';
import { $getRole,$regUser } from '../../api/roleApi';

const Register = () => {
    // 表单实例
    const [form] = Form.useForm();
    // 引入redux dispatch
    const distpatch = useDispatch();
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
            setShowRoleType(roleType);
        }
        catch(err){
            distpatch(setMsg({type:'error',description:err.message}));
        }
    }
    //提交表单   
    const onFinish = async (values) => {
        const userInfo = {
            username: values.username,
            password: values.password,
            phone: values.phone,
            email:values.email,
            roleType:roleType.find(item=>item.id===values.roleTypeId),
        };
        try 
        {
            const {success,message} = await $regUser(userInfo);
            if(success)
            {
                distpatch(setMsg({msg:{type:'success',description:message}}));
                navigate('/');
            }
            else{
                distpatch(setMsg({msg:{type:'error',description:message}}));
            }

        } 
        catch (err) {
            distpatch(setMsg({msg:{type:'error',description:err.message}}));
        }
    };
    //重置表单
    const onReset = () => {
      form.resetFields();
    };

    return (
        <Form
        name="register"
        form={form}
        labelCol={{
            span: 4,
        }}
        wrapperCol={{
            span: 18,
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
            offset: 4,
            span: 16,
            }}
        >
            <Button type="primary" htmlType="submit">
                注册
            </Button>
            <Button 
            onClick={onReset} 
            style={{marginLeft:'10px'}} 
            type="primary" 
            >
                重置
            </Button>
        </Form.Item>
        </Form>
    );
}

export default Register;
