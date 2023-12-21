const Post = require("../../model/post");
const mongoose = require("mongoose");
const Joi = require('joi');

const { ObjectId } = mongoose.Types;

exports.checkOwnPost = async (ctx, next)=>{
    const { user, post} = ctx.state;
    if(post.user._id.toString() !== user._id){
        ctx.status = 403;
        return;
    }
    return next();
}

exports.getPostById = async (ctx, next) =>{
    const {id} =ctx.params;
    if(!ObjectId.isValid(id)){
        ctx.status=400; //Bad Request
        return;
    }
    try{
        const post = await Post.findById(id);
        if(!post){
            ctx.status = 404;
            return;
        }
        ctx.state.post = post;
        return next();
    }catch (e) {
        ctx.throw(500, e)
    }
};

exports.write = async ctx => {
    const schema = Joi.object().keys({
        title: Joi.string().required(),
        content: Joi.string().required(),
        tags: Joi.array()
            .items(Joi.string())
            .required(),
    });
    const result = schema.validate(ctx.request.body);
    if(result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }
    const { title, content, tags } =ctx.request.body;
    const post = new Post({
        title,
        content,
        tags,
        user: ctx.state.user,
    });
    try{
        await post.save();
        ctx.body = post;
    }catch (e){
        ctx.throw(500, e);
    }
};

//get
exports.list = async ctx => {
    const page = parseInt(ctx.query.page || '1', 10);
    if(page<1){
        ctx.status=400;
        return;
    }
    const { tag, username } = ctx.query;
    const query = {
        ...(username ? {'user.username': username}:{}),
        ...(tag ? {tags: tag}: {}),
    };
    try{
        const posts = await Post.find(query)
            .sort({_id:-1})
            .skip((page-1)*10)
            .lean() //json type으로 전환
            .limit(10)
            .exec();
        const postCount = await Post.countDocuments(query).exec();
        ctx.set("Last-Page", Math.ceil(postCount/10));
        ctx.body = posts
            // .map(post => post.toJSON())
            .map(post => ({
                ...post,
                content:
                post.content.length<200 ? post.content: `${post.content.slice(0, 200)}...`,
            }));
    }catch (e){
        ctx.throw(500, e);
    }
}

// get
exports.read = async ctx => {
    ctx.body = ctx.state.post;
};

//delete
exports.delete = async ctx => {
    const {id} = ctx.params;
    try {
        await Post.deleteOne({id}).exec();
        ctx.status = 204;
    }catch(e){
        ctx.throw(500, e);
    }
};

exports.update = async ctx => {
    const schema = Joi.object().keys({
        title: Joi.string().required(),
        content: Joi.string().required(),
        tags: Joi.array()
            .items(Joi.string())
            .required(),
    });
    const result = schema.validate(ctx.request.body);
    if(result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }
    const { title, content, tags } =ctx.request.body;
    try{
        const post = await Post.updateOne(
            {title, content, tags}
        ).exec();
        if(!post){
            ctx.status = 404;
            return;
        }
        ctx.body={title, content, tags};
    }catch (e){
        ctx.throw(500, e);
    }
};

