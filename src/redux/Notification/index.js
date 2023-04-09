import {createSlice} from '@reduxjs/toolkit'

//创建子模块
const message = createSlice({
    name:'message',
    //初始状态
    initialState:{
        msg:{
                type:'',
                description:''
            } 
    },
    //操作状态
    reducers:{
        setMsg:(state,{payload})=>{
            state.msg = payload.msg
        }
    }
})

export const {setMsg} = message.actions

export default message.reducer