<template>
    <div class="files">
        <div class="files-tool" v-show="selectedFilesId.length > 0">
            <yk-space>
                <yk-checkbox :checked="checkedAll" :indeterminate="indeterminate" @change="handleChangeAll">
                    全选
                </yk-checkbox>
                <yk-text>已选择 {{ selectedFilesId.length }} 项内容</yk-text>
                <yk-text type="primary" style="cursor: pointer;" @click="removeAll">取消选择</yk-text>
            </yk-space>
            <yk-space>
                <IconDeleteOutline class="files-tool-delete" @click="deleteFiles" />
                <yk-popconfirm title="选择分组" placement="bottomRight" trigger="click" @cancel="cancel" @confirm="confirm">
                    <IconSwitchOutline class="files-tool-switch" />
                    <template #content>
                        <yk-scrollbar ref="scrollbar" height="148px" class="subset">
                            <div v-for="item in subsetStore.data" class="subset-item"
                                :class="{ 'subset-selected': subsetSelectdId == item.id }" @click="changeOption(item.id)">
                                {{ item.subsetName }}{{ item.value }}
                            </div>
                        </yk-scrollbar>
                    </template>
                </yk-popconfirm>
            </yk-space>
        </div>
        <div class="files-main">
            <!-- v-for="item in files"：列表渲染；:data="item"：将当前遍历的item作为data属性传递给filesItem组件，filesItem组件内部通过props接收这个data；
             :key="item.id"：帮助Vue高效更新虚拟DOM，在列表变化时正确识别每个元素。如果没有key，在列表变化时可能导致列表项组件状态“漂移”到错误项并且性能较差（总是为v-for提供key）；
             @selected="selectFile"：监听子组件发出的自定义事件，捕获到事件则触发对应方法（子组件是filesItem，父组件就是files）。 -->
            <filesItem v-for="item in files" :data="item" :key="item.ID" @selected="selectFile" @delete="deleteFile"
                @changeSubsetId="changeSubset" />
        </div>
        <div class="files-page" v-show="count / props.pageSize > 1">
            <yk-pagination :total="count" size="m" @change="changePage"
                :default-page-size="props.pageSize"></yk-pagination>
        </div>
        <div class="Empty" v-show="count == 0">
            <yk-empty description="空空如也..." type="secondary" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { watch, onMounted, ref, getCurrentInstance } from 'vue';
import filesItem from "./files-item.vue";
import { useSubsetStore } from '../../store/subset';
import { fileApi, deleteFileApi, moveFileApi } from '../../api';
import { useCode } from '../../hooks/code';
import { useManagerStore } from '../../store/managers';
import './files.less';

const { tackleCode } = useCode();
const managerStore = useManagerStore();
const emits = defineEmits(['nowSubset', 'deleteFile', 'changeSubset']);

//store
const subsetStore = useSubsetStore();

const proxy: any = getCurrentInstance()?.proxy;

type FileProps = {
    pageSize: number;
    subsetID: number | string;
    isUpload?: boolean;
};

const props = withDefaults(defineProps<FileProps>(), {
    pageSize: 10,
    subsetID: -1,
    isUpload: false
});

//头部操作
const checkedAll = ref(false);
const indeterminate = ref(false);
const handleChangeAll = (value: boolean) => {
    indeterminate.value = false;
    //先清空选择ID
    selectedFilesId.value = [];
    if (value) {
        checkedAll.value = true;
        for (let i = 0; i < files.value.length; i++) {
            files.value[i].selected = true;
            selectedFilesId.value.push(files.value[i].ID);
        }
    } else {
        checkedAll.value = false;
        for (let i = 0; i < files.value.length; i++) {
            files.value[i].selected = false;
        }
    }
}

//取消选择
const removeAll = () => {
    selectedFilesId.value = [];
    for (let i = 0; i < files.value.length; i++) {
        files.value[i].selected = false;
    }
}

//被选中图片ID数组
const selectedFilesId = ref<number[]>([]);

//选择操作
const selectFile = (e: number) => {
    for (let i = 0; i < files.value.length; i++) {
        if (files.value[i].ID === e) {
            files.value[i].selected = !files.value[i].selected;
            if (files.value[i].selected) {
                selectedFilesId.value.push(e);
            } else {
                //从数组移除对应项
                selectedFilesId.value = selectedFilesId.value.filter((item) => {
                    return item !== e;
                });
            }
            //半选与全选
            if (selectedFilesId.value.length == 0) {
                indeterminate.value = false;
                checkedAll.value = false;
            } else if (selectedFilesId.value.length == files.value.length) {
                indeterminate.value = false;
                checkedAll.value = true;
            } else {
                indeterminate.value = true;
                checkedAll.value = false;
            }
        }
    }
}

