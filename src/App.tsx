import React, { useEffect } from 'react';
import 'react-native-get-random-values';
import * as RNIap from 'react-native-iap';
import NetInfo from "@react-native-community/netinfo";
import { PersistGate } from 'redux-persist/integration/react';
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import MapboxGL from '@react-native-mapbox-gl/maps';
import { Provider } from 'react-redux';
import { store, persistor } from './store';
import AppNavigator from "./navigation/navigator";
import navigationService from './navigation/navigationService';
import { IS_INTERNET_CONNECTED, SET_ZONES } from './store/types';
import { runBackgroundSyncer } from './shared/utilities/offlineDataSyncherMiddleware';
import { handleBackgroundfMsgs, listenToTopics } from '../src/shared/utilities/network-communication/push/util/notification-get-token';
import * as SERVICES from './services/all.service';
import { MapBox_Token } from '../configs';
import './shared/utilities/geofencingUtil';

MapboxGL.setAccessToken(
  MapBox_Token,
);
MapboxGL.setTelemetryEnabled(false);

handleBackgroundfMsgs();

const App: React.FC = () => {
  useEffect(() => {
    return NetInfo.addEventListener((state) => {
      store.dispatch({ type: IS_INTERNET_CONNECTED, payload: state.isConnected });

      if (state.isConnected) {
        runBackgroundSyncer();

        if (!store.getState().data?.hasDataFetched) {
          SERVICES.getZones()?.then(res => {
            if (res?.data?.isSuccess) {
              store.dispatch({
                type: SET_ZONES,
                payload: res?.data?.data
              })
            }
          }).catch(() => { })
        }

        if (!store.getState().notification?.isPushConfigured) {
          listenToTopics(store.getState().userProfile?.zones?.map((e: any) => e.id), true);
        }
      }
    });
  }, [])

  useEffect(() => {
    RNIap.initConnection();

    const removeConn = () => {
      RNIap.endConnection()
    }
    return () => removeConn();
  }, [])

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ActionSheetProvider>
          <AppNavigator ref={navigatorRef => {
            navigationService.setTopLevelNavigator(navigatorRef);
          }} />
        </ActionSheetProvider>
      </PersistGate>
    </Provider>

  );
};

export default App;
