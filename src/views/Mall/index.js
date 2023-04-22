import React,{useState,useEffect} from 'react';
import {Tabs} from 'antd';
import CardGroup from '../../components/CardGroup';
import NavGroup from '../../components/NavGroup';
import { Outlet, useNavigate } from 'react-router-dom';
import { $getGoodsType,$getItems } from '../../api/mall';
import './Mall.scss'


const Mall = ({sendNotification}) => {
    // 商品类型
    const [goodsType,setGoodsType] = useState([]);
    // 路由
    const navigate = useNavigate();
    // 记录当前所选商品类型Id
    const [currentTypeId,setCurrentTypeId] = useState(1);
    // 已选标签,用于商品分类查询
    const [selectedTags, setSelectedTags] = useState({});
    // 创建标签key-value对应表
    const [featuresMap,setFeaturesMap] = useState(new Map())
    // 对应所选类型的所有商品
    const [allGoods, setAllGoods] = useState([]);
    // 记录当前所选商品id
    const [currentGoodsId,setCurrentGoodsId] = useState(0);

    useEffect(() => {
      loadGoodsType();
      // selectedTags.length
    },[selectedTags.length,currentTypeId])
    
    // 加载商品类型
    const loadGoodsType = async()=>{
      try{
        const type = await $getGoodsType();
        if(type)
        {
          const goodsId = type.findIndex(item=>item.id===currentTypeId);
          if(goodsId>=0)
          {
            const goodsType = type[goodsId].goodsName;
            const readyData = dataReducer(goodsType,featuresMap,selectedTags)
            const items =  await $getItems(readyData);
            setAllGoods(items);
          }
        }
        loadFeatureMap(type);
        setGoodsType(type);
      }catch(err){
        sendNotification('error',err.message);
      }
    }
    // 加载featureMap
    const loadFeatureMap = (type)=>{
      const currentGoods = type.find(item=>item.id===currentTypeId);
      if(currentGoods)
      {
          const features = currentGoods.features;
          let _featuresMap = new Map();
          features.map(goods=>{
            //并且添加feature对应表，方便查询
            goods.details.map(feature=>_featuresMap.set(feature.id,feature.name));
          })
          setFeaturesMap(_featuresMap);
      }
    }
    // 生成过滤查询的数据
    const dataReducer = (goodsType,featuresMap,selectedTags)=>{
      let queryList = {};
      if(selectedTags.length>0)
      {
        for(var obj in selectedTags)
        {
          if(selectedTags[obj].length>0)
          {
            queryList = {...queryList,[obj]:[]};
            selectedTags[obj].map(value=>{
              var key = findKey(featuresMap,value);
              if(key)
              {
                queryList[obj].push(key);
              }
            })
          }
        }
        return {goodsType,queryList};
      }
      else{
        return {goodsType};
      }
    }
    // 根据value寻找key值的方法
    const findKey=(map, value)=>{
      let key = undefined;
      map.forEach((v,k)=>{
        if(v===value)
        {
          key = k;
        }
      })
      return key;
    }
    // Tag切换时，记录当所选前商品类型Id
    const handleTagChange = (key) => {
      setCurrentTypeId(key);
      };
    // 卡片点击事件
    const handleCardClick = (itemId)=>{
      const goodsTypeName = goodsType.find(item=>item.id===currentTypeId).goodsName;
      const goodsId = itemId;
      // 跳转到详情页
      navigate(`/home/mall/detail?goodsTypeName=${goodsTypeName}&goodsId=${goodsId}`,{
        replace:false,
        state:{goodsTypeName,goodsId}
      });
    }
    return (
      <>
        <div className='mall-content'>
            <Tabs  className='tab'
              tabBarGutter={30}
              defaultActiveKey={currentTypeId}
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
              goodsType = {goodsType} 
              currentTypeId = {currentTypeId}
              featuresMap = {featuresMap} 
              setFeaturesMap = {setFeaturesMap} 
              selectedTags = {selectedTags}
              setSelectedTags = {setSelectedTags}
              />
              <br></br>
              <CardGroup 
              allGoods = {allGoods}
              handleCardClick = {handleCardClick}
              />
          </div>
          <Outlet/>
      </> 
    );
}

export default Mall;
