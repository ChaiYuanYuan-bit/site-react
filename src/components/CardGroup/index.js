import React from 'react';
import {Layout,Card} from 'antd'

const { Meta } = Card;

const CardGroup = () => {
    return (
        <div style={{
            display:'flex',
            flexDirection:'row',
            alignItems:'stretch',
            flexWrap:'wrap',
            margin:'0,auto'
            }}>
            <Card
            hoverable
            style={{
            width: 240,
            marginLeft:'20px',
            marginBottom:'20px',
            }}
            cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
        >
            <Meta title="Europe Street beat" description="www.instagram.com" />
        </Card>
        <Card
            hoverable
            style={{
            width: 240,
            marginLeft:'20px',
            marginBottom:'20px',
            }}
            cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
        >
            <Meta title="Europe Street beat" description="www.instagram.com" />
        </Card>
        <Card
            hoverable
            style={{
            width: 240,
            marginLeft:'20px',
            marginBottom:'20px',
            }}
            cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
        >
            <Meta title="Europe Street beat" description="www.instagram.com" />
        </Card>
        <Card
            hoverable
            style={{
            width: 240,
            marginLeft:'20px',
            marginBottom:'20px',
            }}
            cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
        >
            <Meta title="Europe Street beat" description="www.instagram.com" />
        </Card>
        <Card
            hoverable
            style={{
            width: 240,
            marginLeft:'20px',
            marginBottom:'20px',
            }}
            cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
        >
            <Meta title="Europe Street beat" description="www.instagram.com" />
        </Card>
        <Card
            hoverable
            style={{
            width: 240,
            marginLeft:'20px',
            marginBottom:'20px',
            }}
            cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
        >
            <Meta title="Europe Street beat" description="www.instagram.com" />
        </Card>
        <Card
            hoverable
            style={{
            width: 240,
            marginLeft:'20px',
            marginBottom:'20px',
            }}
            cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
        >
            <Meta title="Europe Street beat" description="www.instagram.com" />
        </Card>
        </div>
    );
}

export default CardGroup;
