import { ref, getCurrentInstance } from 'vue';
import type { LabelData } from '../utils/interface'
import { useManagerStore } from '../store/managers';
import { useCode } from '../hooks/code';
import { addLabelApi, labelApi, deleteLabelApi } from '../api';

const { tackleCode } = useCode();
const managerStore = useManagerStore();

export function useLabel() {

    //新建标签内容
    const inputValue = ref<string>();

    //获取标签
    const label = ref<LabelData[]>([]);
    const rawlabel = () => {
        let request = {
            token: managerStore.token,
            managerID: managerStore.id
        };
        labelApi(request).then((res: any) => {
            if (tackleCode(res.code)) {
                label.value = [...res.data];
            }
        });
    }

    const proxy: any = getCurrentInstance()?.proxy;

    function cancel() {
        inputValue.value = "";
    }
    //新建标签
    function confirm() {
        if (inputValue.value) {
            let request = {
                token: managerStore.token,
                value: {
                    labelName: inputValue.value,
                    managerID: managerStore.id,
                    moment: new Date()
                }
            };
            addLabelApi(request).then((res: any) => {
                if (tackleCode(res.code, true)) {
                    let lab = {
                        ID: res.data,
                        labelName: inputValue.value!
                    };
                    //label.value.push(lab);
                    //使用扩展运算符重新赋值
                    label.value = [lab, ...label.value];
                    inputValue.value = "";
                    proxy.$message({ type: 'primary', message: '新建标签完成' });
                    rawlabel();
                }
            });
        } else {
            proxy.$message({ type: 'warning', message: '请输入' });
        }
    }
    //管理标签
    const visible = ref<boolean>(false);
    const showModal = () => {
        visible.value = !visible.value;
        if (visible.value)
            rawlabel();
    }

    //删除标签
    const deletelabel = (e: number | string) => {
        let request = {
            token: managerStore.token,
            labelID: e
        };
        deleteLabelApi(request).then((res: any) => {
            if (tackleCode(res.code, true)) {
                label.value = label.value.filter(
                    (obj: { ID: number | string }) => {
                        return obj.ID !== e;
                    }
                );
                proxy.$message({ type: 'primary', message: '删除标签成功' });
            }
        });
    }

    return {
        inputValue,
        label,
        visible,
        rawlabel,
        cancel,
        confirm,
        showModal,
        deletelabel
    };
}