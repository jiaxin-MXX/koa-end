/*
 * @Description: 
 * @Autor: Decade Xin
 * @Date: 2020-04-15 10:22:26
 * @LastEditors: Decade Xin
 * @LastEditTime: 2020-05-12 15:03:06
 */
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
        message:'修改成功',
        type:true
    }
})
.get('/orderselect',async(ctx,next)=>{
    let {keyword}=ctx.request.query
    let res = await db('SELECT * from phone.order WHERE concat(user,product) LIKE ?',[`%${keyword}%`])
    ctx.body={
        message:'查询成功',
        data:res
    }
})
.post('/orderadd',async(ctx,next)=>{
    let {user,time,data}=ctx.request.body
    console.log(ctx.request.data)
    for(let item of data){
        await db('insert into phone.order(user,phone,address,product,count,oneprice,allprice,shijian) values(?,?,?,?,?,?,?,?)', [user.user,user.phone,user.address,item.name,item.count,item.price,item.count*item.price,time])
    }
    ctx.body={
        message:'success',
    }
})


module.exports=router