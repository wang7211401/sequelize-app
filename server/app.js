(async function() {
    const path = require('path');
    const Koa = require('koa');
    const session = require('koa-session');
    const staticCache = require('koa-static-cache');
    const KoaBodyParser = require('koa-bodyparser');
    const router = require('./routers/main');

    const app = new Koa();

    app.keys = ['some secret keys'];

    const CONFIG = {
        key: 'sec_int',
        maxAge: 86400000,
        autoCommit: true,
        overwrite: true,
        httpOnly: true,
        signed: true,
        rolling: false,
        renew: false,
    };

    app.use(session(CONFIG, app));

    app.use(staticCache(
        path.join(__dirname, 'public'), {
            maxAge: 365 * 24 * 60 * 60,
            gzip: true
        }));


    app.use(async(ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        await next()
    });

    app.use(KoaBodyParser());

    app.use(router.routes());

    app.listen(8080);
    console.log('监听成功')

})();