<template>
    <div class="diary">
        <yk-space dir="vertical" size="xl" style="width: 100%; padding-bottom: 24px;">
            <diaryItemVue v-for="item in diaryList" :data="item" :key="item.ID" @delete="deleteDiary" :search-term="props.searchTerm"/>
        </yk-space>
        <div class="pagination" v-show="count/props.pageSize>1">
            <yk-pagination :total="count" size="m" @change="changePage" :default-page-size="props.pageSize" />
        </div>
        <div class="Empty" v-show="count==0">
            <yk-empty description="空空如也..." type="secondary" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { watch, ref, onMounted, getCurrentInstance } from "vue";
import type { DiaryData } from "../../utils/interface";
import diaryItemVue from "./diary-item.vue";
import { useCode } from "../../hooks/code";
import { useManagerStore } from "../../store/managers";
import { diaryApi, deleteDiaryApi } from "../../api";

const managerStore = useManagerStore();
const { tackleCode } = useCode();

const proxy: any = getCurrentInstance()?.proxy;

type DiaryProps = {
    pageSize: number;
    searchTerm?: string;
    newDiary?: DiaryData
}

const props = withDefaults(defineProps<DiaryProps>(),{
    pageSize: 3,
});

const request = {
    token: managerStore.token,
    managerID: managerStore.id,
    pageSize: props.pageSize,
    nowPage: 1,
    searchTerm: props.searchTerm,
    count: true
}

//获取到的日记列表
const diaryList = ref<DiaryData[]>([]);
//日记总数
const count = ref<number>(0);
//获取日记
const getData = (e: boolean) => {
    request.count = e;
    diaryApi(request).then((res: any) => {
        if (tackleCode(res.code)) {
            if(e){
                count.value = res.data.count;
            }
            diaryList.value = res.data.result;
        }
    });
}

//删除
const deleteDiary = (e: number) => {
    let request = {
        token: managerStore.token,
        diaryID: e
    };
    deleteDiaryApi(request).then((res:any)=>{
        if(tackleCode(res.code, true)){
            diaryList.value = diaryList.value.filter((obj: any) => {
                return obj.id !== e;
            });
            proxy.$message({ type: 'primary', message: '删除成功' });
            getData(true);
        }
    });
}

//翻页
const changePage = (e: number) => {
    request.nowPage = e;
    getData(false);
}

//监听新建日记
watch(
    ()=>props.newDiary!,
    (e:DiaryData)=>{
        diaryList.value.unshift(e);
    }
);
//监听搜索
watch(
    ()=>props.searchTerm,
    (e)=>{
        request.nowPage = 1;
        request.searchTerm = e;
        getData(true);
    }
);

onMounted(() => {
    getData(true);

});

</script>

<style lang="less" scoped>
.diary {
    width: 100%;

    .pagination {
        padding: @space-s 0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: 100%;
    }
    .Empty{
        width: 100%;
        height: 400px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>