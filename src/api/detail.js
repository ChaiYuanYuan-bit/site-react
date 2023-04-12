import axiosInstance from '../utils/request'
import qs from 'qs'

//获取商品类型
export const $getMD = async (fileName)=>{
    let {data} = await axiosInstance.get(`/{fileName}`);
    return data;
};