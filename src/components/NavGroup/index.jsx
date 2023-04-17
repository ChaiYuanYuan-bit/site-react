import React,{useState,useEffect} from 'react';
import {Row,Col,Tag, Space } from 'antd';
import './navgroup.scss'

const { CheckableTag } = Tag;

const NavGroup = ({goodsType,currentTypeId,selectedTags,setSelectedTags,featuresMap,setFeaturesMap}) => {
    // 商品特点表
    const [goodsFeatures,setGoodsFeatures] = useState([]);
    useEffect(()=>{
        loadFeatures();
    },[goodsType.length,currentTypeId,goodsFeatures.length])
    // 加载商品特点
    const loadFeatures = ()=>{
        const currentGoods = goodsType.find(item=>item.id===currentTypeId);
        if(currentGoods)
        {
            const features = currentGoods.features;
            let initialTags = {}
            features.map(goods=>{
              //设置已选tags的初始结构
              initialTags[goods.id]=[];
            })
            //添加一个length属性
            initialTags.length=0;
            setGoodsFeatures(features);
            setSelectedTags(initialTags);
        }
    };
    //CheckableTag onchange事件处理
    const handleChange = (tagClass,tagName, checked) => {
      let nextSelectedTags = {};
      if(checked)
      {
        nextSelectedTags = {...selectedTags,...{[tagClass]:[...selectedTags[tagClass], tagName]},length:selectedTags.length+1};
      }
      else{
        nextSelectedTags = {...selectedTags,...{[tagClass]:selectedTags[tagClass].filter((t) => t !== tagName)},length:selectedTags.length-1}
      }
      setSelectedTags(nextSelectedTags);
    };
    //处理标签删除的函数
    const handleTagClose = (tagClass,tagName)=>{
      let nextSelectedTags = {...selectedTags,...{[tagClass]:selectedTags[tagClass].filter((t) => t !== tagName)},length:selectedTags.length-1}
      setSelectedTags(nextSelectedTags);
    }
    // 生成所有分类的标签函数
    const generateTags = ()=>{
      let tags = [];
      for(let obj in selectedTags)
      {
        if(obj!='length')
        {
          if(selectedTags[obj].length>0)
          {
            tags = [...tags,selectedTags[obj].map((tag)=>(
            <Tag className='my-alltag' key={tag} color='geekblue' closable onClose={()=>{handleTagClose(obj,tag)}} onClick={()=>{handleTagClose(obj,tag)}}>
              {tag}
            </Tag>
          ))]
          }
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
      for(let obj in selectedTags)
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
            <Row className='row-allclass' wrap={false} >
                <Col className='col-name' span={2}>所有分类</Col>
                <Col className='col-content' span={22}>
                  <Space size={[0, 8]} wrap>
                    {generateTags()}
                  </Space>
                </Col>

              </Row>
              { goodsFeatures ? goodsFeatures.map(item=>{
                    return (
                    <Row key={item.id} className='row-eachclass' >
                    <Col className='col-name' span={2}>{item.description}</Col>
                    <Col className='col-content' span={22}>
                    <Space size={[0, 8]} wrap>
                    {item.details.map((tag) => (
                        <CheckableTag
                        className='mytag-css'
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
                }) : (<></>)
              }
        </>
    );
}

export default NavGroup;
