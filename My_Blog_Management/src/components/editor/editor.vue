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
  import { uploadApi, deleteFileByURLApi } from '../../api/index.ts';
  import { useCode } from '../../hooks/code';
  import { useManagerStore } from '../../store/managers';
  import { baseImgPath } from '../../utils/env.ts';

  const { tackleCode } = useCode();
  const managerStore = useManagerStore();

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

  // 记录当前编辑器内存在的所有图片地址（用于 diff）
  const currentImageSrcs = ref<string[]>([]);

  // 从 HTML 字符串中提取所有 <img> 的 src 属性
  const extractImageSrcs = (html: string): string[] => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const imgs = div.querySelectorAll('img');
    return Array.from(imgs)
      .map(img => img.getAttribute('src'))
      .filter((src): src is string => !!src)
      .map(src => src.substring(src.lastIndexOf('/') + 1))
      .map(name => `'${name}'`);
  };

  watch(
    ()=>props.Content,
    (e)=>{
      valueHtml.value = e;
      // 初始化当前图片集合
      currentImageSrcs.value = extractImageSrcs(valueHtml.value);
      //console.log(currentImageSrcs.value)
    },
    {immediate: true}
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
              let url = '/files/' + res.data.URL;
              insertFn(url, res.data.URL, url);
              //console.log(res);
          });
          //insertFn(url, alt, href);
        }
      },

      // 图片处理：转为 base64 插入，不再上传服务器（在点击插入图片按钮时触发）
      // uploadImage:{
      //   async customUpload(file: File, insertFn: any) {
      //     const reader = new FileReader();
      //     reader.onload = (e) => {
      //       const base64 = e.target?.result as string;
      //       // 参数依次为：src, alt, href
      //       insertFn(base64, file.name, base64);
      //     };
      //     reader.readAsDataURL(file);
      //   }
      // },
    }
  }

  //删除嵌入正文的图片、获取内容
  const onChange = ()=>{
    const html = valueHtml.value;
    const newSrcs = extractImageSrcs(html);
    const oldSrcs = currentImageSrcs.value;

    // 找出被删除的图片：在上一次存在，但本次不存在
    const deletedSrcs = oldSrcs.filter(src => !newSrcs.includes(src));
    
    if(deletedSrcs != null && deletedSrcs.length > 0){
      // 循环调用删除接口
      // deletedSrcs.forEach(async (src) => {
      //   try {
      //     let request = {
      //       token: managerStore.token,
      //       filesURL: src
      //     };
      //     await deleteFileByURLApi(request).then((res: any) => {
      //       if (tackleCode(res.code, true)) {
            
      //       }
      //     });
      //   } catch (error) {
      //     console.error('删除图片失败:', src, error);
      //   }
      // });

      // 批量删除插入的图片
      try {
        let request = {
          token: managerStore.token,
          filesURL: deletedSrcs
        };
        deleteFileByURLApi(request).then((res: any) => {
          if (tackleCode(res.code, true)) {
            
          }
        });
      } catch (error) {
        console.error('删除图片失败:', deletedSrcs, error);
      }
    }

    // 关键：更新记录，使下一次 onChange 能正确比较
    currentImageSrcs.value = newSrcs;
    
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