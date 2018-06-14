const Koa = require('koa');
// 路由
const Router = require('koa-router');
// 模版引擎
const views = require('koa-views');
//获得post请求的数据中间件
const bodyParser = require('koa-bodyparser');
// 静态文件
const static = require('koa-static');const app = new Koa();
//实力化路由
const router = new Router();
// 指定模版引擎的文件格式和路径
app.use(views('views', {
    extension: 'ejs'
}));
// 获取post请求的数据 ctx.request.body;
app.use(bodyParser());

app.use(static(__dirname+'/static'));
//匹配路由之前执行 可以配置公共信息
app.use(async (ctx, next) => {
    ctx.state.userinfo = '张三';
    //当前路由匹配完成之后继续匹配理由
    await next();
});
//配置路由
router
    .get('/', async (ctx, next) => {
        let title = 'hello';
        await ctx.render('index', {
            title: title
        });
    })
    .get('/login', async (ctx) => {
        console.log('123');
        await ctx.render('login');
    })
    .get('/new', async (ctx) => {
        let arr = [11, 22, 33, 44];
        let content = '<h3>这是h2</h3>'
        let type = 1;
        await ctx.render('news', {
            list: arr,
            content: content,
            type: type

        });
    });
router.post('/doAdd', async (ctx) => {
    console.log(ctx.request.body);
    // 获取表单提交的数据 ctx.request.body;
    ctx.body = ctx.request.body;
});

app.use(router.routes())  //启动路由
    .use(router.allowedMethods());  // 官方推荐的可不配置

//监听 3000端口
app.listen(3000);
