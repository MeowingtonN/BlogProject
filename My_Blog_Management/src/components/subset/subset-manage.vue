<template>
    <yk-table>
    <yk-table-column property="name" label="分组名称"></yk-table-column>
    <yk-table-column property="value" label="关联数量" align="center"></yk-table-column>
    <yk-table-column property="moment" label="创建时间" align="center"></yk-table-column>
    <yk-table-column property="manage" label="操作" align="right"></yk-table-column>
    <template #tbody>
        <tr v-for="(item,index) in subsetStore.data" :key="index" class="yk-table-row">
            <td class="yk-table-cell" style="width: 200px;">
                <yk-input v-model="item.subsetName" @focus="focusSubset(item.id)" @blur="blurSubset(item.id)"></yk-input>
            </td>
            <td class="yk-table-cell" style="text-align: center;">
                {{item.value}}
            </td>
            <td class="yk-table-cell" style="text-align: center;">
                {{ momentm(item.moment!) }}
            </td>
            <td class="yk-table-cell text-right" style="padding-right: 25px;">
                <yk-text type="primary" style="cursor: pointer;" @click="deleteSubset(item.id)">删除</yk-text>
            </td>
        </tr>
    </template>
    </yk-table>
</template>

<script lang="ts" setup>
import { useSubsetStore } from '../../store/subset';
import { momentm } from '../../utils/moment';
import { useSubset } from '../../hooks/subset';

const {deleteSubset, updateSubset} = useSubset({});

//store
const subsetStore = useSubsetStore();

//当前分组名称
let nowName : string|number;
//聚焦名称
const focusSubset=(id:number|string)=>{
    let result = subsetStore.data.find((item:{id:number|string})=>item.id === id);
    if(result){
        nowName = result.subsetName;
    }
}
//失焦（修改分组名称）
const blurSubset = (id:number|string)=>{
    let result = subsetStore.data.find((item:{id:number|string})=>item.id === id);
    if(result && result.subsetName != nowName){
        //提交后端处理
        updateSubset(result);
    }
}
</script>

<style lang="less" scoped>
    .yk-table-row{
        &:hover{
            background: @bg-color-s;
        }
    }
</style>