<template>
    <yk-space size="m" class="reply">
        <yk-badge is-dot :hidden="props.content?.isRead == 1" v-if="isComment">
            <!-- props.content.ID是父组件传入的由查询数据库而得的ID。 -->
            <yk-avatar img-url="/src/assets/anonymous.webp" v-if="isComment" @click="changeIsRead(props.content!.ID)" />
        </yk-badge>
        <yk-space dir="vertical" size="s" class="reply-m">
            <div class="reply-name">
                <!-- 父组件将content传入本组件定义的props，本组件访问content时既可加props也可不加。 -->
                <yk-text strong>{{ content?.userName }}</yk-text>
                <yk-text type="third" style="font-size: 12px;">{{momentl(content?.Moment!)}}</yk-text>
            </div>
            <yk-text type="secondary">{{ content?.Content }}</yk-text>
            <yk-space size="s" align="center" v-if="isComment">
                <yk-tag type="primary" v-if="content?.article!.id! > -1">{{content?.article?.title}}</yk-tag>
                <yk-tag type="primary" v-else>作者留言</yk-tag>
                <yk-text type="danger" v-show="content?.Complaint! > 0">举报 {{content?.Complaint}}</yk-text>
            </yk-space>
            <IconDeleteOutline class="reply-m-delete" @click="deleteReply(props.content!.ID)"/>
        </yk-space>
    </yk-space>
</template>

<script lang="ts" setup>
import type { ReplyProps } from './reply';
import { momentl } from '../../utils/moment';

const props = withDefaults(defineProps<ReplyProps>(), {
    //父组件除了content还需传入isComment给本子组件。
    isComment: true,
});

const emits = defineEmits(["delete", "isread"]);

//删除
const deleteReply = (e:number)=>{
    emits("delete", e);
}
//已读
const changeIsRead = (e:number)=>{
    emits("isread", e);
}
</script>

<style lang="less" scoped>
    .reply{
        width: 100%;
        &-m{
            border-bottom: 1px solid @line-color-s;
            width: 100%;
            padding-bottom: @space-l;
            flex:1;
            position: relative;
            &-delete{
                position: absolute;
                right:0;
                top:0;
                width:16px;
                height:16px;
                cursor:pointer;
                color:@font-color-s;
                display: none;
            }
        }
        &-name{
            display: flex;
            flex-direction: column;

        }
        &:hover{
            .reply-m-delete{
                display: block;
            }
        }
    }
</style>
<style lang="less">
//修改小红点的位置
.reply{
    .yk-badge .yk-badge__dot.yk-badge__dot--danger {
        margin-top: 4px;
    }
}
</style>