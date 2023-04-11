import React,{useState,useEffect} from 'react';
import {Row,Col,Tag, Space } from 'antd';
import './navgroup.scss'

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
            <Row className='row-allclass' wrap={false} >
                <Col className='col-name' span={2}>所有分类</Col>
                <Col className='col-content' span={22}>
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
                    return (
                    <Row key={item.id} className='row-eachclass' >
                    <Col className='col-name' span={2}>{item.description}</Col>
                    <Col className='col-content' span={22}>
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
