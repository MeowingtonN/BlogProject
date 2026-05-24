<template>
    <yk-space class="gather">
        <div v-for="(item,index) in gathers" :key="index" class="gather_list" :style="{background: 'linear-gradient(' + item.bgcolor + ')'}">
            <yk-space dir="vertical" size="s">
                <yk-text type="secondary">{{ item.name }}</yk-text>
                <yk-title :level="2" style="margin:0">{{ item.total }}</yk-title>
            </yk-space>
            <yk-button v-if="index>0" size="xl" type="secondary" shape="square" @click="editPage(item.path)">
                <IconPlusOutline />
            </yk-button>
        </div>
    </yk-space>
</template>

<script lang="ts" setup>
import {ref,onMounted} from 'vue';
import { overLink } from '../../utils/menu.ts';
import { useRouter } from 'vue-router';
import { overviewApi } from '../../api/index.ts';
import { useManagerStore } from '../../store/managers.ts';
import { useCode } from '../../hooks/code.ts';

const managerStore = useManagerStore();

//code验证
const {tackleCode} = useCode();

const router = useRouter();

const gathers = ref(overLink);

//获取总览数据
const drawGatherData = ()=>{
    let request = {
        token: managerStore.token
    }
    overviewApi(request).then((res:any)=>{
        if(tackleCode(res.code)){
            //返回的数据 
            let data = res.data;
            gathers.value[0].total = data.files;
            gathers.value[1].total = data.article;
            gathers.value[2].total = data.gallery;
            gathers.value[3].total = data.diary;
        }
    });
}

//跳转到编辑页面
const editPage = (n:string)=>{
    router.push(n);
}

onMounted(()=>{
    drawGatherData();
});
</script>

<style lang="less" scoped>
    .gather{
        width: 100%;
        &_list{
            width:25%;
            background: #eee;
            display: flex;
            justify-content: space-between;
            padding: @space-xl;
            border-radius: @radius-m;
            align-items: center;
            &:first-child{
                .yk-title, .yk-text{
                    color: @white;
                }
            }
        }
    }
</style>