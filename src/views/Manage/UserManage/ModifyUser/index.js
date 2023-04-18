import React,{useState,useEffect}from 'react';
import { Drawer,Form,Select,Input,InputNumber,Button,Popconfirm } from 'antd';
import { $getRole } from '../../../../api/roleApi';
import { $getOne } from '../../../../api/userApi';
import './ModifyUser.scss'
const ModifyUser = ({drawerOpen,setDrawerOpen,modifyUserId,modifyUserInfo}) => {
    // 角色列表
    const [roleTypeList,setRoleTypeList] = useState([]);
    // // 用户信息
    // const [userInfo,setUserInfo] = useState({});
    // 表单实例
    const[form] = Form.useForm();
    useEffect(()=>{
        loadRoleTypeList();
        console.log(modifyUserId)
        console.log(modifyUserInfo)
        form.resetFields();
    },[modifyUserId])
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
        setDrawerOpen(false);
    }
    const onFinish = async () => {
        console.log(form.getFieldValue('roleType'))
    }

    return (
        <>
            <Drawer title="修改用户信息" placement="right" onClose={handleClose} open={drawerOpen}>
                <Form
                name = 'modifyUserInfo'
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
                // onFinish={onFinish}
                autoComplete="off"
                >
                <Form.Item 
                label="用户名："
                name="username"
                initialValue={modifyUserInfo.username}
                >
                <Input title='不可修改' disabled={true}/>
                </Form.Item>
                <Form.Item 
                label="电话："
                name="phone"
                initialValue={modifyUserInfo.phone}
                >
                <Input title='不可修改' disabled={true} value={11111}/>
                </Form.Item>
                <Form.Item 
                label="邮箱："
                name="email"
                initialValue={modifyUserInfo.email}
                >
                <Input title='不可修改' disabled={true}/>
                </Form.Item>
                <Form.Item 
                label="角色："
                name="roleType"
                initialValue={modifyUserInfo.roleTypeId}
                >
                <Select 
                options={roleTypeList}>
                </Select>
                </Form.Item>
                <Form.Item 
                label="余额："
                name="balance"
                initialValue={modifyUserInfo.balance}
                required
                >
                <InputNumber
                prefix="￥"
                min={0}
                max={100000}
                step={1000} />
                </Form.Item>
                </Form>
                <Popconfirm
                    title="提示"
                    description="确认修改用户信息么？"
                    onConfirm={onFinish}
                    okText="确定"
                    cancelText="取消"
                >
                    <Button
                    type="primary"
                    // htmlType="submit"
                    // loading={true}
                    >
                    修改
                    </Button>
                </Popconfirm>

                <Button  onClick={handleClose}>取消</Button>
            </Drawer>
        </>
    );
}

export default ModifyUser;
