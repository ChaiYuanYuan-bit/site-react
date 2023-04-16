import {configureStore} from '@reduxjs/toolkit'
import userInfo from './UserInfo'
import message from './Notification'
import storageSession from 'redux-persist/lib/storage/session'
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';

// combineReducers合并reducer
const reducers = combineReducers({
    userInfo,message
  });

const persistConfig = {
    key: 'root',
    storage:storageSession,
    blacklistL:['message']
};
  
const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk],
  });

export default store