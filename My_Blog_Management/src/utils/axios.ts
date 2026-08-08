// 创建并配置axios以进行前后端通信

import { baseUrl } from "./env";
import { YkMessage } from "@yike-design/ui";
import axios from "axios";

const service = axios.create({
    //baseURL: baseUrl,
    baseURL: '/',
    timeout: 8000,  //8s访问超时
});

//添加请求拦截器
service.interceptors.request.use(
    //在发送请求之前做些什么
    config=>{
        return config;
    },

    //对请求错误做些什么
    error=>{
        YkMessage({type: 'warning', message: error.message});
        return Promise.reject();
    }
)

//添加响应拦截器
service.interceptors.response.use(
    response=>{
        if(response.status === 200){
            return response.data;
        }else{
            YkMessage({type: 'warning', message: '请求发送错误'});
            return Promise.reject();
        }
    },
    error=>{
        YkMessage({type: 'warning', message: error.message});
        return Promise.reject();
    }
)

export default service;