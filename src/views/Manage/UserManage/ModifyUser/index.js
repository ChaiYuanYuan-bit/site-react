import React,{useState,useEffect}from 'react';
import { Drawer,Form,Select,Input,InputNumber,Button,Popconfirm } from 'antd';
import { $getRole } from '../../../../api/role';
import { $modifyUser } from '../../../../api/user';
import './ModifyUser.scss'

const ModifyUser = ({drawerOpen,setDrawerOpen,modifyUserId,modifyUserInfo,sendNotification,loadUserNum,loadAllUsers}) => {
    // 角色列表
    const [roleTypeList,setRoleTypeList] = useState([]);
    // 下拉框状态
    const [selectValue,setSelectValue] = useState(0);
    // 数字输入框状态
    const [numberValue,setNumberValue] = useState(0);
    // pop提醒框开关
    const [popConfirmOpen,setPopConfirmOpen] =useState(false);
    // 表单实例
    const[form] = Form.useForm();
    // 提交表单状态
    const [loading,setLoading] =  useState(false);

    useEffect(()=>{
        loadRoleTypeList();
        form.resetFields();
        setSelectValue(modifyUserInfo.roleTypeId);
        setNumberValue(modifyUserInfo.balance);
    },[modifyUserId,])
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
        form.resetFields();
    }
    // 提交表单
    const onFinish = async () => {
        if(loading)
        {
            return;
        }
        setLoading(true);
        setPopConfirmOpen(false);
        try {
            const {success,message} = await $modifyUser({
                userId:modifyUserInfo.id,
                roleTypeId:form.getFieldValue('roleType'),
                balance:form.getFieldValue('balance')
            })
            if(success)
            {
                sendNotification('success',message);
                setLoading(false);
                setDrawerOpen(false);
                setTimeout(()=>{
                    loadUserNum();
                    loadAllUsers();
                },200)
            }
           else{
            setLoading(false);
            sendNotification('error',message);
            setDrawerOpen(false);
           }
        } catch (error) {
            setLoading(false);
            setDrawerOpen(false);
            console.log(error.message)
        }
    }
    // 下拉框状态变化
    const handleSelectChange =(value) => {
        setSelectValue(value)
    }
    // 数字输入框状态变化
    const handleNumberChange =(value) => {
        setNumberValue(value)
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
                size='middle'
                style={{
                    maxWidth: 600,
                  }}
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
                label="权限："
                name="roleType"
                initialValue={modifyUserInfo.roleTypeId}
                >
                <Select 
                options={roleTypeList}
                onChange={handleSelectChange}
                >
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
                onChange={handleNumberChange}
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
                    <span className='confirm-btn'><Button 
                    onClick={handleClose}>取消</Button>

                    <Button
                    type="primary"
                    disabled={selectValue!==modifyUserInfo.roleTypeId||numberValue!==modifyUserInfo.balance?false:true} 
                    loading={loading}
                    onClick={()=>{setPopConfirmOpen(true)}}
                    >
                    {selectValue!==modifyUserInfo.roleTypeId||numberValue!==modifyUserInfo.balance?'修改':'暂无修改项'}
                    </Button></span>
                </Popconfirm>
            </Drawer>
        </>
    );
}

export default ModifyUser;
