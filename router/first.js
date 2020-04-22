const Router = require("koa-router")
const db = require('../model/db')
const upload = require('../utils/file')
const router = new Router();
const fs = require('fs');


function deleteall(path) {
	var files = [];
	if(fs.existsSync(path)) {
		files = fs.readdirSync(path);
		files.forEach(function(file, index) {
			var curPath = path + "/" + file;
			if(fs.statSync(curPath).isDirectory()) { // recurse
				deleteall(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
};

var copy = function( src, dst ){
   // 读取目录中的所有文件/目录
   let stat = fs.stat;
   fs.readdir( src, function( err, paths ){
       if( err ){
           throw err;
       }
 
       paths.forEach(function( path ){
           var _src = src + '/' + path,
               _dst = dst + '/' + path,
               readable, writable;      
 
           stat( _src, function( err, st ){
               if( err ){
                   throw err;
               }
 
               // 判断是否为文件
               if( st.isFile() ){
                   // 创建读取流
                   readable = fs.createReadStream( _src );
                   // 创建写入流
                   writable = fs.createWriteStream( _dst ); 
                   // 通过管道来传输流
                   readable.pipe( writable );
               }
               // 如果是目录则递归调用自身
               else if( st.isDirectory() ){
                   exists( _src, _dst, copy );
               }
           });
       });
   });
};

router.get('/lunbo', async (ctx, next) => { 
   let {mess,page,pageSize} = ctx.request.query
   let selectReslt
   if(mess == 'all'){
      selectReslt = await db('select * from phonelist limit ?,?',[page-1,~~pageSize])
   }else{
      selectReslt = await db('select * from phonelist where changshang=? limit ?,?',[mess,page-1,~~pageSize])
   }
   ctx.body=selectReslt
})
.get('/lunboselect', async (ctx) => {
   //根据ID获取数据库中的信息
   let data = await db('select * from phonelist where id=?',[ctx.request.query.id])
   if(data[0].tupian){
      let arr = data[0].tupian.split('|')
      let imageArr = []
      for(let item of arr){
         imageArr.push(`http://localhost:4000/${data[0].firstname}/${item}`)
      }
      data[0].tupian=imageArr
   }
   ctx.body = {
      data:data[0]
  }
})
.post('/lunboadd',upload.array('file'), async (ctx) => {
   // console.log(ctx.request.body )//上传过来的多图片
   let {name,changshang,jinjia,shoujia,kucun,date,title,xiangqing} = ctx.request.body
   let image = []
   for(var i=0;i<ctx.request.files.length;i++){
      image.push(ctx.request.files[i].filename)
   }
   image=image.join("|")
//    //数据库添加字段
    await db('insert into phonelist(name,jinjia,shoujia,tupian,kucun,changshang,jinhuoriqi,title,xiangqing,firstname) values(?,?,?,?,?,?,?,?,?,?)', [name,jinjia,shoujia,image,kucun,changshang,date,title,xiangqing,name])
   ctx.body = {
      message:'上传成功'
  }
})
.post('/lunboupdata',upload.array('file'), async (ctx) => {
   let {id,name,changshang,jinjia,shoujia,kucun,date,title,delet,xiangqing} = ctx.request.body
   let data = await db('select tupian,name from phonelist where id=?',[id])

   //图片修改
   let deleteImage = delet.split('|')
   let image = data[0].tupian.split('|')
   //删除标记被删除的图片
   // console.log(fs.existsSync(`public/${data[0].name}/` + deleteImage[i]))
   // console.log(deleteImage)
   if(deleteImage[0]){
      for(let i=0;i<deleteImage.length;i++){
         if (await fs.existsSync(`public/${data[0].name}/`+deleteImage[i])) {
            fs.unlinkSync(`public/${data[0].name}/`+deleteImage[i]);
          }
         image.splice(image.indexOf(deleteImage[i]), 1);
      }
   }
  
   for(var i=0;i<ctx.request.files.length;i++){
      image.push(ctx.request.files[i].filename)
   }
   image=image.join("|")
   // 复制图片，删除文件夹
   // if(data[0].name!=name){
   //    await copy(`public/${data[0].name}`,`public/${name}`)
   //    setTimeout(function(){
   //       deleteall(`public/${data[0].name}`)
   //    },3000)
   //    // 
   // }
   await db('update phonelist set name=?,jinjia=?,shoujia=?,tupian=?,kucun=?,changshang=?,jinhuoriqi=?,title=?,xiangqing=? where id=?',[name,jinjia,shoujia,image,kucun,changshang,date,title,xiangqing,id])
   ctx.body = {
      message:'修改成功'
  }
})
.get('/lunbodelete',async (ctx) => {
   let {id,name} = ctx.request.query
   deleteall(`public/${name}`)
   // let data = await db('select url from lunbo where idlunbo=?',[ctx.request.query.id])
   // // let data = await db('delete from lunbo where idlunbo',[ctx.request.query.id])
   // if(data[0]){//判断数据库内是否存在图片
   //    //判断图片是否在public路径下存在
   //    if (fs.existsSync('public/lunbo/' + data[0].url)) {
   //       d=fs.unlinkSync('public/lunbo/' + data[0].url);
   //    }
   // }
   try {
      await db('delete from phonelist where id=?',[id])
      ctx.body = {
         type:true
      }
   } catch (error) {
      ctx.body = {
         type:false
      }
   }

});
module.exports=router