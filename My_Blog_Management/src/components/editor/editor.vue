<template>
    <yk-affix :offset="60" @change="toolbarTop">  
      <Toolbar
        class="toolbar"
        :class="{'istop':top}"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
      />
    </yk-affix>
    <div class="editor-main">
      <!-- EditArticleView.vue文件中调用本editor.vue组件时，在<editor>这对标签中间的组件会渲染到此处。 -->
      <slot></slot>
      <Editor
        class="editor"
        style="min-height: 500px; width:820px; overflow-y: hidden;"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        @onCreated="handleCreated"
        @onChange="onChange"
      />
    </div>
</template>

<script lang="ts" setup>
  import './style.less' // 引入 less

  import { onBeforeUnmount, ref, shallowRef, watch } from 'vue'
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
  import type { IToolbarConfig, IEditorConfig } from '@wangeditor/editor'
  import {colors} from './colors.ts';
  import { uploadApi } from '../../api/index.ts';
  import { baseImgPath } from '../../utils/env.ts';

  const emits = defineEmits(['editors']);

  const props = defineProps(["Content"]);

  //工具栏固定
  const top = ref<boolean>(false);
  const toolbarTop = (e:boolean)=>{
    top.value = e;
  }

  // 编辑器实例，必须用 shallowRef
  const editorRef = shallowRef()

  // 内容 HTML
  const valueHtml = ref('')

  watch(
    ()=>props.Content,
    (e)=>{
      valueHtml.value = e;
    }
  );

  //工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {
    toolbarKeys : [
      'blockquote',
      'headerSelect',
      '|',
      'bold',
      'underline',
      'through',
      'italic',
      'color',
      'bgColor',
      'clearStyle',
      '|',
      'bulletedList',
      'numberedList',
      'todo',
      // 菜单组，包含多个菜单
      {
        key: 'group-justify', // 必填，要以 group 开头
        title: '对齐', // 必填
        menuKeys: ['justifyLeft', 'justifyRight', 'justifyCenter', 'justifyJustify'], // 下级菜单 key ，必填
      },
      {
        key: 'group-indent', // 必填，要以 group 开头
        title: '缩进', // 必填
        menuKeys: ['indent', 'delIndent'], // 下级菜单 key ，必填
      },
      '|',
      'emotion',
      'insertLink',
      'uploadImage',
      'insertVideo',
      'insertTable',
      '|',
      'code',
      'codeBlock'
    ]
  }

  //菜单配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...',
    MENU_CONF:{
      color:{
        colors,
      },
      bgcolor:{
        colors,
      },
      //在点击插入图片按钮时才将相应图片的路径保存到数据库中
      uploadImage:{
        async customUpload(file:File, insertFn: any){
          const formData = new FormData();
          formData.append('file',file);
          uploadApi(formData).then((res:any)=>{
              let url = baseImgPath + '/' + res.data.URL;
              insertFn(url, res.data.URL, url);
              //console.log(res);
          });
          //insertFn(url, alt, href);
        }
      },
    }
  }

  //获取内容
  const onChange = ()=>{
    emits('editors', valueHtml.value);
  }

  // 组件销毁时，也及时销毁编辑器
  onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
  })

  const handleCreated = (editor:any) => {
    editorRef.value = editor // 记录 editor 实例，重要！
    editor.getAllMenuKeys()
  }

</script>

<style lang="less" scoped>
  .toolbar{
    border-radius: @radius-s;
    width: 1200px;
    background: @bg-color-l;
  }
  .istop{
    box-shadow: @shadow-m;
  }
  .editor-main{
    padding-top: @space-xl;
    margin-top: @space-s;
    border-radius: @radius-m;
    background: @bg-color-l;
    width: 1200px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .editor{
    overflow-y: unset !important;
  }
</style>