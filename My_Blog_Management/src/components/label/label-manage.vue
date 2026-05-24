<template>
    <yk-table>
        <yk-table-column property="name" label="标签名称"></yk-table-column>
        <yk-table-column property="moment" label="创建时间" align="center"></yk-table-column>
        <yk-table-column property="manage" label="操作" align="right"></yk-table-column>
        <template #tbody>
            <tr v-for="(item, index) in label" :key="index" class="yk-table-row">
                <td class="yk-table-cell" style="padding-left: 24px;">
                    {{ item.labelName }}
                </td>
                <td class="yk-table-cell" align="center">
                    {{ momentm(item.Moment!) }}
                </td>
                <td class="yk-table-cell text-right" style="padding-right: 25px;">
                    <yk-text type="primary" style="cursor: pointer;" @click="deletelabel(item.ID)">删除</yk-text>
                </td>
            </tr>
        </template>
    </yk-table>
</template>

<script lang="ts" setup>
import { watch } from 'vue';
import type { LabelData } from '../../utils/interface';
import { momentm } from '../../utils/moment';
import { useLabel } from '../../hooks/label';

const {label} = useLabel();


type labelProps = {
    label: LabelData[];
}
const props = withDefaults(defineProps<labelProps>(), {

});

//删除标签
const emits = defineEmits(['deleteLabel']);
const deletelabel = (e:number|string)=>{
    emits('deleteLabel', e);
    //前端数据静态删除
    label.value = label.value.filter((obj:{ID:number|string})=>{
        return obj.ID !== e;
    });
}

watch(
    () => props.label,
    (e) => {
        label.value = [...e];
    },
    { immediate: true }
);
</script>

<style lang="less" scoped>
.yk-table-row {
    height: 35px;

    &:hover {
        background: rgb(238, 238, 238);
    }
}
</style>