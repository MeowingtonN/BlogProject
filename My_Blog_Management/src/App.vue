<script setup lang="ts">
import HeadBar from './components/HeadBar.vue'
</script>

<template>
  <head-bar />
  <router-view />  <!--根据提供的路由配置，App.vue中的<router-view />将渲染IndexView组件（routes中的根路径对应的component是IndexView），
                    而当路径为/overview时，IndexView组件内部的<router-view>将渲染OverView.vue组件。-->
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
