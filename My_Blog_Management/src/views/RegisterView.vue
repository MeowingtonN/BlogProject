<template>
    <div class="register" :style="{ height: pageHeight + 'px' }">
        <yk-space dir="vertical" :size="48" class="register-main" align="center">
            <yk-space dir="vertical" align="center">
                <img src="../assets/1.jpg" class="logo" />
                <span class="name">Welcome to Register on My Blog Project!</span>
            </yk-space>
            <yk-space dir="vertical">
                <yk-input v-model="user.account" clearable placeholder="请输入注册账号..." style="width: 320px;" size="xl" />
                <yk-input type="password" v-model="user.password" clearable placeholder="请输入注册密码..."
                    style="width: 320px;" size="xl" />
            </yk-space>
            <yk-button long size="xl" @click="submit">注册</yk-button>
        </yk-space>
    </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from "vue";
import { registerApi } from "../api";
import { useCode } from "../hooks/code";
import { useRouter } from "vue-router";

const router = useRouter();

//code验证
const {tackleCode} = useCode();

const proxy: any = getCurrentInstance()?.proxy;

const pageHeight = ref(window.innerHeight);

//用户
const user = ref({
    account: '',
    password: ''
})

//提交
const submit = () => {
    if (user.value.password && user.value.password.length <= 3) {
        proxy.$message({ type: 'warning', message: '输入密码字符长度不得小于4个' });
    } else if (user.value.account && user.value.password) {
        //输入判断通过
        let data = {
            name: user.value.account,
            password: user.value.password,
            moment: new Date()
        };
        registerApi(data).then((res:any)=>{
            if(tackleCode(res.code)){
                //注册成功
                proxy.$message({ type: 'primary', message: 'Register done' });
                router.push('/login');
            }
        });
    } else {
        proxy.$message({ type: 'warning', message: '输入不完整' });
    }
}

</script>

<style lang="less" scoped>
.register {
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