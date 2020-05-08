const Koa = require('koa');
const static = require('koa-static')
const path = require('path')
const Router = require("koa-router");
const bodyParser = require('koa-bodyparser')
const firstRouter = require('./router/first')
const loginRouter = require('./router/login')
const orderRouter = require('./router/order')
const gukeRouter = require('./router/guke')


const router = new Router();
const app = new Koa();

app.use(bodyParser())
app.use(
    static(path.join(__dirname , './public'))
)

router.use(firstRouter.routes())
router.use(loginRouter.routes())
router.use(orderRouter.routes())
router.use(gukeRouter.routes())


app.use(router.routes())
app.listen(4000);