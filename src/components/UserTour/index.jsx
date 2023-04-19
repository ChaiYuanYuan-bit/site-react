import React, { useRef } from React;
import { Button, Tour } from 'antd';
import { LinkOutlined } from '@ant-design/icons';

const UserTour = () => {
  const createRef = useRef<HTMLButtonElement>(null);
  const updateRef = useRef<HTMLButtonElement>(null);
  const deleteRef = useRef<HTMLButtonElement>(null);
  
  return (
    <div>
      <Button type="primary" ref={createRef}>Create</Button>
      <Button ref={updateRef}>Update</Button>
      <Button danger ref={deleteRef}>Delete</Button>
      <Tour
        steps={[
          {
            title: '创建',
            description: '创建一条数据',
            target: () => createRef.current,
          },
          {
            title: '更新',
            cover: <img src="example.com" />,
            description: (
              <div>
                <span>更新一条数据</span>
                <Button type="link">
                  帮助文档
                  <LinkOutlined />
                </Button>
              </div>
            ),
            target: () => updateRef.current,
          },
          {
            title: '删除',
            cover: <video src="example.com" />,
            description: (
              <div>
                <span>危险操作：删除一条数据</span>
                <Button type="link">
                  帮助文档
                  <LinkOutlined />
                </Button>
              </div>
            ),
            target: () => deleteRef.current,
          },
        ]}  
      />
    </div>
  );
}
export default UserTour;