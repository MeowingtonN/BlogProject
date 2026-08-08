<template>
    <div class="login" :style="{ height: pageHeight + 'px' }">
        <yk-space dir="vertical" :size="48" class="login-main" align="center">
            <yk-space dir="vertical" align="center">
                <img src="../assets/1.jpg" class="logo" />
                <span class="name">Welcome to My Blog Project!</span>
            </yk-space>
            <yk-space dir="vertical">
                <yk-input v-model="user.account" clearable placeholder="请输入账号..." style="width: 320px;" size="xl" />
                <yk-input type="password" v-model="user.password" clearable placeholder="请输入密码..."
                    style="width: 320px;" size="xl" />
            </yk-space>
            <yk-button long size="xl" @click="submit">登录</yk-button>
        </yk-space>
    </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from "vue";
import { signInApi } from "../api";
import { useRouter } from "vue-router";
import { useManagerStore, useOperateMode } from '../store/managers';
import { useShadowManagerStore } from "../store/shadow_manager";

const router = useRouter();

const operateMode = useOperateMode();
const managerStore = useManagerStore();
const shadowManagerStore = useShadowManagerStore();

const proxy: any = getCurrentInstance()?.proxy;

const pageHeight = ref(window.innerHeight);

//用户
const user = ref({
    account: '',
    password: ''
})

//提交
const submit = () => {
    if (user.value.account && user.value.password) {
        //输入判断通过
        let data = {
            name: user.value.account,
            password: user.value.password,
        };
        //signInApi(data)：提交data给后端，data即为用户输入的内容，即request。
        signInApi(data).then((res:any)=>{
            if(res.code === 200){
                //保存res.data到Storage中，res即为后端通过`res.send()`发送的回应内容。
                managerStore.$patch(res.data);
                shadowManagerStore.$patch({
                    id: -1,
                    name: '',
                    token: ''
                });
                operateMode.$patch({ operateMode: "Now:个人编辑模式" });
                //路由跳转
                router.push('/overview');
                proxy.$message({ type: 'primary', message: 'Sign in done' });
            }else if(res.code === 400){
                proxy.$message({ type: 'error', message: '账户或密码错误' });
            }
        });
    } else {
        proxy.$message({ type: 'warning', message: '输入不完整' });
    }
}

</script>

<style lang="less" scoped>
.login {
    z-index: 10;
    position: fixed;
    top: 0;
    left: 0;
    background: @bg-color-m;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    &-main {
        padding: 48px;
        border-radius: @radius-xl;
        background: @bg-color-l;

        .name {
            font-size: 20px;
            font-weight: 600;
        }

        .logo {
            width: 84px;
            height: 84px;
        }
    }
}
</style>

<style lang="less">
/*删除密码框中的额外小眼睛*/
input::-ms-reveal {
    display: none;
}
</style>