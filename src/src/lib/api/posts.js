import client from './client';

export const writePost = ({title, content, tags}) =>
    client.post('/post/write', {title, content, tags});

export const readPost = id => client.get(`/post/${id}`);
