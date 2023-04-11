import React from 'react';
import {Layout,Card} from 'antd'
import './CardGroup.scss'

const { Meta } = Card;

const CardGroup = ({allGoods,handleCardClick}) => {
    return (
        <div style={{
            display:'flex',
            flexDirection:'row',
            alignItems:'stretch',
            flexWrap:'wrap',
            margin:'0,auto'
            }}>
                {
                    allGoods.map(item=>(
                        <Card
                        key={item.id}
                        className='mycard-image-cover'
                        hoverable
                        style={{
                        width: 240,
                        marginLeft:'20px',
                        marginBottom:'20px',
                        }}
                        cover={<img className='mycard-image' alt="example" src={item.detail?item.detail.imageUrl:'网络错误'} />}
                    >
                    <Meta title={item.detail?item.detail.hotelName:'网络错误'} description={item.detail?item.detail.description:'网络错误'} />
                    </Card>
                    ))
                }
           
        </div>
    );
}

export default CardGroup;
