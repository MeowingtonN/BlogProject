import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue'
import '@yike-design/ui/es/index.less'
// 引入全局方法
import { YkMessage, YkNotification } from '@yike-design/ui'
import Icon from '@yike-design/ui/es/components/svg-icon'
import './style.less'

//路由
import router from './router'

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App)
app.config.globalProperties.$notification = YkNotification
app.config.globalProperties.$message = YkMessage

app
    .use(router)
    .use(Icon)
    .use(pinia)
    .mount('#app')  //将app对象挂载到index.html中id为app的组件中。
                    //挂载后，Vue会使用App.vue组件的内容替换掉<div id="app">中的原有内容。