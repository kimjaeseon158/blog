const Router = require('koa-router');
const controller = require('./controller');
const checkLoggedIn = require( '../../lib/checkLoggedIn')



const posts = new Router();
posts.get('/list', controller.list)
posts.post('/write', checkLoggedIn, controller.write)

const post = new Router();
post.get('/', controller.read);
post.delete('/', checkLoggedIn, controller.checkOwnPost, controller.delete);
post.patch('/', checkLoggedIn, controller.checkOwnPost, controller.update);

posts.use('/:id', controller.getPostById, post.routes());//

module.exports=posts;


