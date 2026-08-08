<template>
    <yk-space dir="vertical" style="width: 100%;" size="l">
        <TopTitle name="随笔碎记" :is-search="true" style="margin-bottom: 8px;" @search="search"/>
        <yk-space style="width: 100%;" size="l">
            <diaryVue :new-diary="newDiary" :search-term="searchTerm" :page-size="3"/>
            <diaryEditor style="flex:none; width: 600px;" @diary-data="diaryData"/>
        </yk-space>
    </yk-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import diaryVue from '../components/diary/diary.vue';
import diaryEditor from '../components/diary/diary-editor.vue';
import type { DiaryData } from '../utils/interface';

//搜索日记
const searchTerm = ref<string>();
const search = (e:string)=>{
    //searchTerm.value = " ";
    searchTerm.value = e;
}

//接收新建的日记
const newDiary = ref<DiaryData>();
const diaryData = (e:DiaryData)=>{
    newDiary.value = e;
}

</script>

<style lang="less" scoped>

</style>