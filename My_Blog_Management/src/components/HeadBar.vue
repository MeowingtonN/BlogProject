<!-- HeadBar模块，在App.vue中导入 -->
<template>
    <div class="head-bar">
        <yk-space align="center" :size="12" style="cursor: pointer;" @click="backHome">
            <img src="../assets/1.jpg" class="logo" />
            <span class="TitleName">This is my 博客！</span>
        </yk-space>
        <yk-space align="center" size="xl">
            <yk-text v-if="managerStore.name" style="font-weight: 600;">你好，{{ managerStore.name }}！ </yk-text>
            <yk-badge is-dot :hidden="isread">
                <IconMailOutline style="font-size: 20px;cursor: pointer;" @click="changeActive(true)" />
            </yk-badge>
            <yk-avatar img-url="/src/assets/user.jpg"></yk-avatar>
            <div><yk-theme /></div>
            <yk-button @click="changeOperateMode">{{ operateMode.operateMode }}</yk-button>
            <yk-button @click="logOut">退出</yk-button>
        </yk-space>
        <Message :active="active" :pageSize="pageSize" @close="changeActive(false)"></Message>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '../components/reply/index';
import { isRegisterApi, messageCountNotReadApi } from '../api';
import { useCode } from '../hooks/code';
import { useManagerStore, useOperateMode } from '../store/managers';
import { useShadowManagerStore } from '../store/shadow_manager';

const proxy: any = getCurrentInstance()?.proxy;
const router = useRouter();
//Vue 3中的ref是响应式系统的一部分，通过.value可以访问值。在template中，Vue会自动解包ref的值，可以直接使用{{count}}而不用.value。
//在Vue.js中，响应式是指数据变化时自动更新视图的机制，开发者无需手动操作DOM，只需修改数据，Vue会自动同步视图与数据状态。
const active = ref<boolean>(false);
const pageSize = ref<number>(8);

const operateMode = useOperateMode();
const managerStore = useManagerStore();
const shadowManagerStore = useShadowManagerStore();

//code验证
const { tackleCode } = useCode();

//返回总览
const backHome = () => {
    router.push('/')
}

//展开/关闭私信
const changeActive = (e: boolean) => {
    active.value = e;
    //关闭私信后去除未读小红点
    if (!e) {
        messageCountNotRead();
    }
}

const isRegister = () => {
    let data = {
        token: managerStore.token
    };
    //result是服务器调用`res.send()`发送的结果内容。
    isRegisterApi(data).then((result: any) => {
        //code验证
        if (tackleCode(result.code)) {
            //已注册的
            //isLogin();
        }
    })
}

//是否登录验证
// const isLogin = ()=>{
//     if(!managerStore.token){
//         router.push('/login');
//     }
// }

//获取未读私信数
const isread = ref<boolean>(true);
const messageCountNotRead = () => {
    let data = {
        token: managerStore.token
    };
    //result是服务器调用`res.send()`发送的结果内容。
    messageCountNotReadApi(data).then((result: any) => {
        //code验证
        if (tackleCode(result.code)) {
            if (result.data == 0) {
                isread.value = true;
            } else if (result.data > 0) {
                isread.value = false;
            }
        }
    });
}

//退出登录
const logOut = () => {
    let isLogin = false;
    if (managerStore.token != '' || shadowManagerStore.token != '') {
        isLogin = true;
    }
    managerStore.$patch(
        {
            id: -1,
            name: '',
            token: ''
        }
    );
    shadowManagerStore.$patch({
        id: -1,
        name: '',
        token: ''
    });
    operateMode.$patch({ operateMode: "Now:个人编辑模式" });
    if (isLogin) {
        proxy.$message({ type: 'primary', message: 'token已清空' });
        router.push('/login');
    } else {
        proxy.$message({ type: 'primary', message: '当前为游客模式' });
    }
}

const changeOperateMode = () => {
    if (operateMode.operateMode == "Now:个人编辑模式") {
        shadowManagerStore.$patch({
            id: managerStore.id,
            name: managerStore.name,
            token: managerStore.token
        });
        managerStore.$patch(
            {
                id: -1,
                name: '',
                token: ''
            }
        );
        operateMode.$patch({ operateMode: "Now:游客浏览模式" });
        router.push('/overview');
    } else if (operateMode.operateMode == "Now:游客浏览模式") {
        managerStore.$patch({
            id: shadowManagerStore.id,
            name: shadowManagerStore.name,
            token: shadowManagerStore.token
        });
        shadowManagerStore.$patch({
            id: -1,
            name: '',
            token: ''
        });
        operateMode.$patch({ operateMode: "Now:个人编辑模式" });
        router.push('/overview');
    }
};

onMounted(() => {
    isRegister();
    messageCountNotRead();
});
</script>

<style lang="less" scoped>
.head-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 64px;
    background: @bg-color-l;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 @space-xl;

    .TitleName {
        font-weight: 600;
        font-size: 20px;
    }

    .logo {
        height: 44px;
        width: 44px;
    }
}
</style>