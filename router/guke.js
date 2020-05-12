/*
 * @Description: 
 * @Autor: Decade Xin
 * @Date: 2020-05-08 14:05:43
 * @LastEditors: Decade Xin
 * @LastEditTime: 2020-05-12 13:50:42
 */
const Router = require("koa-router")
const db = require('../model/db')
const router = new Router();
router.post('/updataguke',async (ctx)=>{
    let {id , user , password ,phone,address} = ctx.request.body
    await db('UPDATE phone.guke SET user=?,password=?,phone=?,address=? where id=?',[user,password,phone,address,~~id])
    ctx.body = {
        type:'success',
        message:'修改成功'
    }
})
.get('/gukeselect',async(ctx,next)=>{
    let {keyword}=ctx.request.query
    let res = await db('SELECT * from phone.guke WHERE concat(user,address) LIKE ?',[`%${keyword}%`])
    ctx.body={
        message:'查询成功',
        data:res
    }
})
.get('/gukeselect2',async(ctx,next)=>{
    let {keyword}=ctx.request.query
    let res = await db('SELECT * from phone.guke WHERE concat(user) LIKE ?',[`%${keyword}%`])
    ctx.body={
        message:'查询成功',
        data:res
    }
})
.post('/gukeregister', async (ctx, next) => {
    let flag = false //设定flag表示是否存在用户
    let data = ctx.request.body
    let Reslt = await db('select * from guke',[])
    for(let item of Reslt){
         if(item.user == data.name){
             flag=true
         }
     }
     if(flag){
         ctx.body={
             type:'error',
             message:'用户名存在'
         }
     }else{
         await db('insert into guke(user,password,phone,address) values(?,?,?,?)', [data.name,data.password,data.phone,data.address])
         ctx.body={
             type:'success',
             message:'用户注册成功'
         }
         flag=false
     }
 })
.get('/getguke',async (ctx)=>{
    let {current,pagesize} = ctx.request.query
    let Reslt = await db('SELECT * FROM phone.guke limit ?,?;',[(current-1)*pagesize,~~pagesize])
    let Total = await db('SELECT COUNT(*) FROM phone.guke',[])
    ctx.body={
        data:Reslt,
        total:Total[0]['COUNT(*)']
    }
})
.get('/gukedelete',async(ctx)=>{
    let {id} = ctx.request.query
    try {
        await db('DELETE FROM phone.guke where id=?',[id])
        ctx.body = {
           type:true
        }
     } catch (error) {
        ctx.body = {
           type:false
        }
     }
})

module.exports=router