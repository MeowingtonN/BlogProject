<template>
    <div class="edit-gallery">
        <div class="edit-gallery-topbar">
            <p class="edit-gallery-topbar-title">浏览摄影图库</p>
        </div>
        <yk-space style="width: 100%;">
            <editPhotoVue @editors="editorData" @cover="coverData" :content="defaultArticle?.content" :cover="defaultArticle?.cover"/>
            <div class="edit-form">
                <formsVue style="width: 420px;height: 617px;" :Classify="1" :form="defaultArticle?.filterResData" @formData="formData" />
            </div>
        </yk-space>
    </div>
</template>

<script lang="ts" setup>
import editPhotoVue from '../components/gallery/editForView.vue';
import formsVue from '../components/forms/formsForView.vue';
import { useArticle } from "../hooks/article";
import { useRoute } from 'vue-router';

const route = useRoute();

const { _id, defaultArticle, coverData, formData, editorData } = useArticle();

if(route.query.id){
    _id.value = Number(route.query.id);
    //console.log(_id.value);
}

</script>

<style lang="less" scoped>
    .edit-gallery{
        padding: @space-xl 80px;
        
        &-topbar{
            border-radius: @radius-m;
            background: @bg-color-l;
            padding: @space-l @space-xl;
            margin-bottom: @space-l;
            display: flex;
            justify-content: space-between;
            align-items: center;

            &-title{
                .font-xl();
                font-weight: 600;
            }
        }
        .edit-form{
            background: @bg-color-l;
            border-radius: @radius-m;
            flex: none;
            display: flex;
            padding: 24px;
            justify-content: center;
        }
    }
</style>