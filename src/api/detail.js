import axiosInstance from '../utils/request'
import qs from 'qs'

//获取商品信息
export const $getOne = async (goodsTypeName,goodsId)=>{
    let {data} = await axiosInstance.get(`/${goodsTypeName}`,{
        params:{id:goodsId}
    });
    return data;
};