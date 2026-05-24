import { ref, getCurrentInstance, onMounted } from "vue";
import { timeCalculate } from '../utils/moment';
import { createArticleApi, updateArticleApi, articleApi, changeArticleStateApi, deleteArticleApi, gainArticleApi } from "../api";
import { useCode } from "./code";
import { useRouter } from "vue-router";
import { useManagerStore } from "../store/managers";
import type { ArticleData } from "../utils/interface";

const { tackleCode } = useCode();

const managerStore = useManagerStore();

export function useArticle() {

    const proxy: any = getCurrentInstance()?.proxy;

    //文章ID，ID存在则更新而非新建
    const _id = ref<number>();

    const isSave = ref<boolean>(false);

    //收取form内容
    const formDatas = ref();
    const formData = (e: any) => {
        formDatas.value = e;
    }

    //收取editor内容
    const editorDatas = ref();
    const editorData = (e: any) => {
        editorDatas.value = e;
    }

    //保存时间
    const saveMoment = ref();

    const router = useRouter();

    //图库：收取cover封面
    const cover = ref();
    const coverData = (e:any)=>{
        //console.log(e);
        cover.value = e;
    }

    //保存/发布
    const submit = (e: number) => {
        if (formDatas.value && formDatas.value.Title && !_id.value) {
            if (e == 0) {
                let nowTime = new Date();
                saveMoment.value = timeCalculate(nowTime);
                isSave.value = true;
            }
            let value = {
                ...formDatas.value,
                ...{
                    Content: editorDatas.value,
                    State: e,
                    Moment: new Date(),
                }
            };
            if(cover.value){
                value.coverURL = cover.value;
            }
            let request = {
                token: managerStore.token,
                value
            };
            //console.log(request);
            createArticleApi(request).then((res: any) => {
                if (tackleCode(res.code, true)) {
                    if (e == 0) {
                        _id.value = res.data;
                        proxy.$message({ type: 'primary', message: '保存成功' });
                    } else if (e == 1) {
                        proxy.$message({ type: 'primary', message: '发布成功' });
                        router.push('/');
                    }
                }
            });
        } else if (_id.value) {
            //存在_id说明已经保存过，更新
            if (e == 0) {
                let nowTime = new Date();
                saveMoment.value = timeCalculate(nowTime);
                isSave.value = true;
            }
            let value = {
                ...formDatas.value,
                ...{
                    Content: editorDatas.value,
                    State: e,
                }
            };
            if(cover.value){
                value.coverURL = cover.value;
            }
            let request = {
                token: managerStore.token,
                articleID: _id.value,
                value
            };
            updateArticleApi(request).then((res: any) => {
                if (tackleCode(res.code, true)) {
                    //前端数组静态删除
                    if (e == 0) {
                        proxy.$message({ type: 'primary', message: '保存成功' });
                    } else if (e == 1) {
                        proxy.$message({ type: 'primary', message: '发布成功' });
                        router.push('/');
                    }
                }
            });
        } else {
            proxy.$message({ type: 'warning', message: '请输入标题' });
        }
    }

    //获取文章列表
    const articleList = ref<ArticleData[]>([]);
    //文章总数
    const count = ref<number>(0);

    const getData = (req: any) => {
        articleApi(req).then((res: any) => {
            if (tackleCode(res.code)) {
                if (req.count) {
                    count.value = res.data.count;
                }
                articleList.value = [...res.data.result];
            }
            //console.log(req);
            //console.log(articleList.value);
        });
    }

    //修改文章发布状态
    const updateState = (e: { id: number, state: number }):Promise<void> => {
        const request = {
            token: managerStore.token,
            articleID: e.id,
            state: e.state
        };
        return changeArticleStateApi(request).then((res: any) => {
            if (tackleCode(res.code, true)) {
                articleList.value.filter((i: { ID: number; State: number }) => {
                    if (i.ID == e.id) {
                        i.State = e.state;
                        if (e.state === 1) {
                            proxy.$message({ type: 'primary', message: '发布成功' });
                        } else {
                            proxy.$message({ type: 'primary', message: '已撤回' });
                        }
                    }
                });
            }
        });
    }

    //删除文章
    const deleteArticle = (id: number): Promise<void> => {
        const request = {
            token: managerStore.token,
            articleID: id
        };
        return deleteArticleApi(request).then((res: any) => {
            if (tackleCode(res.code, true)) {
                // articleList.value = articleList.value.filter((obj: any) => {
                //     return obj.ID !== id;
                // });
                //console.log(articleList.value)
                proxy.$message({ type: 'primary', message: '删除成功' });
            }
        });
        //手动刷新
        //location.reload();
    }

    //获取文章详情
    const defaultArticle = ref();
    const gainArticle = ()=>{
        let request = {
            token: managerStore.token,
            articleID: _id.value
        };
        gainArticleApi(request).then((res:any)=>{
            //console.log(res);
            if(tackleCode(res.code)){
                let content = res.data.Content;
                let cover = res.data.coverURL;
                let filterResData = res.data;
                delete filterResData.ID;
                delete filterResData.Views;
                delete filterResData.Moment;
                delete filterResData.Content;
                delete filterResData.State;
                if(filterResData.Label){
                    filterResData.Label = filterResData.Label.split(',');
                }

                defaultArticle.value = {content, filterResData, cover};
            }
        });
    }

    onMounted(()=>{
        if(_id.value){
            gainArticle();  //路由到此则先立即执行
            //console.log(defaultArticle);
        }
    });

    return {
        isSave,
        saveMoment,
        articleList,
        count,
        _id,
        defaultArticle,
        formData,
        editorData,
        submit,
        getData,
        updateState,
        deleteArticle,
        coverData
    };
}