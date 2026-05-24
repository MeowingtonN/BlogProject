<template>
    <div class="form">
        <yk-space dir="vertical" size="xl">
            <!-- v-model 是 Vue.js 中的一个指令，用于在表单元素和数据模型之间创建双向数据绑定。它的要点如下：
            双向绑定：v-model 允许用户输入事件自动更新数据，适用于输入框、复选框、单选按钮和选择框等。 
            语法糖：v-model 是一种语法糖，简化了表单元素的绑定，使得在用户输入时能够自动更新数据。-->
            <input type="text" class="form-title" placeholder="请输入标题" v-model="formData.Title"/>
            <yk-space align="center">
                <div class="subset">
                    <input type="text" placeholder="选择分类" disabled v-model="subsetName" style="width: 110px; line-height: 28px;"/>
                    <IconDownOutline />
                    <yk-dropdown @selected="subsetSelect">
                        <yk-dropdown-item v-for="item in subsetList" :value="item.id">
                            {{ item.subsetName }}
                        </yk-dropdown-item>
                    </yk-dropdown>
                </div>
                <yk-space align="center" size="s">
                    <yk-tag v-for="(tag,index) in formData.Label" :key="index" closeable shape="round" @close="deleteLabel(tag)">
                        {{ tag }}
                    </yk-tag>
                    <yk-text type="third" @click="showLabel" style="cursor: pointer; white-space: nowrap;" v-show="formData.Label!.length<3">
                        插入标签
                    </yk-text>
                </yk-space> 
            </yk-space>
            <div :class="{introduce: props.Classify == 0}" style="width: 100%;">
                <yk-text-area v-model="formData.Introduce" :max-length="800" placeholder="请输入简介..." :auto-size="raws" />
            </div>
        </yk-space>
        <div class="form-cover" v-if="props.Classify == 0">
            <yk-upload :uploadUrl="uploadUrl" :file-list="fileUrl" :limit="1" accept="images/*" desc="封面800x600" @handleSuccess="handleSuccess" @handleDelete="deletePhoto"></yk-upload>
        </div>
        <yk-modal v-model="visible" title="标签" size="s" :show-footer="false">
            <yk-space dir="vertical" size="l">
                <yk-input v-model="inputValue" placeholder="请输入标签后回车" style="width: 280px;" @submit="addLabel"/>
                <yk-space size="s">
                    <yk-tag v-for="(tag,index) in formData.Label" :key="index" closeable shape="round" @close="deleteLabel(tag)">
                        {{ tag }}
                    </yk-tag>
                </yk-space>
                <yk-space wrap size="s" style="padding-top: 8px;">
                    <yk-tag v-for="(tag,index) in labelArr" :key="index" shape="round" style="cursor: pointer;" @click="selectLabel(tag)">
                        {{ tag }}
                    </yk-tag>
                </yk-space>
            </yk-space>
        </yk-modal>
    </div>
</template>

<script lang="ts" setup>
import {ref, onMounted, computed, watch, getCurrentInstance} from "vue";
import { useSubsetStore } from "../../store/subset";
import { useManagerStore } from "../../store/managers";
import { useSubset } from "../../hooks/subset";
import { useLabel } from "../../hooks/label";
import { baseUrl, baseImgPath } from "../../utils/env";
import { useCode } from "../../hooks/code";
import { useFile } from "../../hooks/files";
import type { formDataType } from "../../utils/interface";

const managerStore = useManagerStore();
const {tackleCode} =useCode();

// const props = defineProps({
//     classify:{
//         default:0,
//         type:Number
//     }
// })

const proxy:any = getCurrentInstance()?.proxy;
const subsetStore = useSubsetStore();

type FormData = {
    Classify: number,
    form?: formDataType
}

const props = withDefaults(defineProps<FormData>(),{
    Classify: 0
});

const {rawSubset} = useSubset({});
const {confirm, rawlabel, label, inputValue} = useLabel();

const emits = defineEmits(['formData']);

const formData = ref<formDataType>({
    Title: "",
    subsetID:-100,//表单中subsetID初始化为-100，表示未选择分组
    Classify: props.Classify,
    Label:[], //标签
    Introduce:"", //简介
    coverURL:"",
});

//简介行数
const raws = computed(()=>{
    if(props.Classify == 1){
        return {
            minRows:24,
            maxRows:30
        }
    }else{
        return{
            minRows: 4,
            maxRows: 10
        }
    }
})

//分类名称
const subsetName = ref();
//选择分类
const subsetSelect = (e:number)=>{
    formData.value.subsetID = e;
    nowSubset(e);
}

