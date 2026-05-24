<template>
    <div class="article-item">
        <yk-space size="xl">
            <div class="article-item-cover">
                <yk-image :src="cover" width="160" height="120" :is-lazy="true" :preview="false" fit="cover"/>
                <p class="article-item-unpublish" v-if="props.data.State === 0">未发布</p>
            </div>
            <div style="width: 100%; cursor: pointer;" @click="browseArticle">
                <p class="article-item-title" v-html="title"></p>
                <p class="article-item-introduce" v-html="introduce"></p>
                <div class="article-item-datas">
                    <yk-space size="xl">
                        <yk-text type="secondary">
                            {{ subsetStore.subsetName(props.data.subsetID) }}
                            <yk-text type="secondary" v-if="props.data.Label!.length > 0">
                                /<span v-for="item in props.data.Label?.split(',')" style="padding-right: 4px;">{{ item }}</span>
                            </yk-text>
                        </yk-text>
                        <yk-text type="third">{{ momentm(props.data.Moment) }}</yk-text>
                        <yk-space>
                            <yk-text type="third">
                                <IconEyeOutline />
                                {{ props.data.Views }}
                            </yk-text>
                            <yk-text type="third">
                                <IconLikeOutline />
                                {{ props.data.praise }}
                            </yk-text>
                            <yk-text type="third">
                                <IconCommentOutline />
                                {{ props.data.comment }}
                            </yk-text>
                        </yk-space>
                    </yk-space>
                    <yk-space class="article-item-control" size="xl">
                        <yk-tooltip placement="top" title="发布" v-if="props.data.State === 0">
                            <IconSendOutline @click="updateState(1)"/>
                        </yk-tooltip>
                        <yk-tooltip placement="top" title="撤回" v-if="props.data.State === 1">
                            <IconRevokeOutline @click="updateState(0)"/>
                        </yk-tooltip>
                        <yk-tooltip placement="top" title="编辑">
                            <IconFillOutline @click="updateArticle"/>
                        </yk-tooltip>
                        <yk-popconfirm trigger="click" placement="topRight" title="确定删除" content="删除将不可恢复" @confirm="confirmDeleting()" >
                            <IconDeleteOutline />
                        </yk-popconfirm>
                    </yk-space>
                </div>
            </div>
        </yk-space>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect, nextTick } from "vue";
import type { ArticleData } from '../../utils/interface';
import { useSubsetStore } from "../../store/subset";
import { momentm } from "../../utils/moment";
import { IconEyeOutline } from "@yike-design/ui/es/components/svg-icon";
import { baseImgPath } from "../../utils/env";
import { useRouter } from "vue-router";
import { highlightKeyword } from "../../utils/highlight";

const router = useRouter();

//store
const subsetStore = useSubsetStore();

type ArticleItemProps = {
    data:ArticleData;
    searchTerm?:string;
};

const props = withDefaults(defineProps<ArticleItemProps>(),{

});

const emits = defineEmits(["delete","state"]);

//封面地址
const cover = computed(()=>{
    return baseImgPath + '/' + props.data.coverURL;
});

//删除
const confirmDeleting = ()=>{
    emits("delete", props.data.ID);
}

//修改状态
const updateState = (e:number)=>{
    emits("state", {id:props.data.ID, state:e});
}

//修改文章
const updateArticle = ()=>{
    router.push({
        path: "editArticle",
        query: {
            id: props.data.ID
        }
    });
}

//浏览文章
const browseArticle = ()=>{
    router.push({
        path: "viewArticle",
        query: {
            id: props.data.ID
        }
    });
}

//高亮标题和简介
const introduce = ref<string>();
const title = ref<string>();
// const highLight = (keyword?:string)=>{
//     if(props.data.Introduce){
//         introduce.value = highlightKeyword(props.data.Introduce, keyword);
//         console.log(props.data.Introduce);
//     }
//     title.value = highlightKeyword(props.data.Title, keyword);
// }

watchEffect(() => {
    nextTick(); // 等待 Vue 完成所有响应式更新

    if (props.data.Introduce) {
        introduce.value = highlightKeyword(props.data.Introduce, props.searchTerm);
        //console.log(introduce.value);
    }
    title.value = highlightKeyword(props.data.Title, props.searchTerm);
    //console.log(title.value);
});

// onMounted(
//     ()=>{
//         introduce.value = props.data.Introduce;
//         title.value = props.data.Title;
//     }
// );

</script>

<style lang="less" scoped>
    .article-item{
        border-radius: @radius-m;
        background: @bg-color-l;
        padding: @space-xl;
        width:100%;
        &-cover{
            position: relative;
            border-radius: @radius-m;
            overflow: hidden;
            width: 160px;
            flex:none;
        }
        &-unpublish{
            position: absolute;
            bottom: 0;
            width: 100%;
            text-align: center;
            background: rgba(185, 43, 237, 0.8);
            line-height: 36px;
            color: @white;
            font-weight: 600;
        }
        &-title{
            font-size: 20px;
            font-weight: 600;
            padding-bottom: @space-s;
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
            .yk-icon{
                width: 20px;
                height: 20px;
                color: @font-color-s;
                cursor: pointer;
                &:hover{
                    color:@pcolor;
                }
            }
        }
    }   
</style>