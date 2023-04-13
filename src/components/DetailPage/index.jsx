import React,{ useState,useEffect } from 'react';
import { Divider,Segmented,InputNumber,Button,Space } from 'antd';
import MarkDown from '../MarkDown';
import './DetailPage.scss'

const DetailPage = ({detailOpen,setDetailOpen,getGoodsInfo}) => {
    //当前商品基本信息
    const [currentGoodsInfo,setCurrentGoodsInfo] = useState({});
    // 商品套餐类型
    const [comboType,setComboType] = useState([]);
    // 记录当前所选套餐
    const [currentCombo,setCurrentCombo] =useState({});
    //state
    useEffect(() => {
      console.log(getGoodsInfo())
      loadDetailPageData()
    },[getGoodsInfo()])

    // 
    const loadDetailPageData = ()=>{
      // 当前商品所有信息
      const data = getGoodsInfo();
      // 保存所有信息
      setCurrentGoodsInfo(data);
      // // 获取套餐类型
      // const type = data.detail.comboType.map(item => item.comboTypeName)||[]
      // // 保存套餐类型
      // setComboType(type);
      // // 初始化当前所选套餐
      // console.log(data.detail.comboType[0])
      // setCurrentCombo(data.detail.comboType[0]||{});
     
    }
    //关闭详情页
    const closeDetailPage = ()=>{
      setDetailOpen(false);
      //打开底层页面滚动
      document.body.style.overflow = 'auto';
    }
    const handleComboChange = (comboTypeName)=>{
      console.log(comboTypeName)
      const combo = currentGoodsInfo.detail.comboType.find(item=>item.comboTypeName === comboTypeName)||{};
      console.log(combo)
      setCurrentCombo(combo)
    }
    const onNumberChange = (value) => {
      console.log('changed', value);
    };
    return (
        <div 
        className='detail-page-mask'
        style={{display:detailOpen?'block':'none'}}
        >
          <div className='detail-page' >
            <div className='detail-page-box'>
            <div className="close-logo" onClick={closeDetailPage}></div>
              <div className='detail-page-box-content'>
                <MarkDown src= 'http://localhost:3000/test.md'/>
                {/* <button>做一些事情</button> */}
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
                    <Button type="primary">确认下单</Button>
                  </div>
                  </Space>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
}

export default DetailPage;
