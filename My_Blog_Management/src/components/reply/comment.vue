<template>
     <div class="card comment">
        <div class="card-title">
            <p class="card-title-name">作者留言板 {{ count }}</p>
        </div>
        <yk-scrollbar ref="scrollbar" :height="height" style="padding: 0 24px">
            <yk-space dir="vertical">
                <reply v-for="item in comments" :key="item.id" :content="item" @delete="deleteComment" @isread="changeIsRead"/>
            </yk-space>
        </yk-scrollbar>
        <div class="comment-page">
            <yk-pagination :total="count" size="m" @change="changePage" :default-page-size="props.pageSize"></yk-pagination>
        </div>
     </div>
</template>

<script lang="ts" setup>
import {onMounted, ref, getCurrentInstance} from 'vue';
import type { CommentProps } from './reply.ts';
import { commentApi, commentIsReadApi, deleteCommentApi } from '../../api/index.ts';
import { useManagerStore } from '../../store/managers.ts';
import { useCode } from '../../hooks/code.ts';

const managerStore = useManagerStore();

//code验证
const {tackleCode} = useCode();

const proxy:any=getCurrentInstance()?.proxy;

const props = withDefaults(defineProps<CommentProps>(), {
    pageSize: 4,
    height:"650px"
});

//总数
const count = ref<number>(123);
//数据内容
const comments = ref();

//请求
type Request = {
    token: string;
    pageSize: number;    //单页评论条数
    nowPage: number;     //当前页数
    count?: boolean      //是否统计
};

const request:Request = {
    token: managerStore.token,
    pageSize:props.pageSize,
    nowPage:1,
}

//获取数据
const drawCommentData = (e:boolean)=>{
    request.count = e;
    commentApi(request).then((res:any)=>{
        if(tackleCode(res.code)){
            if(res.data.count != -1){
                count.value = res.data.count;
            }
            comments.value = res.data.result;
        }
    });
};

//翻页
const changePage = (e:number)=>{
    request.nowPage = e;
    drawCommentData(false);
}

//已读
const changeIsRead = (e:number)=>{
    let request = {
        token: managerStore.token,
        id: e
    };
    commentIsReadApi(request).then((res:any)=>{
        if(tackleCode(res.code)){
            //处理前端的已读
            for(let i = 0; i < comments.value.length; i++){
                if(comments.value[i].ID == e){
                    comments.value[i].isRead = 1;
                }
            }
        }
    });
}

//删除评论
const deleteComment = (e:number)=>{
    let request = {
        //token正常传
        token: managerStore.token,
        id: e
    };
    //console.log(request);
    deleteCommentApi(request).then((res:any)=>{
        //tackleCode的第二个参数为true表示要检测是否为游客
        if(tackleCode(res.code, true)){
            //处理前端
            comments.value = comments.value.filter((obj:any)=>{
                return obj.ID !== e;
            });
            drawCommentData(true);
            proxy.$message({type:'primary',message:'删除成功'});
        }
    });
}

onMounted(()=>{
    drawCommentData(true);
});
</script>

<style lang="less" scoped>
    .comment{
        padding: @space-xl 0 64px;
        position: relative;
        .card-title-name{
            padding: 0 @space-xl;
        }
        &-page{
            padding:@space-l @space-xl;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            border-top: 1px solid @line-color-s;
            position: absolute;
            bottom: 0;
            width: 100%;
            left: 0;
        }
    }
</style>