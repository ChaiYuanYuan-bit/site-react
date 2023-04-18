import React from 'react';
import { Drawer } from 'antd';
import './ModifyUser.scss'
const modifyUser = ({drawerOpen,setDrawerOpen}) => {
    return (
        <>
            <Drawer title="Basic Drawer" placement="right" onClose={()=>{setDrawerOpen(false)}} open={drawerOpen}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
        </>
    );
}

export default modifyUser;
