import {configureStore} from '@reduxjs/toolkit'
import userInfo from './UserInfo'
import message from './Notification'

//创建store，合并所有子模块
const store = configureStore({
    reducer:{
        userInfo,
        message
    }
})

export default store