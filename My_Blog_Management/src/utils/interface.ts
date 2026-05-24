//回复内容
export type ReplyData = {
    //大小写敏感
    ID: number;
    article?: {
        id: number;
        title: string;
    };
    
    userID: string | number;
    userName: string;
    Content: string;    //内容
    Moment: string;     //时间
    Complaint: number;  //举报次数
    isRead: number;
};

//文章分组
export interface SubsetData {
    id: number | string;
    subsetName: string | number;
    value: number;
    moment?: Date;
}

//标签
export interface LabelData {
    ID: number | string;
    labelName: string | number;
    Moment?: Date;
}

//文件
export interface FileData {
    ID: number;
    URL: string;
    fileName: string;
    fileFormat: string;
    subsetID?: number;
    selected?: boolean;
    Moment?: Date
}

//文章
export interface ArticleData {
    ID: number;
    Title: string;
    subsetID: number;
    Moment: Date;//时间
    Label?: string;
    Introduce?: string;//简介
    coverURL?: string;//封面地址
    Views: number;//查看次数
    State: number;//状态0未发布，1已发布
    comment: number;
    praise: number;//点赞次数
    Content?:string;
}

//日记
export interface DiaryData {
    ID?: number;
    Title?: string;
    Moment?: Date;//时间
    weatherID:number;//天气
    Content?:string;
    Picture?:string;
}

//表单数据类型
export interface formDataType {
    Title?: string,
    subsetID?: number,
    Label?: string[], //标签
    Introduce?: string, //简介
    coverURL?: string,
    Classify?: number
}