<template>
    <div class="diary-editor">
        <div class="diary-editor-form">
            <div class="diary-editor-top">
                <input type="text" class="diary-editor-title" placeholder="请输入标题" v-model="diaryForm.Title" />
                <yk-popover placement="bottomRight" title="选择天气">
                    <template #content>
                        <yk-space wrap :size="[32,20]" style="padding: 16px 0 16px 14px;">
                            <div class="diary-editor-weather" v-for="item in weathers" :class="{selected:diaryForm.weatherID==item.id}" @click="selectWeather(item.id)">
                                <img :src="'/src/'+item.icon" />
                            </div>
                        </yk-space>
                    </template>
                    <img :src="'/src/'+weathers[diaryForm.weatherID].icon" />
                </yk-popover>
            </div>
            <yk-text-area v-model="diaryForm.Content" :max-length="1600" placeholder="请输入..." :auto-size="{minRows:24,maxRows:24}"></yk-text-area>
            <div class="diary-editor-picture">
                <yk-upload :upload-url="uploadUrl" :fileList="fileList" accept="image/*" @handleSuccess="handleSuccess" @handleDelete="deletePhoto"></yk-upload>
            </div>
        </div>
        <div class="diary-editor-foot">
            <yk-space size="s">
                <yk-button type="secondary" @click="cancel">取消</yk-button>
                <yk-button @click="newDiary">新建笔记</yk-button>
            </yk-space>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {ref, getCurrentInstance, onMounted} from "vue";
import { weathers } from "../../utils/weather";
import type { DiaryData } from "../../utils/interface";
import { baseUrl } from "../../utils/env";
import { useCode } from "../../hooks/code";
import { useFile } from "../../hooks/files";
import { useManagerStore } from "../../store/managers";
import { createDiaryApi } from "../../api";

const managerStore = useManagerStore();
const {tackleCode} = useCode();
const proxy:any = getCurrentInstance()?.proxy;
const emits = defineEmits(["diaryData"]);

const diaryForm = ref<DiaryData>({weatherID:0});

//选择天气
const selectWeather = (id:number)=>{
    diaryForm.value.weatherID = id;
}

//文件上传路径
const uploadUrl = ref<string>();
//游客模式下不可上传文件
if(managerStore.token != ''){
    uploadUrl.value = `${baseUrl}/upload`;
}else{
    uploadUrl.value = '';
}

//存储后端返回
const fileList = ref<{id:number;URL:string}[]>([]);

//新建
const newDiary = ()=>{
    if(!diaryForm.value.Title){
        proxy.$message({type:'warning', message:'标题为空'});
        return ;
    }
    if(fileList.value.length > 0){
        diaryForm.value.Picture = fileList.value.map((obj:any)=>JSON.stringify(obj)).join(" ");
    }
    diaryForm.value.Moment = new Date();
    let data = {
        token: managerStore.token,
        value: diaryForm.value
    };
    createDiaryApi(data).then((res:any)=>{
        if(tackleCode(res.code, true)){
            //新建的日记信号传给父组件
            let data = diaryForm.value;
            data.ID = res.id;
            emits("diaryData", data);
            //清空内容
            diaryForm.value = {weatherID: 0};
            fileList.value = [];
            proxy.$message({type:'primary', message:'发布成功'});
        }
    });
}

//取消发布
const cancel = ()=>{
    //清空内容
    diaryForm.value = {weatherID: 0};
    fileList.value = [];
}

//图片提交
const handleSuccess =(e:{code:number; data:any})=>{
    if(tackleCode(e.code, true)){
        let photo = {
            id: e.data.id,
            URL: e.data.URL
        };
        fileList.value.push(photo);
        //console.log(e.data);
        //let content = fileList.value.map((obj:any)=>JSON.stringify(obj)).join(" ");
    }else{
        proxy.$message({type:'warning', message:'token验证未通过！'});
    }
}

//图片文件删除
const { deleteFile } = useFile();
const deletePhoto = (e:any)=>{
    //console.log(e);
    let dFile = fileList.value[e[0]];
    //后端删除
    deleteFile(dFile);
    //前端删除
    fileList.value.splice(e[0], 1);
}

onMounted(()=>{
    diaryForm.value.Content = '';
});
</script>

<style lang="less" scoped>
    .diary-editor{
        background: @bg-color-l;
        border-radius: @radius-m;
        width: 100%;
        &-form{
            padding: @space-xl;
        }
        &-top{
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        &-title{
            font-size: @size-xl;
            font-weight: bold;
            color: @font-color-l;
            padding-bottom: @space-m;
        }
        &-picture{
            padding-top: @space-xl;
        }
        .selected{
            &::before{
                position: absolute;
                bottom: -6px;
                left:9px;
                content: "";
                display: block;
                width: 6px;
                height: 6px;
                border-radius: 4px;
                background: @pcolor;
            }
        }
        input{
            border:none;
            background: transparent;
            outline:none;
            &::placeholder{
                color:@gray-4;
            }
        }
        &-foot{
            display: flex;
            justify-content: end;
            padding: @space-m;
            border-top: 1px solid @line-color-s;
        }
    }
</style>

<style lang="less">
    .diary-editor{
        .yk-text-area{
            background-color: transparent;
            border: none;
            border-radius: 0;
            padding: 0px;
        }
        .yk-text-area__inner{
            font-size: @size-m;
            line-height: 1.5;
            &::placeholder{
                color:@gray-5;
            }
        }
    }
</style>