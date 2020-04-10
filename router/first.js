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

router.get('/lunbo', async (ctx, next) => { 
   let selectReslt = await db('select * from phonelist',[])
   // console.log(selectReslt)
   ctx.body=selectReslt
})
.get('/lunboselect', async (ctx) => {
   //根据ID获取数据库中的信息
   let data = await db('select * from phonelist where id=?',[ctx.request.query.id])
   if(data[0].tupian){
      let arr = data[0].tupian.split('|')
      let imageArr = []
      for(let item of arr){
         imageArr.push(`http://localhost:4000/${data[0].name}/${item}`)
      }
      data[0].tupian=imageArr
   }
   ctx.body = {
      data:data[0]
  }
})
.post('/lunboadd',upload.array('file'), async (ctx) => {
   // console.log(ctx.request.body )//上传过来的多图片
   let {name,changshang,jinjia,shoujia,kucun,date,title} = ctx.request.body
   let image = []
   for(var i=0;i<ctx.request.files.length;i++){
      image.push(ctx.request.files[i].filename)
   }
   image=image.join("|")
//    //数据库添加字段
    await db('insert into phonelist(name,jinjia,shoujia,tupian,kucun,changshang,jinhuoriqi,title) values(?,?,?,?,?,?,?,?)', [name,jinjia,shoujia,image,kucun,changshang,date,title])
   ctx.body = {
      message:'上传成功'
  }
})
.post('/lunboupdata',upload.single('file'), async (ctx) => {
   let data = await db('select name,url,urllink from lunbo where idlunbo=?',[ctx.request.body.id])
   let {name,urllink,id}=ctx.request.body
   //判断如果添加了新的图片就把老的图片删除
   if(ctx.request.file){
      if (fs.existsSync('public/lunbo/' + data[0].url)) {
         fs.unlinkSync('public/lunbo/' + data[0].url);
       }
      resda = await db('update lunbo set name=?,url=?,urllink=? where idlunbo=?',[name,ctx.request.file.filename,urllink,id])
   }else{
      resda = await db('update lunbo set name=?,urllink=? where idlunbo=?',[name,urllink,id])
   }
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