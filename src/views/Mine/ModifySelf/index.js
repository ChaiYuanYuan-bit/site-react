import React,{useState,useEffect}from 'react';
import { useSelector } from 'react-redux';
import { Drawer,Form,Select,Input,InputNumber,Button,Popconfirm } from 'antd';
import { $getRole } from '../../../api/role';
import { $modifySelf } from '../../../api/user';
import { phone_regex } from '../../../config';
import './ModifySelf.scss'
const ModifySelf = ({drawerOpen,setDrawerOpen,sendNotification}) => {
    // 角色列表
    const [roleTypeList,setRoleTypeList] = useState([]);
    // 用户名输入状态
    const [inputUserName,setInputUserName] = useState('');
    // phone输入状态
    const [inputPhone,setInputPhone] = useState('');
    // email输入状态
    const [inputEmail,setInputEmail] = useState('');
    // pop提醒框开关
    const [popConfirmOpen,setPopConfirmOpen] =useState(false);
    // 表单实例
    const[form] = Form.useForm();
    // 提交表单状态
    const [loading,setLoading] =  useState(false);
    // 获取个人用户信息
    const {info:userInfo} = useSelector(store=>store.userInfo);
    // 输入检查
    const [isValid,setIsValid] = useState(false);

    useEffect(()=>{
        loadRoleTypeList();
        setInputUserName(userInfo.username);
        setInputPhone(userInfo.phone);
        setInputEmail(userInfo.email);
    },[])
     // 加载角色类型
    const loadRoleTypeList = async ()=>{
        try {
            let roleType = await $getRole();
            roleType = roleType.map(item=>({
                value:item.id,
                label:item.roleName
            }))
            setRoleTypeList(roleType);
            // console.log(roleType)
        } catch (error) {
            console.log(error.message)
        }
    }
    //关闭抽屉
    const handleClose = ()=>{
        form.resetFields();
        setDrawerOpen(false);
    }
    // 提交表单
    const onFinish = async () => {
        if(!form.getFieldValue('phone').trim())
        {
            sendNotification('info','电话号不能为空');
            setDrawerOpen(false);
            setPopConfirmOpen(true);
            return;
        }
        if(!form.getFieldValue('email').trim())
        {
            sendNotification('info','有效不能为空');
            setDrawerOpen(false);
            setPopConfirmOpen(true);
            return;
        }
        if(loading)
        {
            return;
        }
        setLoading(true);
        setPopConfirmOpen(false);
        try {
            const {success,message} = await $modifySelf({
                userId:userInfo.id,
                phone:form.getFieldValue('phone'),
                email:form.getFieldValue('email')
            })
            if(success)
            {
                sendNotification('success',message);
                setLoading(false);
                setDrawerOpen(false);
                setTimeout(()=>{
                    window.location.reload();
                },200)
            }
           else{
            setLoading(false);
            sendNotification('error',message);
           }
        } catch (error) {
            setLoading(false);
            console.log(error.message)
        }
    }
    
    return (
        <>
            <Drawer title="修改用户信息" placement="right" onClose={handleClose} open={drawerOpen}>
                <Form
                name = 'userInfo'
                form = {form}
                labelCol={{
                    span: 4,
                    }}
                wrapperCol={{
                span: 16,
                }}
                initialValues={{
                    remember: false,
                    }}
                size='middle'
                style={{
                    maxWidth: 600,
                  }}
                autoComplete="off"
                >
                <Form.Item 
                label="用户名："
                name="username"
                initialValue={userInfo.username}
                >
                <Input disabled onChange={(event)=>{setInputUserName(event.target.value.trim())}}/>
                </Form.Item>
                <Form.Item 
                label="电话："
                name="phone"
                initialValue={userInfo.phone}
                rules={[
                    {
                      required: true,
                      message: '请输入手机号!',
                    },
                    () => ({
                      validator(_, value) {
                        if (!value || phone_regex.test(value) ) {
                            setIsValid(false);
                            return Promise.resolve();
                        }
                        else
                        {
                            setIsValid(true);
                            return Promise.reject(new Error('请输入正确的手机号！'));
                        }
                        
                      },
                    }),
                  ]}
                >
                <Input allowClear onChange={(event)=>{setInputPhone(event.target.value.trim())}}/>
                </Form.Item>
                <Form.Item 
                label="邮箱："
                name="email"
                initialValue={userInfo.email}
                rules={[
                    {
                        type: 'email',
                        message: '请输入有效的邮箱',
                    }
                ]}
                >
                <Input allowClear onChange={(event)=>{setInputEmail(event.target.value.trim())}}/>
                </Form.Item>
                <Form.Item 
                label="权限："
                name="roleType"
                initialValue={userInfo.roleType.roleTypeId}
                >
                <Select 
                disabled={true}
                title='不可修改'
                options={roleTypeList}
                >
                </Select>
                </Form.Item>
                <Form.Item 
                label="余额："
                name="balance"
                initialValue={userInfo.balance}
                required
                >
                <InputNumber
                disabled={true}
                prefix="￥"
                min={0}
                max={100000}
                step={1000}
                style={{width: 220}} />
                </Form.Item>
                </Form>
                <Popconfirm
                title="提示"
                description="确认修改用户信息么？"
                open={popConfirmOpen}
                onConfirm={onFinish}
                onCancel={()=>{setPopConfirmOpen(false);}}
                okText="确定"
                cancelText="取消"
                >
                <span className='confirm-btn'>  
                <Button 
                onClick={handleClose}>取消</Button>
                    <Button
                    type="primary"
                    disabled={!isValid?(inputUserName!==userInfo.username||inputPhone!==userInfo.phone||inputEmail!==userInfo.email)?false:true:true} 
                    // htmlType="submit"
                    loading={loading}
                    onClick={()=>{setPopConfirmOpen(true)}}
                    >
                    {!isValid?inputUserName!==userInfo.username||inputPhone!==userInfo.phone||inputEmail!==userInfo.email?'修改':'暂无修改项':'请输入正确内容'}
                    </Button></span>  
                </Popconfirm>
            </Drawer>
        </>
    );
}

export default ModifySelf;
