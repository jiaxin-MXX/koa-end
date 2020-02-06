const Koa = require('koa');
const static = require('koa-static')
const path = require('path')
const Router = require("koa-router");
const firstRouter = require('./router/first')
const bodyParser = require('koa-bodyparser')
const router = new Router();
const app = new Koa();

app.use(bodyParser())
app.use(
    static(path.join(__dirname , './public'))
)

router.use(firstRouter.routes())


app.use(router.routes())
app.listen(4000);