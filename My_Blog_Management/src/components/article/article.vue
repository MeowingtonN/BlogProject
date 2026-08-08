<template>
    <yk-space dir="vertical" style="width: 100%;" size="xl">
        <articleItemVue v-for="item in articleList" :data="item" :key="item.ID" @delete="deleteArticleHere" @state="updateStateHere" 
                        :searchTerm="props.searchTerm" :author-name="articleAuthorList.find(a => a.id === item.ID)?.name"/>
        <div class="pagination" v-show="count/props.pageSize>1">
            <yk-pagination :total="count" :page-size="props.pageSize" size="m" @change="changePage" :default-page-size="props.pageSize" :current="currentPage"/>
        </div>
        <div class="Empty" v-show="count == 0">
            <yk-empty description="空空如也..." type="secondary" />
        </div>
    </yk-space>
</template>

<script lang="ts" setup>
import { onMounted, watch, ref } from "vue";
import articleItemVue from "./article-item.vue";
import { useArticle } from "../../hooks/article";
import { useManagerStore } from "../../store/managers";

const managerStore = useManagerStore();

const currentPage = ref<number>(1);

const emits = defineEmits(['deleteArticle', 'updateState']);

const { updateState, getData, deleteArticle, articleList, articleAuthorList, count } = useArticle();

const props = defineProps({
    pageSize:{
        type:Number,
        default:3,
    },
    subsetID:{
        default:-1,
        type:[Number, String],
    },
    state:{
        default:-1,
        type:[Number, String],
    },
    searchTerm:{
        type:String,
        default:"",
    }
});

const request = {
    token: managerStore.token,
    managerID: managerStore.id,
    pageSize:props.pageSize,
    nowPage:1,
    state:props.state,
    subsetID:props.subsetID,
    searchTerm:props.searchTerm,
    classify: 0,
    count:true,
}

//翻页
const changePage = (e:number)=>{
    request.nowPage = e;
    getData(request);
}

//点击删除文章按钮后的handle函数。
const deleteArticleHere = async (id:number)=>{
    //使deleteArticle函数返回Promise，在此处使用await，由此强制两个操作线性执行。
    await deleteArticle(id);
    getData(request);
    emits('deleteArticle');
}

//点击发布/撤回文章按钮后的handle函数。
const updateStateHere = async (e: { id: number, state: number })=>{
    //使updateState函数返回Promise，在此处使用await，由此强制两个操作线性执行。
    await updateState(e);
    emits('updateState');
}

//监听props的变化
watch(
    props,
    ()=>{
        //查询数据
        request.nowPage = 1;
        currentPage.value = 1;
        request.state = props.state;
        request.subsetID = props.subsetID;
        request.searchTerm = props.searchTerm;
        request.managerID = managerStore.id;
        getData(request);
    },
    {
        deep: true
    }
);

onMounted(()=>{
    getData(request);
});

</script>

<style lang="less" scoped>
    .pagination{
        padding: @space-s 0 @space-xl;
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
</style>