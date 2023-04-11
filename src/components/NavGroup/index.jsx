import React,{useState,useEffect} from 'react';
import {Row,Col,Tag, Space } from 'antd';
const { CheckableTag } = Tag;

const NavGroup = ({goodsType,currentTypeId}) => {
    
    const [selectedTags, setSelectedTags] = useState([]);
    const [goodsFeatures,setGoodsFeatures] = useState([]);
    useEffect(()=>{
        loadFeatures();
    },[goodsType,currentTypeId])
    //
    const loadFeatures = ()=>{
        const currentGoods = goodsType.find(item=>item.id===currentTypeId);
        // setTagsData(features);
        if(currentGoods)
        {
            const features = currentGoods.features;
            setGoodsFeatures(features);
            setSelectedTags([]);
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
            <Row wrap={false} style={{height:'3em',lineHeight:'2em'}}>
                <Col span={4} style={{background: 'green',paddingLeft:'3em',minWidth:'130px'}}>所有分类</Col>

                <Col span={20} style={{background: '#eee',paddingLeft:'2em'}}>
                  <Space size={[0, 8]} wrap>
                    {selectedTags.map((tag) => (
                     <Tag key={tag} color='geekblue' closable onClose={()=>onClose(tag)}>
                      {tag}
                    </Tag>
                    ))}
                  </Space>
                </Col>
              </Row>
              { goodsFeatures ? goodsFeatures.map(item=>{
                    return (<Row key={item.id} style={{height:'3em',lineHeight:'2em',minHeight:'20px',width:'100%'}}>
                    <Col   style={{background: 'green',paddingLeft:'3em'}}>{item.description}</Col>
                    <Col  style={{background: '#eee',paddingLeft:'2em'}}>
                    <Space size={[0, 8]} wrap>
                    {item.details.map((tag) => (
                        <CheckableTag
                        key={tag.id}
                        checked={selectedTags.includes(tag.id)}
                        onChange={(checked) => handleChange(tag.id, checked)}
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
