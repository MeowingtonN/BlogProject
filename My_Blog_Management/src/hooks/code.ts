import { useRouter } from "vue-router";
import { YkMessage } from "@yike-design/ui";

export function useCode(){
    const router = useRouter();
    //code验证
    const tackleCode = (e:number, isCheck:boolean = false)=>{
        if(e === 300){
            //未通过token验证
            //router.push('/login');
            if(isCheck){
                YkMessage({type:'warning', message:'是游客身份或处于只读模式，行为受限'});
                return false;
            }
            return true;
        }else if(e === 400){
            YkMessage({type:'error', message:'请求参数不正确'});
            return false;
        }else if(e === 401){
            router.push('/register');
            YkMessage({type:'warning', message:'无管理员，请注册管理员'});
            return false;
        }else if(e === 200){
            return true;
        }else{
            YkMessage({type:'error', message:'未知错误'});
            return false;
        }
    }
    return {
        tackleCode
    }
}