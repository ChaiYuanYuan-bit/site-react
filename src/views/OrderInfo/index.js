import React,{ useEffect, useState }  from 'react';
import './OrderInfo.scss'
import {FcBusinessman,FcManager} from 'react-icons/fc'
import { Tabs,Avatar, Divider, List, Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';

let testTab = [
    {id:1,description:'全部订单'},
    {id:2,description:'未出行'},
    {id:3,description:'待付款'},
    {id:4,description:'待评价'},
]

const OrderInfo = () => {
    const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    fetch('https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo')
      .then((res) => res.json())
      .then((body) => {
        setData([...data, ...body.results]);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    loadMoreData();
  }, []);

    return (
        <div className='employee-orderInfo'>
            <div className='employee-orderInfo-header'>
                <div className='topInfo'>
                    <div className='avatar' title='普通员工'>
                        <FcBusinessman className='svg'/>
                    </div>
                    <div><span>张三</span></div>
                </div>
                <div className='bottomInfo'>
                    <div><span>钱包余额</span></div>
                    <div><span>优惠券</span></div>
                </div>
            </div>
            <div className='employee-orderInfo-content'>
            <div className='navbar'>
            <Tabs  className='tab'
              defaultActiveKey="1"
            //   onChange={handleTagChange}
              items={ testTab.map((item) => {
                return {
                  label: (
                    <span>
                      {item.description}
                    </span>
                  ),
                  key: item.id,
                };
              })}/>
            </div>
            <div id='employee-orderInfo-content-list'>
            <InfiniteScroll
            dataLength={data.length}
            next={loadMoreData}
            hasMore={data.length < 50}
            loader={
            <Skeleton
                avatar
                paragraph={{
                rows: 1,
                }}
                active
            />
            }
            endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
            scrollableTarget="content"
            >
        <List
          dataSource={data}
          renderItem={(item) => (
            <List.Item 
            key={item.email}
            actions={[<a key="list-loadmore-edit">去付款</a>, <a key="list-loadmore-more">取消订单</a>]}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.picture.large} />}
                title={<a href="https://ant.design">{item.name.last}</a>}
                description={item.email}
              />
              <div>Content</div>
            </List.Item>
          )}
        />
      </InfiniteScroll>
            </div>
            </div>
        </div>
    );
}

export default OrderInfo;
