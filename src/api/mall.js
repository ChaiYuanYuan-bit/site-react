import axiosInstance from '../utils/request'

//获取商品类型
export const $getGoodsType = async ()=>{
    let {data} = await axiosInstance.get('/goodsType');
    return data;
};

