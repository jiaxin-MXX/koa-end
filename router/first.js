const Router = require("koa-router")
const db = require('../model/db')
const router = new Router();
router.get('/lunbo', async (ctx, next) => { 
   let selectReslt = await db('select * from lunbo',[])
   ctx.body=selectReslt
}).get('/showlunbo',async (ctx, next) => { 
   ctx.body='你好'
});
module.exports=router