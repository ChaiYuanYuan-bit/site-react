import ReactMarkdown from 'react-markdown';
import React,{useState,useEffect} from 'react';
import axios from 'axios';
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
                setMdText('# **出错啦！**');
                console.error(err);
            });
        } catch (error) {
            console.error(error);
        }
        
    },[])
    return (
        <>
             <ReactMarkdown 
             className='mark-down-style'
             components={{
                a:({node, ...props}) => <a target='_blank' {...props} />
             }}
             children={mdText}/>
        </>
    );
}

export default MarkDown;
