import React,{useState} from 'react';
import {Layout, Tabs,Row,Col,Tag, Space } from 'antd';
import {
    UserOutlined,
    VideoCameraOutlined,
  } from '@ant-design/icons';
const tagsData = ['Movies', 'Books', 'Music', 'Sports'];
const { CheckableTag } = Tag;

const Mall = () => {
        //tags
        const onChange = (key) => {
            console.log(key);
          };
          //tag
          const [selectedTags, setSelectedTags] = useState(['Books']);
          //
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
           <Tabs
                defaultActiveKey="2"
                style={{paddingLeft:'20px',paddingBottom:0,margin:0}}
                onChange={onChange}
                items={[VideoCameraOutlined, UserOutlined].map((Icon, i) => {
                  const id = String(i + 1);
                  return {
                    label: (
                      <span>
                        <Icon />
                        Tab {id}
                      </span>
                    ),
                    key: id,
                  };
                })}
              />
               <Row wrap={false} style={{height:'3em',lineHeight:'2em',maxWidth:'100%'}}>
                <Col span={2} style={{background: 'green',paddingLeft:'3em',minWidth:'130px'}}>所有分类</Col>
                <Col span={22} style={{background: '#eee',paddingLeft:'2em'}}>
                  <Space size={[0, 8]} wrap>
                    {tagsData.map((tag) => (
                     <Tag key={tag} closable onClose={()=>onClose(tag)}>
                      {tag}
                    </Tag>
                    ))}
                  </Space>
                </Col>
              </Row>
              <Row wrap={false} style={{height:'3em',lineHeight:'2em',minHeight:'20px'}}>
                <Col span={2} style={{background: 'green',paddingLeft:'3em',minWidth:'130px'}}>地点</Col>
                <Col span={22} style={{background: '#eee',paddingLeft:'2em'}}>
                <Space size={[0, 8]} wrap>
                  {tagsData.map((tag) => (
                    <CheckableTag
                      key={tag}
                      checked={selectedTags.includes(tag)}
                      onChange={(checked) => handleChange(tag, checked)}
                    >
                      {tag}
                    </CheckableTag>
                  ))}
                </Space>
                </Col>
              </Row>
              <Row wrap={false} style={{height:'3em',lineHeight:'2em'}}>
                <Col span={2} style={{background: 'green',paddingLeft:'3em',minWidth:'130px'}}>星级</Col>
                <Col span={22} style={{background: '#eee',paddingLeft:'2em'}}>
                <Space size={[0, 8]} wrap>
                  {tagsData.map((tag) => (
                    <CheckableTag
                      key={tag}
                      checked={selectedTags.includes(tag)}
                      onChange={(checked) => handleChange(tag, checked)}
                    >
                      {tag}
                    </CheckableTag>
                  ))}
                </Space>
                </Col>
              </Row>
              <Row wrap={false} style={{height:'3em',lineHeight:'2em'}}>
                <Col span={2} style={{background: 'green',paddingLeft:'3em',minWidth:'130px'}}>品牌</Col>
                <Col span={22} style={{background: '#eee',paddingLeft:'2em'}}>
                <Space size={[0, 8]} wrap>
                  {tagsData.map((tag) => (
                    <CheckableTag
                      key={tag}
                      checked={selectedTags.includes(tag)}
                      onChange={(checked) => handleChange(tag, checked)}
                    >
                      {tag}
                    </CheckableTag>
                  ))}
                </Space>
                </Col>
              </Row>   
        </>
    );
}

export default Mall;
