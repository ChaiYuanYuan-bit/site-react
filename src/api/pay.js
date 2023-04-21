import axiosInstance from '../utils/request'

//验证密码
export const $verifyPWD = async (params)=>{
    let {data} = await axiosInstance.post('/pay/verifyPWD',params);
    return data;
};


//支付订单
export const $payOrder = async (params)=>{
    let {data} = await axiosInstance.post('/pay/payOrder',params);
    return data;
};

