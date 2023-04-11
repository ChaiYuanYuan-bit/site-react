import React,{useState,useEffect} from 'react';
import {Tabs} from 'antd';
import CardGroup from '../../components/CardGroup';
import NavGroup from '../../components/NavGroup';
import { $getGoodsType } from '../../api/mall';



const Mall = ({sendNotification}) => {
    // 商品类型
    const [goodsType,setGoodsType] = useState([]);
    // 记录当前所选tag
    const [currentTypeId,setCurrentTypeId] = useState(1);
    useEffect(() => {
      loadGoodsType();
    },[])
    //加载商品类型
    const loadGoodsType = async()=>{
      try{
        const type = await $getGoodsType();
        setGoodsType(type);
      }catch(err){
        sendNotification('error',err.message);
      }
    }
    //Tag切换时，记录当所选前商品类型Id
    const handleTagChange = (key) => {
      setCurrentTypeId(key);
      };
    
    return (
        <div style={{
          maxWidth:'100%',
          padding:'10px',
          display:'flex',
          alignItems:'center',
          flexDirection:'column'
          }}>
           <Tabs
            defaultActiveKey="1"
            style={{paddingLeft:'20px',paddingBottom:0,margin:0,alignSelf:'start'}}
            onChange={handleTagChange}
            items={ goodsType.map((item) => {
              return {
                label: (
                  <span>
                    {item.description}
                  </span>
                ),
                key: item.id,
              };
            })}/>
            <NavGroup goodsType={goodsType} currentTypeId = {currentTypeId}/>
            <br></br>
            <CardGroup/>
        </div>
    );
}

export default Mall;
