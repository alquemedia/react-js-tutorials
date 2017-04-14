import { applyMiddleware, combineReducers, createStore } from "redux";
import axios from "axios";
import logger from "redux-logger";
import thunk from "redux-thunk";

const userReducer = (state={},action) => {
    switch (action.type ){
        case "CHANGE_NAME":
            state = {...state,name: action.payload};
            break;
        case "CHANGE_AGE":
            state = {...state,age: action.payload};
            break;
        case "PROVOKE_ERROR":
                throw new Error(action.payload);
            break;
    }
    return state;
};

const tweetsReducer = (state=[],actions) => {
    return state;
};

const reducers = combineReducers({
    user: userReducer,
    tweets: tweetsReducer
});


const error = (store) => (next) => (action) => {
    try {
        next(action);
    } catch (e){
        console.log("Oops!",e);
    }
};

const middleware = applyMiddleware(thunk,logger());

const store = createStore(reducers,{},middleware);

store.subscribe(()=>{
    console.log("Store changed",store.getState());
});

store.dispatch((dispatch)=>{
    dispatch({type:"FETCH_USERS_START"});
    axios.get("http://rest.learncode.academy/api/wstern/users")
        .then((response) => {
            dispatch({type:"FETCH_USERS_RECEIVED"});
        });
});