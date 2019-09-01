const KoaRouter = require('koa-router');
const Sequelize = require('sequelize');
const md5 = require('md5');
const Models = require('../models');
const router = new KoaRouter();

router.get('/api/', async ctx => {

    let page = ctx.query.page || 1;
    let prepage = parseInt(ctx.query.prepage) || 2;

    let offset = (page - 1) * prepage;

    let rs = await Models.Contents.findAndCountAll({
        limit: prepage,
        offset,
        include: {
            model: Models.Users
        }
    });

    ctx.body = {
        code: 0,
        count: rs.count,
        prepage,
        data: rs.rows.map(d => {
            return {
                id: d.id,
                title: d.title,
                content: d.content,
                user_id: d.user_id,
                username: d.User.username,
                created_at: d.createdAt,
                like_count: d.like_count,
                comment_count: d.comment_count
            }
        })
    }
})

router.post('/api/register', async ctx => {
    let username = ctx.request.body.username.trim();
    let password = ctx.request.body.password;
    let repassword = ctx.request.body.repassword;

    if (username == "" || password == "" || repassword == "") {
        return ctx.body = {
            code: 1,
            data: '',
            msg: '用户名或密码不能为空'
        }
    }

    if (password != repassword) {
        return ctx.body = {
            code: 1,
            data: '',
            msg: '两次输入的密码不一致'
        }
    }

    let user = await Models.Users.findOne({
        where: {
            username
        }
    });

    if (user !== null) {
        return ctx.body = {
            code: 1,
            data: '',
            msg: '当前用户名已经被注册了'
        }
    }

    let newUser = await Models.Users.build({
        username,
        password: md5(password)
    }).save();

    ctx.body = {
        code: 0,
        msg: '注册成功',
        data: {
            id: newUser.get('id'),
            username: newUser.get('username')
        }
    }
});

router.post('/api/login', async ctx => {
    let username = ctx.request.body.username.trim();
    let password = ctx.request.body.password;

    if (username == "" || password == "") {
        return ctx.body = {
            code: 1,
            data: '',
            msg: '用户名或密码不能为空'
        }
    }


    let user = await Models.Users.findOne({
        where: {
            username
        }
    });

    if (user === null) {
        return ctx.body = {
            code: 1,
            data: '',
            msg: '用户名不存在或密码错误'
        }
    }
    if (user.get('password') !== md5(password)) {
        return ctx.body = {
            code: 1,
            data: '',
            msg: '用户名不存在或密码错误'
        }
    }

    // ctx.cookies.set('username', user.get('username'), {
    //     httpOnly: false
    // })

    ctx.session.uid = user.get('id')
    ctx.session.user = user.get('username');

    ctx.body = {
        code: 0,
        msg: '登录成功',
        data: {
            id: user.get('id'),
            username: user.get('username')
        }
    }
})

router.post('/api/getUser', async ctx => {
    if (ctx.session.user) {
        ctx.body = {
            code: 0,
            data: {
                username: ctx.session.user
            }
        }
    } else {
        ctx.body = {
            code: 1,
            data: {
                username: ''
            }
        }
    }
})

router.post('/api/like', async ctx => {
    let contentId = ctx.request.body.content_id;

    let uid = ctx.session.uid

    if (!uid) {
        return ctx.body = {
            code: 1,
            msg: '请先登录后再操作！',
            data: ''
        }
    }

    let content = await Models.Contents.findOne({
        where: {
            id: contentId
        }
    });

    if (!content) {
        return ctx.body = {
            code: 2,
            msg: '找不到对应的数据'
        }
    }

    let like = await Models.Likes.findOne({
        where: {
            [Sequelize.Op.and]: [
                { 'content_id': contentId },
                { 'user_id': uid }
            ]
        }
    });

    if (like) {
        content.set('like_count', content.get('like_count') - 1);
        await content.save();
        await Models.Likes.destroy({
            where: {
                [Sequelize.Op.and]: [
                    { 'content_id': contentId },
                    { 'user_id': uid }
                ]
            }
        });

        return ctx.body = {
            code: 0,
            msg: '取消点赞成功',
            data: content
        }
    }

    content.set('like_count', content.get('like_count') + 1);
    await content.save();

    await Models.Likes.build({
        content_id: contentId,
        user_id: uid
    }).save()

    ctx.body = {
        code: 0,
        msg: '点赞成功',
        data: content
    }

});

router.post('/api/reply', async ctx => {
    let content = ctx.request.body.content;
    let contentId = ctx.request.body.content_id;

    let uid = ctx.session.uid

    if (!uid) {
        return ctx.body = {
            code: 1,
            msg: '请先登录后再操作！',
            data: ''
        }
    }

    await Models.Comments.build({
        content_id: contentId,
        user_id: uid,
        content
    }).save()

    let replyContent = await Models.Contents.findOne({
        where: {
            id: contentId
        }
    });

    replyContent.set('comment_count', replyContent.get('comment_count') + 1);

    await replyContent.save();

    ctx.body = {
        code: 0,
        msg: '评论成功',
        data: ''
    }

});

router.post('/api/logout', async ctx => {
    ctx.session = null;
    ctx.body = {
        code: 0,
        msg: '已退出登录',
        data: ""
    };
})
module.exports = router