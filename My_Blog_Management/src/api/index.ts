// 前后端通信

import fetch from '../utils/axios';

//判断是否有注册
export const isRegisterApi = (data:object)=>fetch.post('/isRegister', data);

//管理员注册
export const registerApi = (data:object)=>fetch.post('/register', data);

//管理员登录
export const signInApi = (data:object)=>fetch.post('/signIn', data);

//获取总览数据
export const overviewApi = (data:object)=>fetch.post('/overview', data);

//获取评论
export const commentApi = (data:object)=>fetch.post('/comment', data);

//将评论转为已读
export const commentIsReadApi = (data:object)=>fetch.post('/commentIsRead', data);

//删除评论
export const deleteCommentApi = (data:object)=>fetch.post('/deleteComment', data);

//获取私信
export const messageApi = (data:object)=>fetch.post('/message', data);

//获取未读私信数
export const messageCountNotReadApi = (data:object)=>fetch.post('/messageCountNotRead', data);

//删除私信
export const deleteMessageApi = (data:object)=>fetch.post('/deleteMessage', data);

//新建分组
export const addSubsetApi = (data:object)=>fetch.post('/addSubset', data);

//获取分组
export const subsetApi = (data:object)=>fetch.post('/subset', data);

//修改分组
export const reviseSubsetApi = (data:object)=>fetch.post('/reviseSubset', data);

//删除分组
export const deleteSubsetApi = (data:object)=>fetch.post('/deleteSubset', data);

//新建标签
export const addLabelApi = (data:object)=>fetch.post('/addLabel', data);

//获取标签
export const labelApi = (data:object)=>fetch.post('/label', data);

//删除标签
export const deleteLabelApi = (data:object)=>fetch.post('/deleteLabel', data);

//新建文章/图库
export const createArticleApi = (data:object)=>fetch.post('/createArticle', data);

//上传文件
export const uploadApi = (data:object)=>fetch.post('/upload', data);

//文章/图库修改
export const updateArticleApi = (data:object)=>fetch.post('/updateArticle', data);

//获取文章
export const articleApi = (data:object)=>fetch.post('/article', data);

//获取文章作者
export const getArticleAuthorApi = (data:object)=>fetch.post('/articleAuthor', data);

//获取文章状态
export const articleStateApi = (data:object)=>fetch.post('/articleState', data);

//文章发布和撤回
export const changeArticleStateApi = (data:object)=>fetch.post('/changeArticleState', data);

//删除文章
export const deleteArticleApi = (data:object)=>fetch.post('/deleteArticle', data);

//获取文章以修改
export const gainArticleApi = (data:object)=>fetch.post('/gainArticle', data);

//删除文件
export const deleteFileApi = (data:object)=>fetch.post('/deleteFile', data);

//使用URL删除文件
export const deleteFileByURLApi = (data:object)=>fetch.post('/deleteFileByURL', data);

//新建日记
export const createDiaryApi = (data:object)=>fetch.post('/createDiary', data);

//获取日记
export const diaryApi = (data:object)=>fetch.post('/diary', data);

//获取指定ID的日记
export const gainDiaryApi = (data:object)=>fetch.post('/gainDiary', data);

//删除日记
export const deleteDiaryApi = (data:object)=>fetch.post('/deleteDiary', data);

//获取文件
export const fileApi = (data:object)=>fetch.post('/file', data);

//移动文件至其它分组
export const moveFileApi = (data:object)=>fetch.post('/moveFile', data);

//更新文件所属管理员
export const updateFileManagerIDApi = (data:object)=>fetch.post('/updateFileManagerID', data);