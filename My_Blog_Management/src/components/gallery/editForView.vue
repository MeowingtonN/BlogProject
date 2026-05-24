<template>
    <div class="edit-photo">
        <div class="waterfall">
            <!-- v-for用于渲染item列表 -->
            <div class="waterfall-item" v-for="item in fileList">
                <img :src="baseImgPath+'/'+item.URL" />
                <icon-star-fill class="waterfall-item-cover" v-show="item.id === coverIndex"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {ref, onMounted, watch} from "vue";
import { baseImgPath } from "../../utils/env";

const props = defineProps(['content', 'cover']);
const emits = defineEmits(['cover', 'editors']);

//存储后端返回
const fileList = ref<{id:number;URL:string}[]>([]);

//封面
const coverIndex = ref<number>(-1);

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