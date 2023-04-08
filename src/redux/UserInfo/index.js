import {createSlice} from '@reduxjs/toolkit'

//创建子模块
const userInfo = createSlice({
    name:'userInfo',
    //初始状态
    initialState:{
        info:{}
    },
    //操作状态
    reducers:{
        setInfo:(state,{payload})=>{
            state.info = payload.info
        }
    }
})

export const {setInfo} = userInfo.actions

export default userInfo.reducer