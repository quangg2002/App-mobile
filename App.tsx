import React, { useEffect, useState } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store/store';
import { Provider, useDispatch, useSelector, } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from './src/route/RootNavigation';
import Login from './src/screens/login/Login'
import Signup from './src/screens/signup/Signup'
import Banner from './src/screens/welcome/Banner';
import Welcome from './src/screens/welcome/Welcome';
import ChooseRole from './src/screens/signup/ChooseRole';
import Information from './src/screens/signup/Information';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { RootReducer } from './src/redux/store/reducer';
import HomeTab from './src/route/HomeTab';
import LoadingOverlay from './src/components/LoadingOverlay';
import { loadFonts } from '@/theme';
import CustomToast from '@/components/CustomToast';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { hideLoading, saveDeviceToken } from '@/redux/slice/authSlice';
import { BASE_API } from '@/services/BaseApi';
import { hideIncommingCall, showIncommingCall } from '@/redux/slice/chatSlice';
import IncomingCall from '@/screens/chat/IncomingCall';
import Toast from 'react-native-toast-message';

const Stack = createStackNavigator();

const authScreens = {
    Welcome: Welcome,
    Login: Login,
    Signup: Signup,
    ChooseRole: ChooseRole,
    Information: Information,
    HomeTab: HomeTab,
}

const EntryNavigation = () => {
    const { access_token, phoneNumber, deviceToken } = useSelector((state: RootReducer) => state.authReducer);
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(hideIncommingCall());
        const requestUserPermissions = async () => {
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL
            if (enabled) {
                console.log('Authorized status: ', authStatus);
            }
        };

        if (requestUserPermissions()) {
            messaging().getToken().then(token => { dispatch(saveDeviceToken(token)); console.log('devicetoken: ', token) })
        }
        else {
            console.log('Permission messaging not granted: ');
        };

        messaging().getInitialNotification().then(async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
            if (remoteMessage) {
                console.log('Notification caused app to open from quit state:', remoteMessage.notification)
            }
        });

        messaging().onNotificationOpenedApp(async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
            console.log('Notification caused app to oopen from background state: , ', remoteMessage.notification)
        })

        messaging().setBackgroundMessageHandler(async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
            Toast.show({
                type: 'notification',
                props: {
                    title: remoteMessage.notification.title,
                    content: remoteMessage.notification.body
                },
                autoHide: false
            })
        });

        messaging().onTokenRefresh(async (token) => {
            dispatch(saveDeviceToken(token));
        });
    }, []);

    useEffect(() => {
        phoneNumber && deviceToken && BASE_API.post(`/save-device-token`, {
            phoneNumber,
            deviceToken
        }).then(response => console.log(response.data)).catch(error => console.log(error.response))
    }, [phoneNumber, deviceToken]);

    return <>
        {access_token
            ? <HomeTab />
            : <Stack.Navigator screenOptions={{ headerShown: false }}>
                {Object.entries(authScreens).map(([name, component]) => (
                    <Stack.Screen key={name} name={name} component={component} />
                ))}
            </Stack.Navigator>
        }
    </>
};

const App = () => {
    const [showBanner, setShowBanner] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowBanner(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const preload = async () => {
        await Promise.all([loadFonts()]);
    }

    React.useEffect(() => {
        preload();
    }, []);

    return (
        <ActionSheetProvider>
            <Provider store={store}>
                <PersistGate persistor={persistor} loading={null}>
                    <NavigationContainer ref={navigationRef}>
                        <LoadingOverlay>
                            {showBanner ? <Banner /> : <EntryNavigation />}
                        </LoadingOverlay>
                        <CustomToast />
                        <IncomingCall />
                    </NavigationContainer>
                </PersistGate>
            </Provider>
        </ActionSheetProvider>
    );
};

export default App;