//删除
//删除单张图片
const deleteFile = (id: number, url: string) => {
    let request = {
        token: managerStore.token,
        filesID: id,
        filesURL: url
    };
    //console.log(request);
    deleteFileApi(request).then((res: any) => {
        if (tackleCode(res.code, true)) {
            // files.value = files.value.filter((item:any)=>{
            //     return item.ID !== id;
            // });
            proxy.$message({ type: 'primary', message: '删除成功' });
            emits('deleteFile');
            drwData(true);
        }
    });
}
//多张删除
const deleteFiles = () => {
    //收集提交后端内容
    let url = [];
    for (let i = 0; i < selectedFilesId.value.length; i++) {
        for (let j = 0; j < files.value.length; j++) {
            if (files.value[j].ID == selectedFilesId.value[i]) {
                url.push(files.value[j].URL);
            }
        }
    }
    let request = {
        token: managerStore.token,
        filesID: selectedFilesId.value.join(','),
        filesURL: url
    };
    deleteFileApi(request).then((res: any) => {
        if (tackleCode(res.code, true)) {
            proxy.$message({ type: 'primary', message: '删除成功' });
            emits('deleteFile');
            drwData(true);
            //清除选择的ID
            selectedFilesId.value = [];
            //前端静态删除
            // if (selectedFilesId.value.length > 0) {
            //     for (let i = 0; i < selectedFilesId.value.length; i++) {
            //         files.value = files.value.filter((item: any) => {
            //             return item.ID !== selectedFilesId.value[i];
            //         });
            //     }
            //     //清除选择的ID
            //     selectedFilesId.value = [];
            // }
        }
    });
}

//切换单张图片分组
const changeSubset = (e: {id?:number; subsetID:number|string}) => {
    let request = {
        token: managerStore.token,
        fileID: e.id,
        subsetID: e.subsetID 
    };
    moveFileApi(request).then((res:any)=>{
        if(tackleCode(res.code, true)){
            emits('changeSubset');
            drwData(true);
            proxy.$message({ type: 'primary', message: '更改分组成功' });
        }
    });
}

//总数
const count = ref<number>(123);
//数据内容
const files = ref();

//请求
type Request = {
    token: string;
    pageSize: number;    //单页评论条数
    nowPage: number;     //当前页数
    subsetID: number | string;
    count: boolean;
};

const request: Request = {
    token: managerStore.token,
    pageSize: props.pageSize,
    subsetID: props.subsetID,
    nowPage: 1,
    count: false
}

//获取数据
const drwData = (e: boolean) => {
    //console.log(subsetStore.data);
    request.count = e;
    fileApi(request).then((res: any) => {
        if (tackleCode(res.code)) {
            //console.log(res.data);
            if (e) {
                count.value = res.data.count;
            }
            let _files = res.data.result;
            //加入选择项
            for (let i = 0; i < _files.length; i++) {
                _files[i].selected = false;
            }
            files.value = _files;
            //console.log(_files);
        }
    });
};

//翻页
const changePage = (e: number) => {
    request.nowPage = e;
    drwData(false);
}

//分类选择
const subsetSelectdId = ref<number | string>();
//切换分组
const changeOption = (e: number | string) => {
    subsetSelectdId.value = e;
}

function cancel() {
    proxy.$message({ type: 'warning', message: '取消' });
}
//切换多张图片分组
function confirm() {
    let request = {
        token: managerStore.token,
        fileID: selectedFilesId.value.join(','),
        subsetID: subsetSelectdId.value
    };
    moveFileApi(request).then((res:any)=>{
        if(tackleCode(res.code, true)){
            emits('changeSubset');
            drwData(true);
            //清除选择的ID
            selectedFilesId.value = [];
            proxy.$message({ type: 'primary', message: '更改分组成功' });
        }
    });
}

watch(
    props,
    () => {
        request.nowPage = 1;
        request.subsetID = props.subsetID;
        drwData(true);
    }
);

onMounted(() => {
    drwData(true);
})
</script>

<style lang="less" scoped>
.files {
    background: @bg-color-l;
    padding: @space-xl;
    border-radius: @radius-m;
    width: 100%;

    &-tool {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: @space-l;
        border-radius: @radius-m;
        background: @bg-color-m;

        &-delete,
        &-switch {
            width: 20px;
            height: 20px;
            color: @font-color-s;
            cursor: pointer;

            &:hover {
                color: @font-color-l;
            }
        }
    }

    &-main {
        padding: 24px 0 32px;
        display: grid;
        grid-template-columns: repeat(auto-fill, 200px);
        row-gap: 32px;
        column-gap: 24px;
        justify-content: center;
    }

    &-page {
        padding: @space-l 0 0;
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