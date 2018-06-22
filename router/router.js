const Koa = require('koa');
const router = require('koa-router')();
const app = new Koa();


//应用及中间件  匹配任何路由之前都会先执行 可以配置公共信息
app.use(async(ctx,next)=>{
    console.log(new Date());
    ctx.state.userinfo = '张三';
    await next(); //当前路由匹配完成之后继续匹配路由
});



//配置路由
router.get('/',async(ctx)=>{
        ctx.body = '<h1>首页</h1>';
    })
    // 路由级别的中间件     匹配之后继续匹配
router.get('/new',async(ctx,next)=>{
        console.log('这是一个新闻');
        await next();
    })
router.get('/new',async(ctx)=>{
        ctx.body = '<h1>新闻</h1>';
    })
router.get('/new1',async(ctx)=>{
        console.log(ctx.query);  // 获取get 的传值对象 { name: '1', age: '18' }
        ctx.body = '<h1>新闻详情</h1>';
    })
    // 动态路由
router.get('/new2/:aid',async(ctx)=>{
        console.log(ctx.params);  // 获取get 的传值对象 { name: '1', age: '18' }
        ctx.body = '<h1>新闻详情</h1>';
    })

    // 错误处理中间件
    app.use(async(ctx,next)=>{
    console.log('这是一个中间件');
    next();
    //去匹配其他路由，匹配完成之后再执行下面的代码
    if(ctx.status == 404){
        ctx.status = 404;
        ctx.body='这是一个404页面';
    }else{
       console.log(ctx.url);
    }
    });
app.use(router.routes());
app.use(router.allowedMethods());  // 建议配置，可以不配置

app.listen(3002);