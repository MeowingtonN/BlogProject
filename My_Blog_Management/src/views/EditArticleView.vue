<template>
    <div class="edit-gallery">
        <div class="edit-gallery-topbar">
            <p class="edit-gallery-topbar-title">编辑博客文章</p>
            <yk-space align="center">
                <yk-text type="secondary" v-if="isSave">{{ saveMoment }} 保存</yk-text>
                <yk-button type="secondary" @click="submit(0)">保存</yk-button>
                <yk-button @click="submit(1)">发布</yk-button>
            </yk-space>
        </div>
        <editor style="width: 1200px;" @editors="editorData" :Content="defaultArticle?.content">
            <!-- 将formsVue中发出的formData信号在本文件中处理，可达到集中处理相似信号的目的。 -->
            <formsVue style="width: 820px; padding-top: 15px;" :Classify="0" :form="defaultArticle?.filterResData" @formData="formData" />
        </editor>
    </div>
</template>

<script lang="ts" setup>
import editor from '../components/editor/editor.vue';
import formsVue from '../components/forms/forms.vue';
import { useArticle } from "../hooks/article";
import { useRoute } from 'vue-router';

const route = useRoute();

const { _id, isSave, saveMoment, formData, editorData, submit, defaultArticle } = useArticle();

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