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
import { diaryApi, deleteDiaryApi, gainDiaryApi, deleteFileByURLApi } from "../../api";

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

// 从 Content（包含多个 JSON 对象的字符串）中提取所有 URL，并加上单引号
const extractURLsFromContent = (content: string): string[] => {
    if (!content) return [];
    // 匹配 "URL":"任意非引号字符"
    const regex = /"URL":"([^"]+)"/g;
    const matches = content.matchAll(regex);
    const urls: string[] = [];
    for (const match of matches) {
        urls.push(`'${match[1]}'`); // 直接加单引号
    }
    return urls;
};

//删除
const deleteDiary = async(e: number): Promise<void> => {
    // 1. 获取日记详情，提取 Picture
    let content = '';
    try {
        gainDiaryApi({
            token: managerStore.token,
            diaryID: e,
            managerID: managerStore.id
        }).then(async (res: any)=>{
            if(tackleCode(res.code, true)){
                content = res.data.Picture || '';
                // 2. 提取图片 src（文件名加单引号）
                const srcs = extractURLsFromContent(content);

                // 3. 如果有图片，先删除图片
                if (srcs.length > 0) {
                    try {
                        const request = {
                            token: managerStore.token,
                            filesURL: srcs
                        };
                        await deleteFileByURLApi(request);
                        // 可选：删除成功后提示
                        // proxy.$message({ type: 'success', message: `已删除 ${srcs.length} 张图片` });
                    } catch (error) {
                        console.error('删除图片失败:', srcs, error);
                        // 根据业务需要：可抛出错误阻止文章删除，或仅警告并继续
                        // 此处选择抛出错误，确保图片清理完成
                        proxy.$message({ type: 'error', message: '删除图片失败，日记删除已取消' });
                        throw error;
                    }
                }
            }else {
                // 获取内容失败，可提示并中止删除（或根据业务决定是否继续）
                proxy.$message({ type: 'error', message: '获取日记内容失败，无法清理图片' });
                throw new Error('获取日记内容失败');
            }
        }).catch((err)=>{
            console.error('请求失败:', err);
        });
    } catch (error) {
        console.error('获取日记内容出错:', error);
        throw error; // 终止删除图片流程
    }

    let request = {
        token: managerStore.token,
        diaryID: e
    };
    // 4. 删除日记
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