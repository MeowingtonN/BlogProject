import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { YikeResolver } from '@yike-design/resolver' // https://vitejs.dev/config/ export default

// 把项目中所有用到的 API 路径列在这里
const apiPaths = [
  '/isRegister',
  '/register',
  '/signIn',
  '/overview',
  '/comment',
  '/commentIsRead',
  '/deleteComment',
  '/message',
  '/messageCountNotRead',
  '/deleteMessage',
  '/addSubset',
  '/subset',
  '/reviseSubset',
  '/deleteSubset',
  '/addLabel',
  '/label',
  '/deleteLabel',
  '/createArticle',
  '/upload',
  '/updateArticle',
  '/article',
  '/articleState',
  '/changeArticleState',
  '/deleteArticle',
  '/gainArticle',
  '/deleteFile',
  '/createDiary',
  '/diary',
  '/gainDiary',
  '/deleteFileByURL',
  '/deleteDiary',
  '/file',
  //'/files',
  '/moveFile',
  '/updateFileManagerID'
]

// 自动生成代理配置
const proxyConfig = {}
apiPaths.forEach(path => {
  proxyConfig[path] = {
    target: 'http://localhost:3000',  // 你的后端地址
    changeOrigin: true
  }
})
// 静态文件代理
proxyConfig['^/files'] = { target: 'http://localhost:3000', changeOrigin: true };

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
  server: {
    allowedHosts: [
      '.trycloudflare.com' // 允许所有 trycloudflare.com 子域名，防止下次隧道重启后地址变化
    ],
    proxy: proxyConfig   // 只代理这些 API
  }
})
