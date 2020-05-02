const Router = require("koa-router")
const db = require('../model/db')
const router = new Router();
router.post('/login', async (ctx, next) => {
   let flag = false //设定flag表示是否存在用户
   let data = ctx.request.body
   let Reslt = await db('select * from user',[])
   for(let item of Reslt){
        if(item.username == data.name){
            flag=true
        }
    }
    if(flag){
        ctx.body={
            type:'error',
            message:'用户名存在'
        }
    }else{
        await db('insert into user(username,password,type) values(?,?,?)', [data.name,data.password,data.type=='超级管理员'?1:0])
        ctx.body={
            type:'success',
            message:'用户注册成功'
        }
        flag=false
    }
})
.post('/updatalogin',async (ctx)=>{
    let {id , name , password ,type} = ctx.request.body
    await db('UPDATE phone.user SET username=?,password=?,type=? where id=?',[name,password,type=='超级管理员'?1:0,id])
    ctx.body = {
        type:'success',
        message:'修改成功'
    }
})
.get('/login',async (ctx)=>{
    let data = ctx.request.query
    if(data.name==''){
        ctx.body={
            type:'error',
            message:'用户名不能为空！'
        }
    }else{
        let Reslt = await db('select * from user',[])
        for(let item of Reslt){         
            if(item.username == data.name && item.password == data.password){
                ctx.body={
                    type:'success',
                    message:'登录成功！'
                }
                return 
            }
            ctx.body={
                type:'error',
                message:'用户名或密码错误！'
            }
        }
    
        
    }
})
.get('/getuser',async (ctx)=>{
    let Reslt = await db('select * from user',[])
    ctx.body={
        type:true,
        data:Reslt
    }
})
.get('/userdelete',async(ctx)=>{
    let {id} = ctx.request.query
    try {
        await db('DELETE FROM phone.user where id=?',[id])
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