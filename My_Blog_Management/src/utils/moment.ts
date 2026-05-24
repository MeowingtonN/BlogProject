export const momentm = (date:Date)=>{
    var d = new Date(date);
    var Y = d.getFullYear();
    var M:string|number = d.getMonth() + 1;
    var D:string|number = d.getDate();
    if(M < 10){
        M = '0' + M;
    }
    if(D < 10){
        D = '0' + D;
    }
    var times = Y + '-' + M + '-' + D;
    return times;
}

export const momentl = (date:string|number|Date)=>{
    var time;
    var d = new Date(date);
    var n = new Date();
    //获取时间戳
    var dd = d.getTime();
    var h:number|string = d.getHours();
    var m:number|string = d.getMinutes();
    var Y = d.getFullYear();
    var M:number|string = d.getMonth() + 1;
    var D:number|string = d.getDate();
    //现在时间
    var nn = n.getTime();
    var YY = n.getFullYear();
    var MM = n.getMonth() + 1;
    var DD = n.getDate();

    if((nn - dd) < 120 * 1000){
        time = '刚刚';
        return time;
    }else if(120 * 1000 < (nn - dd) && (nn - dd) <= 60 * 60 * 1000){
        time = Math.ceil((nn - dd) / 60 / 1000) + '分钟前';
        return time;
    }else if(60 * 60 * 1000 < (nn - dd) && D == DD && M == MM && Y == YY){
        if(m < 10){
            m = '0' + m;
        }
        time = h + ":" + m;
        return time;
    }else if(Y == YY){
        if(M < 10){
            M = '0' + M;
        }
        if(D < 10){
            D = '0' + D;
        }
        if(h < 10){
            h = '0' + h;
        }
        if(m < 10){
            m = '0' + m;
        }
        time = M + '/' + D + ' ' + h + ':' + m;
        return time;
    }else{
        if(M < 10){
            M = '0' + M;
        }
        if(D < 10){
            D = '0' + D;
        }
        if(h < 10){
            h = '0' + h;
        }
        if(m < 10){
            m = '0' + m;
        }
        time = Y + '/' + M + '/' + D + ' ' + h + ':' + m;
        return time;
    }
}

//时间hh:mm:ss
export const timeCalculate = (date:string|number|Date)=>{
    var d = new Date(date);
    var h:string|number = d.getHours();
    var m:string|number = d.getMinutes();
    var s:string|number = d.getSeconds();
    if(h < 10){
        h = '0' + h;
    }
    if(m < 10){
        m = '0' + m;
    }
    if(s < 10){
        s = '0' + s;
    }
    var moment = h + ':' + m + ':' + s;
    return moment;
}