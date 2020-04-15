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


module.exports=router