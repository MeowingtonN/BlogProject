<template>
     <yk-drawer placement="right" :show="active" @close="closes" :title="'作者私信 '+count">
          <yk-space dir="vertical">
                <reply v-for="item in messages" :key="item.id" :content="item" @delete="deleteMessage" :isComment="false"/>
          </yk-space>
          <template #footer>
               <yk-pagination :total="count" simple @change="changePage" :default-page-size="props.pageSize"></yk-pagination>
          </template>
     </yk-drawer>
</template>

<script lang="ts" setup>
import { toRefs, watch } from 'vue';
import {ref, getCurrentInstance} from 'vue';
import type { MessageProps } from './reply';
import { messageApi, deleteMessageApi } from '../../api';
import { useManagerStore } from '../../store/managers';
import { useCode } from '../../hooks/code';

const managerStore = useManagerStore();
//code验证
const {tackleCode} = useCode();

const proxy:any=getCurrentInstance()?.proxy;

const props = withDefaults(defineProps<MessageProps>(),{
     active:false,
     pageSize:8
});
const emits = defineEmits(["close"]);
const {active} = toRefs(props);
const closes = ()=>{
     emits("close",false);
}

//总数
const count = ref<number>(123);
//数据内容
const messages = ref();

//请求
type Request = {
    token: string;
    pageSize: number;    //单页评论条数
    nowPage: number;     //当前页数
    count?: boolean;
};

const request:Request = {
    token: managerStore.token,
    pageSize:props.pageSize,
    nowPage:1,
}

//获取数据
const drawMessageData=(e:boolean)=>{
    request.count = e;
    messageApi(request).then((res:any)=>{
        if(tackleCode(res.code)){
            if(res.data.count != -1){
                count.value = res.data.count;
            }
            messages.value = res.data.result;
        }
    });
};

//翻页
const changePage = (e:number)=>{
    request.nowPage = e;
    drawMessageData(false);
}

//删除私信
const deleteMessage = (e:number)=>{
    let request = {
        token: managerStore.token,
        id: e
    };
    deleteMessageApi(request).then((res:any)=>{
        if(tackleCode(res.code, true)){
            messages.value = messages.value.filter((obj:any)=>{
                return obj.id !== e;
            });
            drawMessageData(true);
            proxy.$message({type:'primary', message:'delete message done'});
        }
    })
}

//处理获取私信、私信未读小红点。在用户点击私信图标后才进行数据库查询。
watch(() => props.active, (newValue, oldValue)=>{
    if(newValue === true && oldValue === false){
        //初始化request
        request.count = true;
        request.token = managerStore.token;
        request.pageSize = props.pageSize;
        request.nowPage = 1;
        messageApi(request).then((res:any)=>{
            if(tackleCode(res.code)){
                if(res.data.count != -1){
                    count.value = res.data.count;
                }
                messages.value = res.data.result;
            }
        });
    }
});

</script>

<style lang="less" scoped>

</style>