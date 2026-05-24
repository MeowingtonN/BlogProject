import { getCurrentInstance } from "vue";
import { deleteFileApi } from "../api";
import { useCode } from "./code";
import { useManagerStore } from "../store/managers";

const { tackleCode } = useCode();

const managerStore = useManagerStore();

export function useFile() {

    const proxy:any = getCurrentInstance()?.proxy;

    //删除文件
    const deleteFile = (data:{id:number|string; URL:string|string[]})=>{
        let request = {
            token: managerStore.token,
            filesID: data.id,
            filesURL: data.URL
        };
        deleteFileApi(request).then((res:any)=>{
            if(tackleCode(res.code, true)){
                proxy.$message({type:'primary', message:'删除完成'});
            }
        });
    }

    return {
        deleteFile
    };
}