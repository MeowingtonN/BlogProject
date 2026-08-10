import { createWebHistory, createRouter } from 'vue-router'

import IndexView from '../views/IndexView.vue'
import hello from '../components/HelloWorld.vue'

//页面路由
const routes = [
  {
    path: '/',
    name:'home',
    redirect:'/OverView',   //默认定向至/overview路径
    component: IndexView,
    //嵌套路由
    children: [
      {
        // 当路径中 /overview（path+path） 匹配成功
        // OverView.vue的内容将被渲染到 IndexView.vue(component) 的 <router-view> 内部
        path: 'OverView',
        component:()=>import('../views/OverView.vue'),
      },
      {
        // 当路径中 /localfile（path+path） 匹配成功
        // OverView.vue的内容将被渲染到 IndexView.vue(component) 的 <router-view> 内部
        path: 'LocalFile',
        component:()=>import('../views/FileView.vue'),
      },
      {
        // 当路径中 /article（path+path） 匹配成功
        // ArticleView.vue的内容将被渲染到 IndexView.vue(component) 的 <router-view> 内部
        path: 'ArticleOverView',
        component:()=>import('../views/ArticleView.vue'),
      },
      {
        // 当路径中 /gallery（path+path） 匹配成功
        // GalleryView.vue的内容将被渲染到 IndexView.vue(component) 的 <router-view> 内部
        path: 'GalleryOverView',
        component:()=>import('../views/GalleryView.vue'),
      },
      {
        // 当路径中 /diary（path+path） 匹配成功
        // DiaryView.vue的内容将被渲染到 IndexView.vue(component) 的 <router-view> 内部
        path: 'DiaryOverView',
        component:()=>import('../views/DiaryView.vue'),
      },
      {
        // 当路径中 /hello（path+path） 匹配成功
        // hello组件的内容将被渲染到 IndexView.vue(component) 的 <router-view> 内部
        path: 'hello',
        component: hello,
      },
    ],
  },
  {
      // 当路径中 /editGallery（path+path） 匹配成功
      // EditGallery.vue的内容将被渲染到 IndexView.vue(component) 的 <router-view> 内部
      path: '/editGallery',
      component:()=>import('../views/EditGallery.vue'),
  },
  {
      // 当路径中 /viewGallery（path+path） 匹配成功
      // browseGalleryView.vue的内容将被渲染到 IndexView.vue(component) 的 <router-view> 内部
      path: '/viewGallery',
      component:()=>import('../views/browseGalleryView.vue'),
  },
  {
      // 当路径中 /editArticle（path+path） 匹配成功
      // EditArticleView.vue的内容将被渲染到 IndexView.vue(component) 的 <router-view> 内部
      path: '/editArticle',
      component:()=>import('../views/EditArticleView.vue'),
  },
  {
      // 当路径中 /viewArticle（path+path） 匹配成功
      // browseArticleView.vue的内容将被渲染到 IndexView.vue(component) 的 <router-view> 内部
      path: '/viewArticle',
      component:()=>import('../views/browseArticleView.vue'),
  },
  {
      // 当路径中 /login（path+path） 匹配成功
      // LoginView.vue的内容将被渲染到 IndexView.vue(component) 的 <router-view> 内部
      path: '/login',
      component:()=>import('../views/LoginView.vue'),
  },
  {
      // 当路径中 /register（path+path） 匹配成功
      // RegisterView.vue的内容将被渲染到 IndexView.vue(component) 的 <router-view> 内部
      path: '/register',
      component:()=>import('../views/RegisterView.vue'),
  },
  {
      // 当路径中 /setup（path+path） 匹配成功
      // setupView.vue的内容将被渲染到 IndexView.vue(component) 的 <router-view> 内部
      path: '/setup',
      component:()=>import('../views/setupView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

//在路由请求之前
router.beforeEach((to, from, next)=>{
  //地址错误时
  if(to.matched.length === 0){
    //地址输入错误时的跳转
    from.name?next({
      name:from.name
    }):next('/');
  }else{
    next();
  }
});

export default router;