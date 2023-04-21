import React from 'react';
import {Card} from 'antd'
import './CardGroup.scss'

const { Meta } = Card;

const CardGroup = ({allGoods,handleCardClick}) => {
    return (
        <div className='card-content' >
            <div className='card-roll'>
                {
                    allGoods.map(item=>(
                        <Card
                        key={item.id}
                        onClick={()=>{handleCardClick(item.id)}}
                        className='mycard-image-cover'
                        hoverable
                        style={{
                        width: 240,
                        marginLeft:'20px',
                        marginBottom:'20px',
                        }}
                        cover={<img className='mycard-image' alt="example" src={item.detail?item.detail.imageUrl:'网络错误'} />}
                    >
                    <Meta  className='mycard-meta' title={item.detail?item.detail.name.trim():'网络错误'} description={item.detail?item.detail.description.trim():'网络错误'} />
                    </Card>
                    ))
                }
            </div>
        </div>
    );
}

export default CardGroup;
