import axiosInstance from '../utils/request';
import qs from 'qs';

//获取总订单数
export const $getOrderNum = async (params)=>{
    let {data} = await axiosInstance.get('user/orderNum',{params});
    return data;
};


//获取所有订单
export const $getOrders = async (params)=>{
    let {data} = await axiosInstance.get('orderPool',{
        params:params,
        paramsSerializer:(params)=>{
            return qs.stringify(params,{arrayFormat:'repeat'});
        }
    });
    return data;
};

//获取订单状态类型
export const $getStateType= async ()=>{
    let {data} = await axiosInstance.get('orderStateType');
    return data;
};


