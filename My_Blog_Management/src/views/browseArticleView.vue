<template>
    <div class="edit-gallery">
        <div class="edit-gallery-topbar">
            <p class="edit-gallery-topbar-title">浏览博客文章</p>
        </div>
        <editor style="width: 1200px;" @editors="editorData" :Content="defaultArticle?.content">
            <!-- 将formsVue中发出的formData信号在本文件中处理，可达到集中处理相似信号的目的。 -->
            <formsVue style="width: 820px; padding-top: 15px;" :Classify="0" :form="defaultArticle?.filterResData" @formData="formData" />
        </editor>
    </div>
</template>

<script lang="ts" setup>
import editor from '../components/editor/editorForView.vue';
import formsVue from '../components/forms/formsForView.vue';
import { useArticle } from "../hooks/article";
import { useRoute } from 'vue-router';

const route = useRoute();

const { _id, formData, editorData, defaultArticle } = useArticle();

if(route.query.id){
    _id.value = Number(route.query.id);
    //console.log(_id.value);
}

</script>

<style lang="less" scoped>
    .edit-gallery{
        padding: @space-xl 80px;
        display: flex;
        flex-direction: column;
        align-items: center;
        &-topbar{
            border-radius: @radius-m;
            background: @bg-color-l;
            padding: @space-l @space-xl;
            margin-bottom: @space-l;
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 1200px;
            &-title{
                .font-xl();
                font-weight: 600;
            }
        }
        .edit-form{
            background: @bg-color-l;
            border-radius: @radius-m;
            width: 100%;
            flex: none;
            display: flex;
            flex-direction: column;
            padding: 24px;
            align-items: center;
        }
    }
</style>