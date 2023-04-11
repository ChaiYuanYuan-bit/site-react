import React,{useState,useEffect} from 'react';
import {Row,Col,Tag, Space } from 'antd';
const { CheckableTag } = Tag;

const NavGroup = ({goodsType,currentTypeId,selectedTags,setSelectedTags,featuresMap,setFeaturesMap}) => {
    // 商品特点表
    const [goodsFeatures,setGoodsFeatures] = useState([]);

    useEffect(()=>{
        loadFeatures();
    },[goodsType,currentTypeId])
    // 加载商品特点
    const loadFeatures = ()=>{
        const currentGoods = goodsType.find(item=>item.id===currentTypeId);
        if(currentGoods)
        {
            const features = currentGoods.features;
            let _featuresMap = new Map();
            let initialTags = {}
            features.map(goods=>{
              //设置已选tags的初始结构
              initialTags[goods.id]=[];
              //并且添加feature对应表，方便查询
              goods.details.map(feature=>_featuresMap.set(feature.id,feature.name));
            })
            console.log(_featuresMap);
            setGoodsFeatures(features);
            setSelectedTags(initialTags);
            setFeaturesMap(_featuresMap);
        }
    };
    //CheckableTag onchange事件处理
    const handleChange = (tagClass,tagName, checked) => {
      //记录选择到的标签
      let nextSelectedTags = {};
      if(checked)
      {
        nextSelectedTags = {...selectedTags,...{[tagClass]:[...selectedTags[tagClass], tagName]}};
      }
      else{
        nextSelectedTags = {...selectedTags,...{[tagClass]:selectedTags[tagClass].filter((t) => t !== tagName)}}
      }
      setSelectedTags(nextSelectedTags);
    };
    // 生成所有分类的标签函数
    const generateTags = ()=>{
      let tags = [];
      for(var obj in selectedTags)
      {
        if(selectedTags[obj].length>0)
        {
          tags = [...tags,selectedTags[obj].map((tag)=>(
          <Tag key={tag} color='geekblue' closable>
            {tag}
          </Tag>
        ))]
        }
      }
      if(tags.length>0)
      {
        return (tags);
      }
      else{
        return (<></>);
      }
    }
    // 每个标签选择状态控制
    const ifTagsChecked = (tagId)=>{
      for(var obj in selectedTags)
      {
        if(selectedTags[obj].length>0)
        {
          if(selectedTags[obj].includes(featuresMap.get(tagId)))
          {
            return true
          }
        }
      }
      return false;
    }

    return (
        <>
            <Row wrap={false}>
                <Col span={4}>所有分类</Col>
                
                <Col span={20}>
                  <Space size={[0, 8]} wrap>
                    {generateTags()}
                  </Space>
                </Col>
              </Row>
              {  goodsFeatures.map(item=>{
                    return (<Row key={item.id} >
                    <Col  span={4}>{item.description}</Col>
                    <Col  span={20}>
                    <Space size={[0, 8]} wrap>
                    {item.details.map((tag) => (
                        <CheckableTag
                        key={tag.id}
                        // checked={selectedTags.includes(tag.id)}
                        checked={ifTagsChecked(tag.id)}
                        onChange={(checked) => handleChange(item.id,tag.name, checked)}
                        >
                        {tag.name}
                        </CheckableTag>
                    ))}
                    </Space>
                    </Col>
                </Row>);
                }) 
              }
        </>
    );
}

export default NavGroup;
