<template>
    <div class="diary-item">
        <yk-space dir="vertical">
            <div class="diary-item-toptitle">
                <yk-space dir="vertical" :size="4">
                    <p class="diary-item-title">
                        <span v-html="title"></span>
                        <img :src="'/src/'+weathers[props.data.weatherID].icon">
                    </p>
                    <yk-text type="third">{{ momentl(props.data.Moment!) }}</yk-text>
                </yk-space>
                <yk-popconfirm trigger="click" placement="topRight" title="确定删除" content="删除将不可恢复" @confirm="confirmDeleting()" >
                    <IconDeleteOutline class="diary-item-delete"/>
                </yk-popconfirm>
            </div>
            <p v-html="content"></p>
            <div class="images">
                <yk-image-preview-group :src-list="images" width="80" height="80" fit="cover" />
            </div>
        </yk-space>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, watchEffect, nextTick } from "vue";
import type { DiaryData } from '../../utils/interface';
import { momentl } from "../../utils/moment";
import { weathers } from "../../utils/weather";
import { baseImgPath } from "../../utils/env";
import { highlightKeyword } from "../../utils/highlight";

type diaryItemProps = {
    data:DiaryData,
    searchTerm?: string
};
const props = withDefaults(defineProps<diaryItemProps>(),{

});

//图片处理
const images = computed(()=>{
    if(props.data.Picture){
        let arr = props.data.Picture.split(" ").map((obj:string)=>JSON.parse(obj));
        for(let i = 0; i < arr.length; i++){
            arr[i] = baseImgPath + '/' + arr[i].URL;
        }
        return arr;
    }
    return undefined;
})

const emits = defineEmits(["delete"]);

//删除
const confirmDeleting = ()=>{
    emits("delete", props.data.ID);
}

//高亮标题和内容
const content = ref<string>(props.data.Content!);
const title = ref<string>(props.data.Title!);
const highLight = (key?: string)=>{
    if(props.data.Content){
        content.value = highlightKeyword(props.data.Content, key);
    }
    if(props.data.Title){
        title.value = highlightKeyword(props.data.Title, key);
    }
}

//监听搜索词高亮。
// watch(
//     ()=>props.searchTerm,
//     (e)=>{
//         highLight(e);
//     }
// );
watchEffect(() => {
    nextTick();

    highLight(props.searchTerm);
});

</script>

<style lang="less" scoped>
    .diary-item{
        border-radius: @radius-m;
        padding: @space-xl;
        background: @bg-color-l;
        width: 100%;
        &-toptitle{
            display: flex;
            justify-content: space-between;
            width: 100%;
        }
        &-title{
            display: flex;
            align-items: center;
            font-size: 20px;
            font-weight: 600;
            span{
                font-weight: 600;
            }
            img{
                margin-left: @space-s;
            }
        }
        &-delete{
            width: 20px;
            height: 20px;
            padding: 2px;
            color: @font-color-s;
            transition: color @animatb;
            display: none;
            &:hover{
                color: @font-color-l;
            }
        }
        &:hover{
            .diary-item-delete{
                display: block;
            }
        }
    }   
</style>

<style lang="less">
    .images{
        .yk-space{
            gap: 8px;
        }
        .yk-image{
            border-radius: 8px;
        }
    }
    .diary-item{
        .highlight{
            font-weight: 600;
        }
    }
</style>