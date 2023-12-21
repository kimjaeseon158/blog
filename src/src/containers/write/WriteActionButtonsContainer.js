import React, { useEffect } from "react";
import WriteActionButtons from "../../components/write/WriteActionButtons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { writePost } from "../../modules/write";

const WriteActionButtonsContainer=()=>{
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {title, content, tags, post, postError} = useSelector(({write})=>({
        title: write.title,
        content: write.content,
        tags: write.tags,
        post: write.post,
        postError: write.postError,
    }));

    // 포스트 등록
    const onPublish = () =>{
        dispatch(
            writePost({
                title,
                content,
                tags,
            }),
        );
    };

    //취소
    const onCancel = () =>{
        navigate(-1);
    };

    // 성공 혹은 실패 시 할 작업
    useEffect(()=>{
        // console.log("....", post)
        if(post){
            const {_id, user } = post;
            navigate(`/@${user.username}/${_id}`);
        }
        if(postError){
            console.log(postError);
        }
    }, [navigate, post, postError]);
    return <WriteActionButtons onPublish={onPublish} onCancel={onCancel}/>
};
export default WriteActionButtonsContainer;

