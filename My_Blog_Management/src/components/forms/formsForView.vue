<template>
    <div class="formV">
        <yk-space dir="vertical" size="xl">
            <!-- v-model 是 Vue.js 中的一个指令，用于在表单元素和数据模型之间创建双向数据绑定。它的要点如下：
            双向绑定：v-model 允许用户输入事件自动更新数据，适用于输入框、复选框、单选按钮和选择框等。 
            语法糖：v-model 是一种语法糖，简化了表单元素的绑定，使得在用户输入时能够自动更新数据。-->
            <input type="text" class="formV-title" placeholder="无标题..." v-model="formData.Title" readonly/>
            <yk-space align="center">
                <div class="subset">
                    <input type="text" placeholder="未分类" disabled v-model="subsetName" style="width: 110px; line-height: 28px;"/>
                </div>
                <yk-space align="center" size="s">
                    <yk-tag v-for="(tag,index) in formData.Label" :key="index" shape="round" >
                        {{ tag }}
                    </yk-tag>
                </yk-space> 
            </yk-space>
            <div :class="{introduce: props.Classify == 0}" style="width: 100%;">
                <yk-text-area v-model="formData.Introduce" :max-length="800" placeholder="无简介..." :auto-size="raws" readonly/>
            </div>
        </yk-space>
        <div class="formV-cover" v-if="props.Classify == 0">
            <yk-upload :uploadUrl="uploadUrl" :file-list="fileUrl" :limit="1" accept="images/*" desc="无封面" style="pointer-events:none;" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import {ref, onMounted, computed, watch} from "vue";
import { useSubsetStore } from "../../store/subset";
import { useManagerStore } from "../../store/managers";
import { useSubset } from "../../hooks/subset";
import { useLabel } from "../../hooks/label";
import { baseUrl, baseImgPath } from "../../utils/env";
import type { formDataType } from "../../utils/interface";

const managerStore = useManagerStore();

// const props = defineProps({
//     classify:{
//         default:0,
//         type:Number
//     }
// })

const subsetStore = useSubsetStore();

type FormData = {
    Classify: number,
    form?: formDataType
}

const props = withDefaults(defineProps<FormData>(),{
    Classify: 0
});

const {rawSubset} = useSubset({});
const { rawlabel, label } = useLabel();

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

//封面
const uploadUrl = ref<string>();
//游客模式下不可上传文件
if(managerStore.token != ''){
    uploadUrl.value = `${baseUrl}/upload`;
}else{
    uploadUrl.value = '';
}
const fileUrl = ref<{id?:number;name:string;url:string}[]>([]);

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
    .formV{
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
    //不在scoped内的该css样式操作的是该项目中所有名为formV的组件。
    .formV{
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
        .yk-upload__picture-button{
            pointer-events: none;   
        }
        .yk-text-area textarea {
            pointer-events: none;
        }
    }
</style>