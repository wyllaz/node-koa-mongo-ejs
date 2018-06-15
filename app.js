const Koa = require('koa');
// 路由
const Router = require('koa-router');
// 模版引擎
const views = require('koa-views');
//获得post请求的数据中间件
const bodyParser = require('koa-bodyparser');
// 静态文件
const static = require('koa-static');

// 比ejs更快的一种引擎
const render = require('koa-art-template');
const path = require('path');
// session
const session = require('koa-session');

// 连接数据库
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'koa';
MongoClient.connect(url,function(err,client){
    if(err){
        console.log(err);
        return;
    }
    assert.equal(null,err);
    console.log('connect success');
    const db = client.db(dbName);
    // user表增加一条数据
    db.collection('user').insertOne({"name":"测试连接数据库","age":20,"sex":"女","phone":"177"});
    client.close(); /** 关闭连接*/
})


const app = new Koa();
//实力化路由
const router = new Router();
//配置 session 中间件
app.keys = ['some secret hurr']; //cookie的签名
const CONFIG = {
    key: 'koa:sess', // 默认
    maxAge: 86400000, /** 过期时间 【需要修改】*/
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: true, /** 每次访问是否重新设置session 【需要修改】*/
    renew: false, /** 请求快过期的时候重新设置session 【需要修改】*/
};
app.use(session(CONFIG, app));




// koa-art-template 指定路径和文件后缀
// render(app, {
//     root: path.join(__dirname,'/views'),
//     extname: '.html',
//     debug: process.env.NODE_ENV !== 'production' //是否开启调试模式
// });

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
        // 获取session
        console.log(ctx.session.userinfo);
        //设置cookie（name,value,[option]）option 属性查具体文档
        // cookie 里面的value不能直接用中文 需要转化成base64
        let userName = new Buffer('张三').toString('base64');
        ctx.cookies.set('user',userName,{
                maxAge: 60*1000*24 //过期时间多少毫秒之后
        }
        )
        await ctx.render('index', {
            title: title
        });
    })
    .get('/sign', async (ctx, next) => {
        let title = '王英';
        await ctx.render('sign', {
            title: title
        });
    })
    .get('/login', async (ctx) => {
        // 获取cookie,把base64转化中文
        var data = ctx.cookies.get('user');
        var userName = new Buffer(data,'base64').toString();
        //设置session
        ctx.session.userinfo = '张三session';
        await ctx.render('login',{
            cookieName: userName
        });
    })
    .get('/new', async (ctx) => {
        let arr = [11, 22, 33, 44];
        let content = '<h3>这是h2</h3>'
        let type = 1;
        console.log("new:"+ctx.session.userinfo);
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
