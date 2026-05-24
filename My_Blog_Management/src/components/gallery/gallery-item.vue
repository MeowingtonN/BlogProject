<template>
    <div class="gallery-item">
        <yk-space size="s" dir="vertical">
            <div class="gallery-item-image">
                <div class="gallery-item-cover">
                    <yk-image :src="cover" width="238" height="160" :is-lazy="true" :preview="false" fit="cover"/>
                </div>
                <yk-space :size="2" @click="browseArticle" style="cursor: pointer;">
                    <div class="gallery-item-image-left image-div">
                        <yk-image :src="baseImgPath + '/' + content[0].URL" width="78" height="78" :is-lazy="true" :preview="false" fit="cover" v-if="content[0]" />
                    </div>
                    <div class="gallery-item-image-center image-div">
                        <yk-image :src="baseImgPath + '/' + content[1].URL" width="78" height="78" :is-lazy="true" :preview="false" fit="cover" v-if="content[1]"/>
                    </div>
                    <div class="gallery-item-image-right image-div">
                        <yk-image :src="baseImgPath + '/' + content[2].URL" width="78" height="78" :is-lazy="true" :preview="false" fit="cover" v-if="content[2]"/>
                    </div>
                </yk-space>
                <yk-space class="gallery-item-control" :size="4">
                    <IconFillOutline @click="updateArticle"/>
                    <yk-popconfirm trigger="click" placement="topRight" title="确定删除" content="删除将不可恢复" @confirm="confirmDeleting()" >
                        <IconDeleteOutline />
                    </yk-popconfirm>
                </yk-space>
            </div>
            <div style="width: 100%; cursor: pointer;" @click="browseArticle">
                <p class="gallery-item-title" v-html="title"></p>
                <div class="gallery-item-datas">
                    <yk-space size="xl">
                        <yk-space>
                            <yk-text type="third">
                                查看
                                {{ props.data.Views }}
                            </yk-text>
                            <yk-text type="third">
                                喜欢
                                {{ props.data.praise }}
                            </yk-text>
                        </yk-space>
                    </yk-space>
                    <yk-text type="third">{{ momentm(props.data.Moment) }}</yk-text>
                </div>
            </div>
        </yk-space>
    </div>
</template>

<script lang="ts" setup>
import {computed, ref, watchEffect, nextTick} from "vue";
import type { ArticleData } from '../../utils/interface';
import { baseImgPath } from "../../utils/env";
import { momentm } from "../../utils/moment";
import { useRouter } from "vue-router";
import { highlightKeyword } from "../../utils/highlight";

type galleryItemProps = {
    data:ArticleData;
    searchTerm?:string
};
const props = withDefaults(defineProps<galleryItemProps>(),{

});

const router = useRouter();
const emits = defineEmits(["delete","state"]);

//封面地址
const cover = computed(()=>{
    return baseImgPath + '/' + props.data.coverURL;
});

//将Content从字符串变为图片URL数组
const content = computed(()=>{
    if(props.data.Content){
        let res = props.data.Content.split(" ");
        return res.map((obj:string)=>JSON.parse(obj));
    }else{
        return "";
    }
});

//删除
const confirmDeleting = ()=>{
    emits("delete", props.data.ID);
}

//修改图库
const updateArticle = ()=>{
    router.push({
        path: "editGallery",
        query:{
            id: props.data.ID
        }
    });
}
//浏览文章
const browseArticle = ()=>{
    router.push({
        path: "viewGallery",
        query: {
            id: props.data.ID
        }
    });
}

//高亮标题和简介
const title = ref<string>();

watchEffect(() => {
    nextTick(); // 等待 Vue 完成所有响应式更新

    title.value = highlightKeyword(props.data.Title, props.searchTerm);
});

</script>

<style lang="less" scoped>
    .gallery-item{
        border-radius: @radius-m;
        background: @bg-color-l;
        width:238px;
        &-cover{
            position: relative;
            border-radius: @radius-m @radius-m 0 0;
            overflow: hidden;
            flex:none;
            padding-bottom: 2px;
        }
        &-image-left{
            border-radius: 0 0 0 @radius-m;
            overflow: hidden;
        }
        &-image-right{
            border-radius: 0 0 @radius-m 0;
            overflow: hidden;
        }
        .image-div{
            width: 78px;
            height: 78px;
            background: @gray-2;
        }
        &-unpublish{
            position: absolute;
            bottom: 0;
            width: 100%;
            text-align: center;
            background: rgba(43,90,237,0.8);
            line-height: 36px;
            color: @white;
            font-weight: 600;
        }
        &-title{
            .font-l();
            padding-top: @space-m;
            font-weight: 600;
            overflow: hidden;
            display: -webkit-box;
            line-clamp:1;
            -webkit-line-clamp:1;
            -webkit-box-orient:vertical;
            text-overflow: ellipsis;
        }
        &-introduce{
            .font-m();
            height: 48px;
            overflow: hidden;
            display: -webkit-box;
            line-clamp: 2;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
            color: @font-color-l;
            margin-bottom: @space-m;
            max-width: 720px;
        }
        &-datas{
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        &-control{
            position: absolute;
            right:@space-l;
            top:@space-l;
            background-color: rgba(255,255,255,0.56);
            border-radius: @radius-m;
            padding: @space-ss;
            opacity: 0;
            .yk-icon{
                width: 24px;
                height: 24px;
                padding: 5px;
                color: @gray;
                cursor: pointer;
                &:hover{
                    color: @pcolor;
                }
            }

            &:hover{
                background-color: rgba(255,255,255,0.64);
                backdrop-filter: blur(2px);
            }
        }
        &:hover{
            .gallery-item-control{
                opacity: 1;
            }
        }
    }   
</style>
<style lang="less">
    .gallery-item{
        .yk-image__img{
            border-radius: 0;
        }
    }
</style>