<template>
    <div class="edit-photo">
        <yk-upload :upload-url="uploadUrl" :draggable="true" @handle-success="handleSuccess"></yk-upload>
        <div class="waterfall">
            <!-- v-for用于渲染item列表 -->
            <div class="waterfall-item" v-for="item in fileList">
                <img :src="baseImgPath+'/'+item.URL" />
                <icon-star-fill class="waterfall-item-cover" v-show="item.id === coverIndex"/>
                <yk-space size="ss">
                    <p class="waterfall-item-tool" v-show="item.id != coverIndex" @click="changeCover(item)">
                        设为封面
                    </p>
                    <icon-delete-outline class="waterfall-item-delete" @click="deletePhoto(item)"/>
                </yk-space>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {ref, onMounted, watch, getCurrentInstance} from "vue";
import { baseUrl, baseImgPath } from "../../utils/env";
import { useCode } from "../../hooks/code";
import { useFile } from "../../hooks/files";
import { useManagerStore } from "../../store/managers";
import { updateFileManagerIDApi } from "../../api";

const {tackleCode} = useCode();
const managerStore = useManagerStore();

const props = defineProps(['content', 'cover']);
const proxy:any = getCurrentInstance()?.proxy;
const emits = defineEmits(['cover', 'editors']);

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

//封面
const coverIndex = ref<number>(-1);
//主动切换封面
const changeCover = (e:{id:number; URL:string})=>{
    coverIndex.value = e.id;
    emits('cover', e.URL);
}

//图片提交
const handleSuccess =(e:{code:number; data:any})=>{
    if(tackleCode(e.code, true)){
        let photo = {
            id: e.data.id,
            URL: e.data.URL
        };
        fileList.value.push(photo);
        emits('editors', fileList.value.map((obj:any)=>JSON.stringify(obj)).join(" "));
        if(coverIndex.value == -1){
            coverIndex.value = e.data.id;
            emits('cover', e.data.URL);
        }
        let request = {
            token: managerStore.token,
            fileID: e.data.id,
            managerID: managerStore.id
        };
        updateFileManagerIDApi(request).then((res:any)=>{
            // if(tackleCode(res.code, true)){
            //     proxy.$message({type:'primary', message:'文件上传成功'});
            // }
        });
    }else{
        proxy.$message({type:'warning', message:'token验证未通过！'});
    }
}

//删除
const { deleteFile } = useFile();
const deletePhoto = (e:{id:number; URL:string})=>{
    //前端静态删除
    fileList.value = fileList.value.filter((obj:any)=>{
        return obj.id !== e.id;
    });
    emits('editors', fileList.value.map((obj:any)=>JSON.stringify(obj)).join(" "));
    if(e.id == coverIndex.value && fileList.value.length > 0){
        coverIndex.value = fileList.value[0].id;
        emits('cover', fileList.value[0].URL);
    }else if(e.id == coverIndex.value && fileList.value.length <= 0){
        coverIndex.value = -1;
        emits('cover', '');
    }
    //后端数据库删除
    deleteFile(e);
}

watch(
    ()=>props.content,
    (e)=>{
        //将后端字符串转成数组
        let res = e.split(" ");
        fileList.value = res.map((obj:string)=>JSON.parse(obj));
        //回显封面选中
        if(props.cover){
            for(let i = 0; i < fileList.value.length; i++){
                if(props.cover == fileList.value[i].URL){
                    coverIndex.value = fileList.value[i].id;
                }
            }
        }
    }
);

onMounted(()=>{
    // getPhotos();
})

</script>

<style lang="less" scoped>
    .edit-photo{
        background: @bg-color-l;
        border-radius: @radius-m;
        padding: @space-xl;
        width: 100%;
        min-height: 637px;
    }
    .waterfall{
        width: 100%;
        column-count: 3;
        column-gap: @space-xl;
        padding-top: 32px;
        &-item{
            margin-bottom: @space-xl;
            border-radius: @radius-m;
            overflow: hidden;
            line-height: 0%;
            img{
                width: 100%;
            }
            .yk-space{
                position: absolute;
                top:@space-l;
                right:@space-l;
            }
            &-cover{
                position: absolute;
                left: @space-l;
                top:@space-l;
                width: 24px;
                height: 24px;
                color:@wcolor;
            }
            &-tool{
                line-height: 32px;
                padding: 0 @space-m;
                border-radius: @radius-m;
                background: rgba(255,255,255,0.56);
                color:@pcolor;
                cursor: pointer;
                transition: all @animatb;
                opacity: 0;
                &:hover{
                    background: rgba(255,255,255,0.8);
                    backdrop-filter: blur(2px);
                }
            }
            &-delete{
                width: 32px;
                height: 32px;
                padding: 9px;
                border-radius: @radius-m;
                background: rgba(255,255,255,0.56);
                color:@gray;
                cursor: pointer;
                transition: all @animatb;
                opacity: 0;
                &:hover{
                    color:@ecolor;
                    background: rgba(255,255,255,0.8);
                    backdrop-filter: blur(2px);
                }
            }
            &:hover{
                .waterfall-item-tool{
                    opacity: 1;
                }
                .waterfall-item-delete{
                    opacity: 1;
                }
            }
        }
    }
</style>
<style lang="less">
    .edit-photo{
        .yk-upload__file-list{
            display: none;
        }
    }
</style>