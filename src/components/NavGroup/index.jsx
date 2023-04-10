import React,{useState,useEffect} from 'react';
import {Row,Col,Tag, Space } from 'antd';
const { CheckableTag } = Tag;

const NavGroup = ({goodsType,currentTypeId}) => {
    
    const [selectedTags, setSelectedTags] = useState([]);
    const [goodsFeatures,setGoodsFeatures] = useState([]);
    const [tagsData, setTagsData] = useState([]);
    useEffect(()=>{
        loadFeatures();
    },[goodsType])
    //
    const loadFeatures = ()=>{
        const currentGoods = goodsType.find(item=>item.id===currentTypeId);
        // setTagsData(features);
        if(currentGoods)
        {
            const features = currentGoods.features;
            setGoodsFeatures(features);
        }
        
    };
    const handleChange = (tag, checked) => {
      const nextSelectedTags = checked
        ? [...selectedTags, tag]
        : selectedTags.filter((t) => t !== tag);
      console.log('You are interested in: ', nextSelectedTags);
      setSelectedTags(nextSelectedTags);
    };
    const onClose = (tag) => {
        console.log(tag);
      };
    return (
        <>
            <Row wrap={false} style={{height:'3em',lineHeight:'2em',maxWidth:'100%'}}>
                <Col span={2} style={{background: 'green',paddingLeft:'3em',minWidth:'130px'}}>所有分类</Col>

                <Col span={22} style={{background: '#eee',paddingLeft:'2em'}}>
                  <Space size={[0, 8]} wrap>
                    {selectedTags.map((tag) => (
                     <Tag key={tag} closable onClose={()=>onClose(tag)}>
                      {tag}
                    </Tag>
                    ))}
                  </Space>
                </Col>
              </Row>
              {
                goodsFeatures ? goodsFeatures.map(item=>{
                    return (<Row key={item.id} wrap={false} style={{height:'3em',lineHeight:'2em',minHeight:'20px'}}>
                    <Col span={2} style={{background: 'green',paddingLeft:'3em',minWidth:'130px'}}>{item.description}</Col>
                    <Col span={22} style={{background: '#eee',paddingLeft:'2em'}}>
                    <Space size={[0, 8]} wrap>
                    {item.details.map((tag) => (
                        <CheckableTag
                        key={tag.id}
                        checked={selectedTags.includes(tag.name)}
                        onChange={(checked) => handleChange(tag.name, checked)}
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
