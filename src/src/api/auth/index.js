const Router = require('koa-router');
const controller = require("./controller")

const auth = new Router();

auth.post('/register', controller.register);
auth.post("/login", controller.login);
auth.get('/check', controller.check);
auth.post('/logout', controller.logout)

module.exports=auth;

