import { createAction, handleActions } from "redux-actions";
import createRequestSaga, {createRequestActionTypes} from "../lib/createRequestSaga";
import * as postsAPI from '../lib/api/posts';
import { takeLatest } from 'redux-saga/effects'

const INITIALIZE = 'write/INITIALIZE';
const CHANGE_FIELD = 'write/CHANGE_FIELD';

const [WRITE_POST, WRITE_POST_SUCCESS, WRITE_POST_FAILURE]
    = createRequestActionTypes('write/WRITE_POST');

export const initialize = createAction(INITIALIZE);
export const changeField = createAction(CHANGE_FIELD, ({key, value})=>({
    key, value
}));

export const writePost = createAction(WRITE_POST, ({title, content, tags})=>({
    title, content, tags
}));

//사가 생성
const writePostSaga = createRequestSaga(WRITE_POST, postsAPI.writePost);
export function* writeSaga(){
    yield takeLatest(WRITE_POST, writePostSaga);
}

const initialState = {
    title: '',
    content: '',
    tags: [],
    post: null,
    postError: null,
};

const write = handleActions({
    [INITIALIZE]: state => initialize, // initialState를 넣으면 초기 상태를 바뀜
    [CHANGE_FIELD]:(state, {payload: {key, value}})=>({
        ...state,
        [key]: value, //특정 key 값을 업데이트
    }),
    [WRITE_POST]: state => ({
        ...state,
        //post와 postError를 초기화
        post: null,
        postError: null,
    }),
    //포스트 작성 성공
    [WRITE_POST_SUCCESS]: (state, {payload: post})=>({
        ...state,
        post,
    }),
    //포스트 작성 실패
    [WRITE_POST_FAILURE]: (state, {payload: postError}) =>({
        ...state,
        postError,
    }),
    },
    initialState,
);
export default write;
