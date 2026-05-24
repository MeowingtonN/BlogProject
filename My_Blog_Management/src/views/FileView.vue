<template>
    <yk-space size="l" dir="vertical" class="file-view">
        <top-title name="本地文件" :is-search="false" style="margin-bottom: 8px;">
            <template #custom>
                <yk-space align="center">
                    <yk-text type="third">上传图片、视频、音频等</yk-text>
                    <yk-upload :upload-url="uploadUrl" @handleSuccess="handleSuccess" />
                </yk-space>
            </template>
        </top-title>
        <subset-vue :classify="2" @nowSubset="nowSelect" :isDelete="isDelete" :is-change-subset="isChangeSubset"/>
        <files-vue :page-size="10" :subsetID="nowSubset" @delete-file="handleDeleteFile" @change-subset="handleChangeSubset" :is-upload="isUpload"/>
    </yk-space>
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance } from 'vue';
import TopTitle from '../components/TopTitle.vue';
import subsetVue from '../components/subset/subset.vue';
import filesVue from '../components/files/files.vue';
import { baseUrl } from '../utils/env';
import { useCode } from '../hooks/code';
import { useManagerStore } from '../store/managers';

const {tackleCode} = useCode();
const managerStore = useManagerStore();
const proxy:any = getCurrentInstance()?.proxy;
const nowSubset = ref<number | string>(-1);

const nowSelect = (e: { id: number | string, type: string }) => {
    if (e.type == "all") {
        nowSubset.value = -1;
    } else if (e.type == "subset" || e.type == "exclude") {
        nowSubset.value = e.id;
    }
}

const isDelete = ref<boolean>(false);
const handleDeleteFile = ()=>{
    isDelete.value = !isDelete.value;
}

const isChangeSubset = ref<boolean>(false);
const handleChangeSubset = ()=>{
    isChangeSubset.value = !isChangeSubset.value;
}

const isUpload = ref<boolean>(false);

const uploadUrl = ref<string>();
//游客模式下不可上传文件
if(managerStore.token != ''){
    uploadUrl.value = `${baseUrl}/upload`;
}else{
    uploadUrl.value = '';
}
//文件上传成功反馈
const handleSuccess = (e:any)=>{
    if(tackleCode(e.code, true)){
        //刷新当前页面
        //router.go(0);
        isUpload.value = !isUpload.value;
        isChangeSubset.value = !isChangeSubset.value;
    }else{
        proxy.$message({type:'warning', message:'token验证未通过！'});   
    }
}

</script>

<style lang="less" scoped>
    .file-view{
        width:100%;
    }
</style>
<style lang="less">
    .file-view{
        .yk-upload{
            width: auto !important;
        }
        .yk-upload__file-button{
            margin-right: 0;
        }
        .yk-upload__file-list{
            display: none;
        }
    }
</style>