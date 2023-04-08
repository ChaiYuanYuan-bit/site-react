import axiosInstance from '../utils/request'

//登录
export const $login = async (params)=>{
    let {data} = await axiosInstance.post('/user/login',params)
    if(data.success){
        sessionStorage.setItem('token',data.token)
    }
    return data;
}
//获取用户信息
export const $getOne = async (params)=>{
    let {data} = await axiosInstance.get('/user/getone',{params})
    return data;
}