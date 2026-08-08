import { defineStore } from 'pinia';

export const useShadowManagerStore = defineStore('shadowManager',{
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