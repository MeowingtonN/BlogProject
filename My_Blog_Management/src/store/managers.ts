import { defineStore } from 'pinia';

export const useManagerStore = defineStore('manager',{
    state: ()=>{
        return{
            id: -1,
            name: '',
            token: ''
        }
    },
    persist: {
        storage: sessionStorage
    }
});

export const useOperateMode = defineStore('operateMode',{
    state: ()=>{
        return{
            operateMode: "Now:个人编辑模式"
        }
    },
    persist: {
        storage: sessionStorage
    }
});