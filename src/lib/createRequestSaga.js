import {call, put} from 'redux-saga/effects';
import {startLoading, finishLoading} from "../modules/loading";

export const createRequestActionTypes = type =>{
    const SUCCESS = `${type}_SUCCESS`;
    const FAILURE = `${type}_FAILURE`;
    return [type, SUCCESS, FAILURE];
}

export default function createRequestSaga(type, request){
    const SUCCESS = `${type}_SUCCESS`;
    const FAILURE = `${type}_FAILURE`;

    // console.log('api request',  request);
    return function*(action){
        yield put(startLoading(type));
        // console.log("^^^^^^^^^")
        try{
            const response = yield call(request, action.payload);
            console.log("response.data: ", response.data)
            yield put({
                type: SUCCESS,
                payload: response.data,
            });

        }catch(e){
            yield put({
                type: FAILURE,
                payload: e,
                error: true,
            });
        }
        yield put(finishLoading(type));
    };
}
