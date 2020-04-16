const Router = require("koa-router")
const db = require('../model/db')
const router = new Router();

router.get('/getorder', async (ctx, next) => {
    let {page,pagesize} = ctx.request.query
    let Reslt = await db('SELECT * FROM phone.order limit ?,?;',[(page-1)*pagesize,~~pagesize])
    let Total = await db('SELECT COUNT(*) FROM phone.order',[])
    ctx.body={
        data:Reslt,
        tota:Total[0]['COUNT(*)']
    }
})
.get('/orderdelete',async (ctx,next)=>{
    let {id} = ctx.request.query
    try {
        await db('DELETE FROM phone.order where id=?',[id])
        ctx.body = {
           type:true
        }
     } catch (error) {
        ctx.body = {
           type:false
        }
     }
})
.post('/orderChange',async(ctx,next)=>{
    let {id , form} = ctx.request.body
    await db('UPDATE phone.order SET user=?,phone=?,address=?,product=?,count=?,oneprice=?,allprice=?,shijian=? where id=?',[form.name,form.phone,form.address,form.product,form.count,form.oneprice,form.allprice,form.time,id])
    ctx.body = {
        message:'修改成功'
    }
})


module.exports=router