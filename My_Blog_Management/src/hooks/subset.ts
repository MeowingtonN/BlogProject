// subset的操作函数

import { ref, getCurrentInstance } from 'vue';
import { useSubsetStore } from '../store/subset';
import { useManagerStore } from '../store/managers';
import { useCode } from '../hooks/code';
import { addSubsetApi, subsetApi, deleteSubsetApi, reviseSubsetApi, articleStateApi } from '../api';

const { tackleCode } = useCode();
const managerStore = useManagerStore();

//store
const subsetStore = useSubsetStore();

export function useSubset(emits:any) {

    //新建分组内容
    const inputValue = ref<number | string>();

    //当前选择
    const selected = ref<string>('-1all');
    //选择切换
    const changeOption = (id: number | string, type: string) => {
        if (id + type != selected.value) {
            selected.value = id + type;
            emits('nowSubset', { id, type });
        }
    }

    //获取分组
    const rawSubset = (e: number) => {
        let request = {
            token: managerStore.token,
            classify: e
        };
        subsetApi(request).then((res: any) => {
            if (tackleCode(res.code)) {
                subsetStore.data = res.data.list;
                subsetStore.count = res.data.count;
            }
            //console.log(subsetStore.data);
        });
    }

    const proxy: any = getCurrentInstance()?.proxy;
    function cancel() {
        inputValue.value = "";
    }
    //新建分组
    function confirm(e: number) {
        if (inputValue.value) {
            let request = {
                token: managerStore.token,
                value: {
                    subsetName: inputValue.value,
                    classify: e,
                    moment: new Date()
                }
            };
            
            addSubsetApi(request).then((res: any) => {
                if (tackleCode(res.code, true)) {
                    let sub = {
                        id: res.data,
                        subsetName: inputValue.value!,
                        value: 0
                    };
                    //subsetStore.data.push(sub);
                    subsetStore.data = [...subsetStore.data, sub];
                    inputValue.value = "";
                    proxy.$message({ type: 'primary', message: '插入完成' });
                }
            });
        } else {
            proxy.$message({ type: 'warning', message: '请输入' });
        }
    }
    //管理分组
    const visible = ref<boolean>(false);
    const showModal = (e: number) => {
        visible.value = !visible.value;
        if (visible.value == true)
            rawSubset(e);
    }

    //删除分组
    const deleteSubset = (e: number | string) => {
        let request = {
            subsetID: e,
            token: managerStore.token
        };
        deleteSubsetApi(request).then((res: any) => {
            if (tackleCode(res.code, true)) {
                //前端数组静态删除
                subsetStore.data = subsetStore.data.filter(
                    (obj: { value: any; id: number | string }) => {
                        if (obj.id === e) {
                            subsetStore.exclude.value += obj.value;
                        }
                        return obj.id !== e;
                    });
                proxy.$message({ type: 'primary', message: '删除分组成功' });
            }
        });
    }

    //修改分组信息
    const updateSubset = (e:any)=>{
        //提交后端处理
        let request = {
            subsetName: e.subsetName,
            subsetID: e.id,
            token: managerStore.token
        };
        reviseSubsetApi(request).then((res:any)=>{
            if(tackleCode(res.code, true)){
                proxy.$message({type:'primary', message:'修改分组成功'});
            }
        });
    }

    //获取文章状态（是否发布）下的数量
    const state = ref<{id:number,name:string,value:number}[]>();
    const getState = ()=>{
        let request = {
            token: managerStore.token
        };
        articleStateApi(request).then((res:any)=>{
            if(tackleCode(res.code)){
                state.value = res.data;
            }
        });
    }

    return {
        inputValue,
        selected,
        visible,
        state,
        changeOption,
        rawSubset,
        cancel,
        confirm,
        showModal,
        deleteSubset,
        updateSubset,
        getState
    };

}