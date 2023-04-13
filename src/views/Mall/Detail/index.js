import React,{ useState,useEffect } from 'react';
import { Divider,Segmented,InputNumber,Button,Space } from 'antd';
import { useSearchParams,useNavigate } from 'react-router-dom';
import {LoadingOutlined,AiFillCloseCircle} from '@ant-design/icons';
import { $getOne} from '../../../api/detail';
import MarkDown from '../../../components/MarkDown';
import MaskLayout from '../../../components/MaskLayout';
import './DetailPage.scss'

const Detail = () => {
    // 详情页状态
    const [detailLoadState,setDetailLoadState] = useState(0);
    //当前商品基本信息
    const [currentGoodsInfo,setCurrentGoodsInfo] = useState({});
    // 商品套餐类型
    const [comboType,setComboType] = useState([]);
    // 记录当前所选套餐
    const [currentCombo,setCurrentCombo] =useState({});
    // 获取路由参数
    const [search,setSearch] = useSearchParams();
    //错误展示信息
    const errMsg = '无法加载商品详情，请稍后再试！( 即将返回 )';
    //路由跳转
    const navigate = useNavigate();

     useEffect(() => {
      loadDetailPageData();
    },[])
    
    // 加载数据
    const loadDetailPageData = async ()=>{
      try {
        const goodsTypeName = search.get('goodsTypeName');
        const goodsId = search.get('goodsId');
        let data = await $getOne(goodsTypeName,goodsId);
        data = data[0];
        setDetailLoadState(1);
         // 保存所有信息
        setCurrentGoodsInfo(data);
        // 获取套餐类型
        const type = data.detail?.comboType?.map(item => item.comboTypeName)||[]
        // 保存套餐类型
        setComboType(type);
        // 初始化当前所选套餐
        setCurrentCombo(data.detail.comboType?data.detail.comboType[0]:{});
      } catch (error) {
        //有错误就返回上一页
        setDetailLoadState(-1);
        setTimeout(()=>{
          navigate(-1);
        },2500);
      }
    }
    //关闭详情页
    const closeDetailPage = ()=>{
      navigate(-1);

    }
    const handleComboChange = (comboTypeName)=>{
      const combo = currentGoodsInfo.detail.comboType.find(item=>item.comboTypeName === comboTypeName)||{};
      setCurrentCombo(combo)
    }
    const onNumberChange = (value) => {
      console.log('changed', value);
    };
    const onFinish = ()=>{
      navigate('/home/mall/buy');
    }
    return (
        <MaskLayout onClose = {closeDetailPage}>
          {
            detailLoadState===0?<LoadingOutlined/>:
            detailLoadState===1?(
              <>
                <MarkDown src= {currentGoodsInfo?.detail?.mdUrl}/>
                <Divider orientation="left" orientationMargin="0" >请选择购买类型</Divider>
                <div className='combo'>
                <Space
                  direction="vertical"
                  size={[0, 64]}
                  style={{
                    display: 'flex',
                  }}
                >
                <Segmented block options={comboType} onChange={(comboTypeName)=>{handleComboChange(comboTypeName)}}/>
                  <div className='combo-content'>
                    <div><img className='combo-img' src={currentCombo.comboImgUrl}/> </div>
                    <div>价格：{currentCombo.comboPrice}</div>
                    <div>库存：{currentCombo.comboCount}</div>
                  </div>
                  <div className='select-combo-order'>
                    <div className='comfirm-number'>购买数量：<InputNumber  min={1} max={100000} defaultValue={1} onChange={onNumberChange} /></div>
                    <Button type="primary" onClick={onFinish}>确认下单</Button>
                  </div>
                  </Space>
                </div>
              </>
            ):<h1>{errMsg}</h1>
          }
        </MaskLayout>
    );
}

export default Detail;
