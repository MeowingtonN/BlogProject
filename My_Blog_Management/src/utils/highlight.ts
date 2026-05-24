//搜索时关键字高亮提示。
export const highlightKeyword = (text:string, keyword?:string)=>{
    if(!keyword) return text;
    const regex = new RegExp(keyword, 'gi');
    const match = text.match(regex);
    if(!match) return text;
    return text.replace(regex, match => `<span class="highlight">${match}</span>`);
}