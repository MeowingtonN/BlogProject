<template>
    <yk-space dir="vertical" style="width: 100%;" size="l">
        <TopTitle name="博客文章" :is-search="true" style="margin-bottom: 8px;" @search="search"/>
        <subset-vue :classify="0" :isDelete="isDelete" :isChangeState="isChangeState" @nowSubset="nowSelect" v-show="!query"/>
        <yk-space style="width:100%;">
            <ArticleView style="width: 100%;" :state="nowState" :subsetID="nowSubset" :search-term="searchTerm"
                @deleteArticle="handleDeleteArticle" @updateState="handleChangeState"/>
            <!-- 标签展示处 -->
            <label-view />
        </yk-space>
    </yk-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import TopTitle from '../components/TopTitle.vue';
import subsetVue from '../components/subset/subset.vue';
import labelView from '../components/label/label.vue';
import ArticleView from "../components/article/article.vue";

const nowState = ref<number | string>(-1);
const nowSubset = ref<number | string>(-1);

const nowSelect = (e: { id: number | string, type: string }) => {
    //console.log(e);
    if (e.type == "state") {
        nowState.value = e.id;
        nowSubset.value = -1;
    } else if (e.type == "all") {
        nowState.value = -1;
        nowSubset.value = -1;
    } else if (e.type == "subset" || e.type == "exclude") {
        nowState.value = -1;
        nowSubset.value = e.id;
    }
}

const isDelete = ref<boolean>(false);
const isChangeState = ref<boolean>(false);
const handleDeleteArticle = () => {
    isDelete.value = !isDelete.value;
}
const handleChangeState = () => {
    isChangeState.value = !isChangeState.value;
}

//搜索
const searchTerm = ref<string>();
const query = ref<boolean>(false);
const search = (e:string)=>{
    searchTerm.value = e;
    if(e){
        query.value = true;
    }else{
        query.value = false;
    }
}

</script>

<style lang="less" scoped></style>