import React,{ useState,useEffect } from 'react';
import {CloseCircleOutlined} from '@ant-design/icons'
import MarkDown from '../MarkDown';
import './DetailPage.scss'

const DetailPage = ({detailOpen,setDetailOpen,getGoodsInfo}) => {
    //当前商品基本信息
    const [currentGoodsInfo,setCurrentGoodsInfo] = useState({});
    useEffect(() => {
      setCurrentGoodsInfo(getGoodsInfo());
    },[getGoodsInfo()])


    //关闭详情页
    const closeDetailPage = ()=>{
      setDetailOpen(false);
      //打开底层页面滚动
      document.body.style.overflow = 'auto';
    }
    return (
        <div 
        className='detail-page-mask'
        style={{display:detailOpen?'block':'none'}}
        >
          <div className='detail-page' >
            <div className='detail-page-box'>
            <div className="close-logo" onClick={closeDetailPage}></div>
              <div className='detail-page-box-content'>
               <MarkDown src= {currentGoodsInfo?.detail?.mdUrl}/>
              </div>
            </div>
          </div>
        </div>
    );
}

export default DetailPage;