//填入当前选择的分组
const nowSubset = (e:number)=>{
    for(let i = 0; i < subsetList.value.length; i++){
        if(subsetList.value[i].id == e){
            subsetName.value = subsetList.value[i].subsetName;
        }
    }
}

//获取分类
const subsetList = ref();

//所有标签
const labelArr = ref<any[]>([]);

//标签弹窗
const visible = ref<boolean>(false);
const showLabel = ()=>{
    visible.value = true;
}
//前端表单增加标签
const addLabel = ()=>{
    if(inputValue.value && formData.value.Label!.length < 3){
        confirm();
        formData.value.Label!.push(inputValue.value);
    }
}
//前端表单选择标签
const selectLabel = (e:string)=>{
    if (!formData.value.Label || !Array.isArray(formData.value.Label)) {
        //console.error('Label is not an array:', formData.value.Label);
        formData.value.Label = []; // 重新初始化为数组
    }
    if(formData.value.Label!.length < 3){
        formData.value.Label.push(e);
        labelArr.value = labelArr.value.filter((obj:number|string)=>{
            return obj != e;
        });
    }
}
//前端表单删除标签
const deleteLabel = (e:number|string)=>{
    labelArr.value.unshift(e);
    formData.value.Label = formData.value.Label!.filter((obj:number|string)=>{
        return obj != e;
    })
}

//封面
const uploadUrl = ref<string>();
//游客模式下不可上传文件
if(managerStore.token != ''){
    uploadUrl.value = `${baseUrl}/upload`;
}else{
    uploadUrl.value = '';
}
const fileUrl = ref<{id?:number;name:string;url:string}[]>([]);

//图片提交成功
const handleSuccess = (res:any)=>{
    if(tackleCode(res.code, true)){
        let photoUrl = {id: res.data.id, name: res.data.fileName, url: baseImgPath+'/'+res.data.URL};
        fileUrl.value.push(photoUrl);
        formData.value.coverURL = res.data.URL;
    }else{
        proxy.$message({type:'warning', message:'token验证未通过！'});
    }
}

//图片文件删除
const { deleteFile } = useFile();
const deletePhoto = (e:any)=>{
    const parts = fileUrl.value[e[0]].url.split('/');
    const filename = parts[parts.length - 1];
    let dFile = {
        id: fileUrl.value[e[0]].id!,
        URL: filename
    };
    //console.log(dFile);
    //后端删除
    deleteFile(dFile);
}

watch(
    formData, 
    (e)=>{
        emits('formData', e);
    }, 
    {deep: true}
);
watch(
    ()=>subsetStore.data,
    (e)=>{
        subsetList.value = e;
        if(formData.value.subsetID){
            nowSubset(formData.value.subsetID);
        }
    },
    {immediate:true}
);

const num = ref<number>(0);
watch(
    ()=>label.value,
    (e:any)=>{
        for(let i = num.value; i < e.length; i++){
            labelArr.value.push(e[i].labelName);
        }
        num.value = e.length + 1;
    }
);

watch(
    ()=>props.form,
    (e)=>{
        formData.value = e!;
        if(formData.value.coverURL){
            let photoUrl = {name: '', url: baseImgPath+'/'+formData.value.coverURL};
            fileUrl.value = [photoUrl];
        }
        if(formData.value.subsetID && subsetList.value){
            nowSubset(formData.value.subsetID);
        }
    }
);

onMounted(()=>{
    rawSubset(props.Classify);
    rawlabel();
})

</script>

<style lang="less" scoped>
    .form{
        position: relative;
        input{
            border: none;
            background: transparent;
            outline: none;
            &::placeholder{
                color:@gray-4;
            }
        }
        &-title{
            font-size:@size-xl;
            font-weight: 600;
            color: @font-color-l;
        }
        .yk-dropdown{
            position: absolute;
            top: 0;
        }

        .yk-text-area{
            border: 0px solid transparent;
            border-radius: 0;
            background-color: transparent;
            padding: 0;
        }

        .introduce{
            border-bottom: 1px solid @gray-2;
        }

        &-cover{
            position: absolute;
            right: 0;
            top:0;
        }
    }
</style>
<style lang="less">
    .form{
        .yk-dropdown__title{
            width: 120px;
            height: 24px;
        }
        .yk-upload__picture-button{
            width: 160px;
            height: 120px;
        }
        .yk-upload-picture{
            width: 160px;
            height: 120px;
        }
        .yk-upload__picture{
            width: 160px;
            height: 120px;
        }
    }
</style>