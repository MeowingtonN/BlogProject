<template>
    <div class="gallery">
        <div class="gallery-content">
            <div class="gallery-content-files">
                <galleryItemVue v-for="item in articleList" :data="item" :key="item.ID" @delete="deleteArticleHere" :searchTerm="props.searchTerm"/>
            </div>
        </div>
        <div class="pagination" v-show="count/props.pageSize>1">
            <yk-pagination :total="count" size="m" @change="changePage" :default-page-size="props.pageSize" />
        </div>
        <div class="Empty" v-show="count == 0">
            <yk-empty description="空空如也..." type="secondary" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, watch } from "vue";
import galleryItemVue from "./gallery-item.vue";
import { useArticle } from "../../hooks/article";
import { useManagerStore } from "../../store/managers";

const managerStore = useManagerStore();

const emits = defineEmits(['deleteArticle', 'updateState']);

const { getData, deleteArticle, articleList, count } = useArticle();

const props = defineProps({
    pageSize:{
        type:Number,
        default:3,
    },
    subsetID:{
        default:-1,
        type:[Number, String],
    },
    searchTerm:{
        type:String,
        default:"",
    }
})

const request = {
    token: managerStore.token,
    managerID: managerStore.id,
    pageSize:props.pageSize,
    nowPage:1,
    subsetID:props.subsetID,
    searchTerm:props.searchTerm,
    classify: 1,
    count:true,
}

//翻页
const changePage = (e:number)=>{
    request.nowPage = e;
    getData(request);
}

//点击删除按钮后的handle函数。
const deleteArticleHere = async (id:number)=>{
    //使deleteArticle函数返回Promise，在此处使用await，由此强制两个异步操作线性执行。
    await deleteArticle(id);
    getData(request);
    emits('deleteArticle');
}

watch(
    props,
    ()=>{
        //查询数据
        request.nowPage = 1;
        request.subsetID = props.subsetID;
        request.searchTerm = props.searchTerm;
        request.managerID = managerStore.id;
        getData(request);
    }
);

onMounted(()=>{
    getData(request);
});

</script>

<style lang="less" scoped>
    .gallery{
        width: 100%;
        background: @bg-color-l;
        padding: 32px 24px 24px;
        border-radius: @radius-m;
        &-content{
            display: inline;
            &-files{
                display: grid;
                grid-template-columns: repeat(auto-fill,238px);
                row-gap: 32px;
                column-gap: 24px;
                justify-content: center;
            }
        }
        .pagination{
            padding: @space-s 0;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            width: 100%;
        }
        .Empty{
            width: 100%;
            height: 400px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
</style>