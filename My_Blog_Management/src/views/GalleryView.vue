<template>
    <yk-space dir="vertical" style="width: 100%;" size="l">
        <TopTitle name="摄影图库" :is-search="true" style="margin-bottom: 8px;" @search="search"/>
        <subset-vue :classify="1" :isDelete="isDelete" @nowSubset="nowSelect" v-show="!query"/>
        <galleryVue :subsetID="nowSubset" @deleteArticle="handleDeleteArticle" :search-term="searchTerm"/>
    </yk-space>
</template>

<script lang="ts" setup>
import TopTitle from '../components/TopTitle.vue';
import subsetVue from '../components/subset/subset.vue';
import galleryVue from '../components/gallery/gallery.vue';
import { ref } from 'vue';

const nowSubset = ref<number | string>(-1);

const nowSelect = (e: { id: number | string, type: string }) => {
    if (e.type == "all") {
        nowSubset.value = -1;
    } else if (e.type == "subset" || e.type == "exclude") {
        nowSubset.value = e.id;
    }
}

const isDelete = ref<boolean>(false);
const handleDeleteArticle = ()=>{
    isDelete.value = !isDelete.value;
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

<style lang="less" scoped>
</style>