<template>
    <div class="file-item">
        <div class="file-item-img" :class="{'file-item-selected' :props.data?.selected}">
            <yk-image :src="url" width="196" height="200" :is-lazy="true" fit="contain"></yk-image>
            <yk-space class="file-item-img-tool" size="s">
                <IconDeleteOutline class="files-tool-delete" @click="deleteFile"/>
                <yk-popconfirm title="选择分组" placement="bottomRight" @cancel="cancel" @confirm="confirm">
                    <IconSwitchOutline class="files-tool-switch"/>
                    <template #content>
                        <yk-scrollbar ref="scrollbar" height="148px" class="subset">
                            <div v-for="item in subsetStore.data" class="subset-item" :class="{'subset-selected' :subsetSelectdId == item.id}" @click="changeOption(item.id)">
                                {{ item.subsetName }} {{ item.value }}
                            </div>
                        </yk-scrollbar>
                    </template>
                </yk-popconfirm>
            </yk-space>
            <div class="file-item-img-check" @click="checkFile">
                <IconTickMinOutline style="color:#fff;font-size:24px"/>
            </div>
        </div>
        <div class="file-item-name">
            <p class="file-item-name-file">{{ props.data?.fileName }}</p>
            <p>.{{ props.data?.fileFormat }}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { FileData } from '../../utils/interface';
import { useSubsetStore } from '../../store/subset';
import { baseImgPath } from '../../utils/env';
import './files.less';

//store
const subsetStore = useSubsetStore();

type FileItemProps = {
    data?:FileData
}

//filesItem组件内部通过props接收来自父组件files的data（父组件：:data="item" ；data就是FileItemProps类型的FileData类型的成员data）。
//访问由父组件传入的FileItemProps类型的FileData类型的成员data就使用props.data。
const props = withDefaults(defineProps<FileItemProps>(),{

})

const emits = defineEmits(['changeSubsetId','delete','selected']);

//图片路径
const url = computed(()=>{
    return baseImgPath + '/' + props.data?.URL;
});

//分类选择
const subsetSelectdId = ref<number|string>(props.data?.subsetID!);
//切换分组
const changeOption = (e:number|string)=>{
    subsetSelectdId.value = e;
}


//const proxy:any = getCurrentInstance()?.proxy;
function cancel(){
    //proxy.$message({type:'warning', message:'取消'});
}
function confirm(){
    //如果当前选择于之前不同时
    if(subsetSelectdId.value != props.data?.subsetID){
        let data = {
            id:props.data?.ID,
            subsetID:subsetSelectdId.value,
        }
        emits("changeSubsetId",data);
    }
    //proxy.$message({type:'primary', message:'确认'});
}

//删除
const deleteFile = ()=>{
    emits("delete", props.data?.ID, props.data?.URL);
}

//选择
const checkFile = ()=>{
    emits("selected", props.data?.ID);
}

</script>

<style lang="less" scoped>
    .file-item{
        &-img{
            position: relative;
            border-radius: @radius-s;
            border: 2px solid @bg-color-l;
            &-tool{
                position: absolute;
                right:@space-s;
                bottom:@space-s;
                opacity: 0;
                .yk-icon{
                    width:32px;
                    height: 32px;
                    padding: 8px;
                    background: rgba(255,255,255,0.56);
                    border-radius: @radius-m;
                    transition: all @animatb;
                    cursor: pointer;
                    &:hover{
                        color:@pcolor;
                        background: rgba(255,255,255,0.72);
                        backdrop-filter: blur(2px);
                    }
                }
            }
            &-check{
                width: 26px;
                height:26px;
                border-radius: @radius-s;
                background: @gray-4;
                position: absolute;
                left:@space-s;
                top:@space-s;
                cursor: pointer;
                border: 1px solid rgba(255,255,255,0.56);
                opacity: 0;
                .yk-icon{
                    opacity: 0;
                }
            }
            &:hover{
                background: @pcolor-1;
                .file-item-img-check{
                    opacity: 1;
                }
                .file-item-img-tool{
                    opacity: 1;
                }
            }
        }
        &-selected{
            background: @pcolor-1;
            border: 2px solid @pcolor-3;
            .file-item-img-check{
                opacity: 1;
                background: @pcolor;
                .yk-icon{
                    opacity: 1;
                }
            }
            .file-item-img-tool{
                opacity: 0;
            }

            &:hover{
                .file-item-img-tool{
                    opacity: 0;
                }
            }
        }
        &-name{
            padding-top: @space-l;
            display: flex;
            justify-content: center;
            &-file{
                text-align: center;
                overflow:hidden;
                display: -webkit-box;
                line-clamp: 1;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                text-overflow: ellipsis;
            }
        }
    }
</style>