import React from 'react';
import { useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { AiFillCloseCircle,AiFillLeftCircle} from "react-icons/ai";
import './MaskLayout.scss'

const MaskLayout = (props) => {
  const navgiate = useNavigate();
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
            <div className='header'>
              <span style={{display:props.hiddenBack?'none':'block'}}>
                <AiFillLeftCircle className="back-logo" onClick={props.onBack}/>
              </span>
              <h4>{props.title}</h4>
              <AiFillCloseCircle className="close-logo" onClick={props.onClose}/>
            </div>
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

