import axiosInstance from '../utils/request'
import qs from 'qs'

//登录
export const $login = async (params)=>{
    let {data} = await axiosInstance.post('/user/login',params)
    if(data.success){
        sessionStorage.setItem('token',data.token)
    }
    return data;
}

//获取单个用户信息
export const $getOne = async (params)=>{
    let {data} = await axiosInstance.get('/user/getone',{params})
    return data;
}

//获取用户数量
export const $getUserNum = async(params)=>{
    let {data} = await axiosInstance.get('/user/userNum',{params});
    return data;
}
//获取所有用户信息
export const $getAllUsers = async (params)=>{
    let {data} = await axiosInstance.get('/users',{
        params:params,
        paramsSerializer:(params)=>{
            return qs.stringify(params,{arrayFormat:'repeat'});
        }
    });
    return data;
}
// 修改用户个人信息
export const $modifyUser = async (params)=>{
    let {data} = await axiosInstance.post('/user/modifyUser',params);
    return data;
}

// 修改自己个人信息
export const $modifySelf = async (params)=>{
    let {data} = await axiosInstance.post('/user/modifySelf',params);
    return data;
}