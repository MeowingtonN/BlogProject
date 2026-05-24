import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { YikeResolver } from '@yike-design/resolver' // https://vitejs.dev/config/ export default

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({ resolvers: [YikeResolver] }),  //在项目中使用组件库时，能够自动导入其组件、组合式函数或工具函数，无需在每个文件中手动编写 import 语句。
    Components({ resolvers: [YikeResolver] }),
  ],
  css: {
    // css预处理器。自动引入全局样式，减少了在每个文件中手动导入的工作量。
    preprocessorOptions: {
      less:{
        charset: false,
        additionalData:
          '@import "@yike-design/ui/es/components/styles/basis.less";',
      },
    },
  },
})
