import axiosInstance from '../utils/request'

//获取角色列表
export const $getRole = async ()=>{
    let {data} = await axiosInstance.get('/roleType');
    return data;
};

//发送注册请求
export const $regUser = async (params)=>{
    let {data} = await axiosInstance.post('/user/register',params);
    return data;
};
