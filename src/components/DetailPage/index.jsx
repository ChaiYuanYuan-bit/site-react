import React,{ useState,useEffect } from 'react';
import { Divider } from 'antd';
import MarkDown from '../MarkDown';
import './DetailPage.scss'

const DetailPage = ({detailOpen,setDetailOpen,getGoodsInfo}) => {
    //当前商品基本信息
    const [currentGoodsInfo,setCurrentGoodsInfo] = useState({});
    useEffect(() => {
      setCurrentGoodsInfo(getGoodsInfo());
    },[])


    //关闭详情页
    const closeDetailPage = ()=>{
      setDetailOpen(false);
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
               <MarkDown src= 'http://localhost:3000/test.md'/>
               {/* <button>做一些事情</button> */}
               <Divider orientation="left">选择类型</Divider>
               <div className='choose-combo'>
                
               </div>
              </div>
            </div>
          </div>
        </div>
    );
}

export default DetailPage;
