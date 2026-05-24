const fs = require('fs');
const path = require('path');
const fsp = require('fs').promises;

//删除真实文件
exports.deleteFiles = function(filesURL){
    if(typeof filesURL == 'string'){
        fs.unlink('data/files/'+filesURL, (err)=>{
            if(err) throw err;
        });
    }else{
        filesURL.map(function(val){
            fs.unlink('data/files/'+val, (err)=>{
                if(err) throw err;
            });
        });
    }
}

//计算文件夹大小
exports.getDirSize = async function(directory){
    let size = 0;
    async function calculateSize(dir) {
        for await (const d of await fsp.readdir(dir, {withFileTypes:true})){
            const currentPath = path.join(dir, d.name);
            if(d.isDirectory()){
                await calculateSize(currentPath);
            }else{
                size += (await fsp.stat(currentPath)).size;
            }
        }
    }
    await calculateSize(directory);
    return size;
}