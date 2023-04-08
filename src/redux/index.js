import {configureStore} from '@reduxjs/toolkit'
import userInfo from './UserInfo'

//创建store，合并所有子模块
const store = configureStore({
    reducer:{
        userInfo
    }
})

export default store