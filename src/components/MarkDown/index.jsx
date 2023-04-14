import ReactMarkdown from 'react-markdown';
import React,{useState,useEffect} from 'react';
import axios from 'axios';
import {LoadingOutlined} from '@ant-design/icons'
import './MarkDown.scss'

const MarkDown = ({src}) => {
    // 保存md信息
    const [mdText,setMdText] = useState('');
    useEffect(()=>{
        try {
            axios.get(src)
            .then(response=>{
                setMdText(response.data)
            })
            .catch((err)=>{
            });
        } catch (error) {
        }
        src = '';
    },[src])
    return (
        <>
        {
            mdText?<ReactMarkdown 
            className='mark-down-style'
            components={{
               a:({node, ...props}) => <a target='_blank' {...props} />
            }}
            children={mdText.trim()}/>:
            <div  className='mark-down-loading'>
                <LoadingOutlined/>
            </div>
        }   
        </>
    );
}

export default MarkDown;
