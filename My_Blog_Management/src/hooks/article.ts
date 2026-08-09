import { ref, getCurrentInstance, onMounted } from "vue";
import { timeCalculate } from '../utils/moment';
import { deleteFileByURLApi, createArticleApi, updateArticleApi, articleApi, getArticleAuthorApi, changeArticleStateApi, deleteArticleApi, gainArticleApi } from "../api";
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
    const submit = async (e: number, isAutoSave: boolean = false) => {
        if(isAutoSave && (!formDatas.value.Title || formDatas.value.Title.length == 0)){
            formDatas.value.Title = "草稿";
        }
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
                    managerID: managerStore.id
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
            await createArticleApi(request).then((res: any) => {
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
            await updateArticleApi(request).then((res: any) => {
                if (tackleCode(res.code, true)) {
                    if (e == 0) {
                        proxy.$message({ type: 'primary', message: '保存成功' });
                    } else if (e == 1) {
                        proxy.$message({ type: 'primary', message: '发布成功' });
                        router.push('/');
                    }
                }
            });
        } else if(!isAutoSave) {
            proxy.$message({ type: 'warning', message: '请输入标题' });
        }
    }

    //获取文章列表
    const articleList = ref<ArticleData[]>([]);
    //获取文章作者列表
    const articleAuthorList = ref<{id:number, name:string}[]>([]);
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
            
            if(articleList.value.length <= 0) return;
            const idArray = articleList.value.map(item => item.ID);
            let getAuthorReq = {
                token: managerStore.token,
                articleIDArrayString: idArray.join(',')
            }
            getArticleAuthorApi(getAuthorReq).then((res:any)=>{
                articleAuthorList.value = res.data;
                //console.log(articleAuthorList);
            });
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
    // const deleteArticle = (id: number): Promise<void> => {
    //     const request = {
    //         token: managerStore.token,
    //         articleID: id
    //     };
    //     return deleteArticleApi(request).then((res: any) => {
    //         if (tackleCode(res.code, true)) {
    //             // articleList.value = articleList.value.filter((obj: any) => {
    //             //     return obj.ID !== id;
    //             // });
    //             //console.log(articleList.value)
    //             proxy.$message({ type: 'primary', message: '删除成功' });
    //         }
    //     });
    //     //手动刷新
    //     //location.reload();
    // }

    // 修改后的 deleteArticle 函数（使用 async/await）
    const deleteArticle = async (id: number): Promise<void> => {
        // 1. 获取文章详情，提取 Content
        let content = '';
        try {
            gainArticleApi({
                token: managerStore.token,
                managerID: managerStore.id,
                articleID: id
            }).then((res: any)=>{
                if(tackleCode(res.code, true)){
                    content = res.data.Content || '';
                    // 2. 提取图片 src（文件名加单引号）
                    const srcs = extractImageSrcs(content); // 返回格式如 ["'image1.jpg'", "'image2.png'"]

                    //console.log(content);

                    // 3. 如果有图片，先删除图片
                    if (srcs.length > 0) {
                        try {
                            const request = {
                                token: managerStore.token,
                                filesURL: srcs
                            };
                            deleteFileByURLApi(request);
                            // 可选：删除成功后提示
                            // proxy.$message({ type: 'success', message: `已删除 ${srcs.length} 张图片` });
                        } catch (error) {
                            console.error('删除图片失败:', srcs, error);
                            // 根据业务需要：可抛出错误阻止文章删除，或仅警告并继续
                            // 此处选择抛出错误，确保图片清理完成
                            proxy.$message({ type: 'error', message: '删除图片失败，文章删除已取消' });
                            throw error;
                        }
                    }
                }else {
                    // 获取内容失败，可提示并中止删除（或根据业务决定是否继续）
                    proxy.$message({ type: 'error', message: '获取文章内容失败，无法清理图片' });
                    throw new Error('获取文章内容失败');
                }
            });
        } catch (error) {
            console.error('获取文章内容出错:', error);
            throw error; // 终止删除流程
        }

        // 4. 删除文章
        const request = {
            token: managerStore.token,
            articleID: id
        };
        try {
            await deleteArticleApi(request);
            proxy.$message({ type: 'primary', message: '删除成功' });
            // 若需要更新列表，可取消注释：
            // articleList.value = articleList.value.filter((obj: any) => obj.ID !== id);
        } catch (error) {
            console.error('删除文章失败:', error);
            proxy.$message({ type: 'error', message: '删除文章失败' });
            throw error;
        }
    };

    // 从 HTML 字符串中提取所有 <img> 的 src 属性
    const extractImageSrcs = (html: string): string[] => {
        const div = document.createElement('div');
        div.innerHTML = html;
        const imgs = div.querySelectorAll('img');
        return Array.from(imgs)
        .map(img => img.getAttribute('src'))
        .filter((src): src is string => !!src)
        .map(src => src.substring(src.lastIndexOf('/') + 1))
        .map(name => `'${name}'`);
    };

    //获取文章详情
    const defaultArticle = ref();
    const gainArticle = ()=>{
        let request = {
            token: managerStore.token,
            managerID: managerStore.id,
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
        editorDatas,
        articleAuthorList,
        formData,
        editorData,
        submit,
        getData,
        updateState,
        deleteArticle,
        coverData
    };
}