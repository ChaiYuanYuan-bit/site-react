import React,{useState,useEffect} from 'react';
import {Tabs,Layout} from 'antd';
import CardGroup from '../../components/CardGroup';
import NavGroup from '../../components/NavGroup';
import './mall.scss'
import { $getGoodsType,$getItems } from '../../api/mall';


const Mall = ({sendNotification}) => {
    // 商品类型
    const [goodsType,setGoodsType] = useState([]);
    // 记录当前所选tag
    const [currentTypeId,setCurrentTypeId] = useState(1);
    // 已选标签,用于商品分类查询
    const [selectedTags, setSelectedTags] = useState({});
    //创建标签key-value对应表
    const [featuresMap,setFeaturesMap] = useState(new Map())
    // 对应所选类型的所有商品
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
      console.log(key)
      setCurrentTypeId(key);
      };
    
    return (
        <div className='mall-content'>
           <Tabs  className='tab'
            defaultActiveKey="1"
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
            <NavGroup 
            goodsType={goodsType} 
            currentTypeId = {currentTypeId}
            featuresMap={featuresMap} 
            setFeaturesMap={setFeaturesMap} 
            selectedTags={selectedTags}
            setSelectedTags = {setSelectedTags}
            />
            <br></br>
            <CardGroup 
             />
        </div>
    );
}

export default Mall;
