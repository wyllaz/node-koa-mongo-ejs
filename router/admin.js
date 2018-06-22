var router = require('koa-router')();
//配置路由
router.get('/',async(ctx)=>{
        ctx.body = '<h1>首页管理001</h1>';
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
module.exports = router;