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