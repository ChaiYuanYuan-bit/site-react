import axios from "axios";
import baseURL from '../config'

const axiosInstance = axios.create({
    baseURL:baseURL,
    timeout: 20000,
  });

//请求拦截器
axiosInstance.interceptors.request.use(function (config){
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    let token = sessionStorage.getItem('token')
    if(token){
        config.headers.token = token //请求头加上token
    }
    return config;
},function (error){
    return Promise.reject(error);
});

//响应拦截器
axiosInstance.interceptors.response.use(function (response){
    return response;
},function (error){
    return Promise.reject(error);
})

export default axiosInstance;