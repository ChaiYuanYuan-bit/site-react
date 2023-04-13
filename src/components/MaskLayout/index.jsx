import React from 'react';
import { useEffect } from 'react';
import { AiFillCloseCircle } from "react-icons/ai";
import './MaskLayout.scss'

const MaskLayout = (props) => {
    useEffect(()=>{
        // 关闭底层页面滚动
        document.body.style.overflow = 'hidden';
        return()=>{
          //打开底层页面滚动
          document.body.style.overflow = 'auto';
        }
    },[])
    
    return (
        <div className='mask-layout-page-mask'>
        <div className='mask-layout-page' >
          <div className='mask-layout-page-box'>
            <AiFillCloseCircle className="close-logo" />
            <div className='mask-layout-page-box-content'>
                {
                    props.children
                }
            </div>
          </div>
        </div>
      </div>
    );
}

export default MaskLayout;

