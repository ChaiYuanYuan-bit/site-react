import axiosInstance from '../utils/request'
import qs from 'qs'

//获取商品类型
export const $getGoodsType = async ()=>{
    let {data} = await axiosInstance.get('/goodsType');
    return data;
};

//获取所有商品
export const $getItems = async ({goodsType,queryList})=>{
    let final_data;
    if(queryList)
    {
        let {data} = await axiosInstance.get(`/${goodsType}`,{
            params:queryList,
            paramsSerializer:(params)=>{
                return qs.stringify(params,{arrayFormat:'repeat'});
            }
        });
        final_data = data;
    }
    else{
        let {data} = await axiosInstance.get(`/${goodsType}`);
        final_data = data;
    }
    return final_data;
};


