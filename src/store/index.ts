import ReduxThunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist';
import reducers from './reducers';
import AsyncStorage from '@react-native-community/async-storage';
import { offlineDataSyncherMiddleware } from '../shared/utilities/offlineDataSyncherMiddleware';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: [
        'auth',
        'localization',
        'route',
        'userProfile',
        'notification',
        'weather',
        'dof',
        'activityLog',
        'data',
    ],
};

const persitReduce = persistCombineReducers(persistConfig, { ...reducers });

export const store = createStore(
    persitReduce,
    undefined,
    applyMiddleware(ReduxThunk, offlineDataSyncherMiddleware)
);

export const persistor = persistStore(store);
