<template>
    <div class="subset">
        <yk-space wrap>
            <div class="subset-menu" :class="{'subset-menu-selected':selected=='-1all'}" @click="changeOption(-1,'all')">
                全部{{ subsetStore.count }}
            </div>
            <!-- 已发布、未发布 -->
            <div class="subset-menu" v-for="item in state" :key="item.id" v-if="props.classify==0" :class="{'subset-menu-selected' :selected==item.id+'state'}" @click="changeOption(item.id,'state')">
                {{ item.name }} {{ item.value }}
            </div>
            <div class="subset-menu" :class="{'subset-menu-selected':selected==subsetStore.exclude.id + 'exclude'}" @click="changeOption(subsetStore.exclude.id,'exclude')">
                {{ subsetStore.exclude.name }} {{ subsetStore.exclude.value }}
            </div>
            <div class="subset-menu" v-for="item in subsetStore.data" :key="item.id" :class="{'subset-menu-selected':selected==item.id + 'subset'}" @click="changeOption(item.id,'subset')">
                {{ item.subsetName }} {{ item.value }}
            </div>
        </yk-space>
        <yk-space style="flex:none">
            <yk-popconfirm title="新建分组" @cancel="cancel" @confirm="confirm(props.classify)" placement="bottom" trigger="click">
                <yk-text type="primary">
                    <IconCirclePlusOutline style="margin-right: 4px;"/>新建
                </yk-text>
                <template #content>
                    <div style="margin: 8px 4px 16px;">
                        <yk-input show-counter :limit="6" placeholder="请输入..." style="width: 208px;" v-model="inputValue" />
                    </div>
                </template>
            </yk-popconfirm>
            <yk-text type="primary" @click="showModal(props.classify)">
                 <IconSettingsOutline style="margin-right: 4px;"/>管理分组
            </yk-text>
        </yk-space>
        <yk-modal v-model="visible" title="管理分组">
            <subset-manage />
            <template #footer>
                <yk-button @click="showModal(props.classify)">确定</yk-button>
            </template>
        </yk-modal>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, watch } from 'vue';
import subsetManage from './subset-manage.vue';
import { useSubset } from '../../hooks/subset';
import { useSubsetStore } from '../../store/subset';

//store
const subsetStore = useSubsetStore();

const emits = defineEmits(['nowSubset']);

const {
    inputValue,
    selected,
    visible,
    state,
    changeOption,
    rawSubset,
    cancel,
    confirm,
    showModal,
    getState
} = useSubset(emits);

const props = defineProps({
    classify: {
        default: -1,
        type: Number
    },
    isDelete:{
        default: false,
        type: Boolean
    },
    isChangeState:{
        default: false,
        type: Boolean
    },
    isChangeSubset:{
        default: false,
        type: Boolean
    }
});

watch(
    ()=>props.isDelete,
    ()=>{
        rawSubset(props.classify);
        if(props.classify == 0){
            getState();
        }
    }
);

watch(
    ()=>props.isChangeState,
    ()=>{
        if(props.classify == 0){
            getState();
        }
    }
);

watch(
    ()=>props.isChangeSubset,
    ()=>{
        rawSubset(props.classify);
    }
);

onMounted(()=>{
    rawSubset(props.classify);
    if(props.classify == 0){
        getState();
    }
});

</script>

<style lang="less" scoped>
    .subset{
        padding: @space-l @space-xl;
        border-radius: @radius-m;
        background-color: @bg-color-l;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .yk-text{
            cursor: pointer;
        }
        &-menu{
            padding: 0 @space-l;
            background: @bg-color-m;
            border-radius: @radius-r;
            line-height: 32px;
            user-select: none;
            cursor: pointer;
            &-selected{
                background: @pcolor-1;
                color:@pcolor;
                font-weight: 500;
            }
        }
    }
</style>