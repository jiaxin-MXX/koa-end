const Router = require("koa-router")
const db = require('../model/db')
const upload = require('../utils/file')
const router = new Router();
const fs = require('fs');
router.get('/lunbo', async (ctx, next) => { 
   let selectReslt = await db('select * from lunbo',[])
   for(var i=0;i<selectReslt.length;i++){
      selectReslt[i].url="http://localhost:4000/lunbo/"+selectReslt[i].url
   }
   // console.log(selectReslt)
   ctx.body=selectReslt
})
.get('/lunboselect', async (ctx) => {
   //根据ID获取数据库中的信息
   // console.log(ctx.request.query.id)
   let data = await db('select name,url,urllink from lunbo where idlunbo=?',[ctx.request.query.id])
   data[0].url="http://localhost:4000/lunbo/"+data[0].url
   // console.log(data[0])
   ctx.body = {
      data:data[0]
  }
})
.post('/lunboadd',upload.single('file'), async (ctx) => {
   const files = ctx.req; //上传过来的文件
   // console.log(ctx.request.file,ctx.request.body)
   //数据库添加字段
   await db('insert into lunbo(name,url,urllink) values(?,?,?)', [ctx.request.body.name,ctx.request.file.filename,ctx.request.body.urllink])
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
   let data = await db('select url from lunbo where idlunbo=?',[ctx.request.query.id])
   // let data = await db('delete from lunbo where idlunbo',[ctx.request.query.id])
   if(data[0]){//判断数据库内是否存在图片
      //判断图片是否在public路径下存在
      if (fs.existsSync('public/lunbo/' + data[0].url)) {
         d=fs.unlinkSync('public/lunbo/' + data[0].url);
      }
   }
   await db('delete from lunbo where idlunbo=?',[ctx.request.query.id])
   ctx.body = {
      message:'删除成功'
  }
});
module.exports=router