import axiosInstance from '../utils/request'
import qs from 'qs'

//确认订单
export const $addOrder = async (params)=>{
    console.log(params)
    let {data} = await axiosInstance.post('order/addOrder',params);
    return data;
};


//取消订单
export const $cancelOrder = async (params)=>{
    let {data} = await axiosInstance.post('order/cancelOrder',params);
    return data;
};

