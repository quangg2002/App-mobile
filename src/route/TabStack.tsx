import React, { useLayoutEffect } from 'react';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from '../screens/welcome/Welcome';
import Banner from '../screens/welcome/Banner';
import { useDispatch, useSelector } from 'react-redux';
import { RootReducer } from '../redux/store/reducer';
import Messages from '../screens/chat/Messages';
import CallActionBox from '../screens/chat/CallActionBox';
import CallScreen from '../screens/chat/CallScreen';
import { hideTabBar, showTabBar } from '../redux/slice/authSlice';
import { Description, UploadCV, UploadCVSuccess } from '@/screens/Home';
import ChatScreen from '../screens/chat/ChatScreen';
import Setting from '../screens/setting/Setting';
import { Profile, AboutMeScreen, Experience, Education, Certification, Skill } from '../screens';
import Account from '../screens/setting/Account';
import UpdatePassword from '../screens/setting/UpdatePassword';
import Login from '../screens/login/Login';
import IncomingCall from '@/screens/chat/IncomingCall';
import JoinScreen from '@/screens/chat/JoinScreen';
import Notifications from '@/screens/chat/Notifications';
import NotificationDetail from '@/screens/chat/NotificationDetail';
import ProfileHandler from '@/screens/profile/ProfileHandler';
import Company from '@/screens/profile/Company';
import Test from '@/screens/chat/Test';
import VideoStream from '@/screens/chat/VideoStream';
import HomeScreen from '@/screens/Home/HomeScreen';
import SaveJob from '@/screens/Home/SaveJob';
import NoSave from '@/screens/Home/NoSave';
import SearchJob from '@/screens/Home/SearchJob';
import Filter from '@/screens/Home/Filter';
import AddJob from '@/screens/Home/AddJob';
import Companyq from '@/screens/Home/Companyq';
import AllJob from '@/screens/Home/AlllJob';
import FindJob from '@/screens/Home/FindJob';
import NoFind from '@/screens/Home/NoFind';


const homeScreenStack = {
    HomeScreen: HomeScreen,
    Description: Description,
    UploadCV: UploadCV,
    UploadCVSuccess: UploadCVSuccess,
    AllJob: AllJob
}

const chatScreenStack = {
    Messages: Messages,
    ChatScreen: ChatScreen,
    CallActionBox: CallActionBox,
    CallScreen: CallScreen,
    IncomingCall: IncomingCall,
    JoinScreen: JoinScreen,
    Setting: Setting,
    Test: Test,
    VideoStream: VideoStream
}

const pofileScreenStack = {
    ProfileHandler,
    AboutMeScreen,
    Experience,
    Education,
    Certification,
    Skill,
    Company,
    AddJob : AddJob,
    Companyq: Companyq
}

const settingScreenStack = {
    Setting: Setting,
    Account: Account,
    UpdatePassword: UpdatePassword,
    Login: Login,
    Notifications: Notifications,
    NotificationDetail: NotificationDetail,
    SaveJob: SaveJob,
    NoSave: NoSave,
    // SearchJob: SearchJob,
    // Filter: Filter
}

const settingBookmarkStack = {
    SearchJob: SearchJob,
    Filter: Filter,
    AllJob: AllJob,
    FindJob: FindJob,
    NoFind: NoFind
}

const Stack = createStackNavigator();

const HomeStack = ({ navigation, route }: any) => {
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        if (routeName === 'HomeScreen' || routeName === 'SearchJob' || routeName == undefined) {
            dispatch(showTabBar());
        } else {
            dispatch(hideTabBar());
        }
    }, [navigation, route]);

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            {Object.entries(homeScreenStack).map(([name, component]) => (
                <Stack.Screen key={name} name={name} component={component} />
            ))}
        </Stack.Navigator>
    );
};

const ChatStack = ({ navigation, route }: any) => {
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        if (routeName === 'Messages' || routeName == undefined) {
            dispatch(showTabBar());
        }
        else {
            dispatch(hideTabBar());
        }
    }, [navigation, route]);

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            {Object.entries(chatScreenStack).map(([name, component]) => (
                <Stack.Screen key={name} name={name} component={component} />
            ))}
        </Stack.Navigator>
    );

};


const ProfileStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            {Object.entries(pofileScreenStack).map(([name, component]) => (
                <Stack.Screen key={name} name={name} component={component} />
            ))}
        </Stack.Navigator>
    );
};

const SettingStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            {Object.entries(settingScreenStack).map(([name, component]) => (
                <Stack.Screen key={name} name={name} component={component} />
            ))}
        </Stack.Navigator>
    );
};

const BookmarkStack = ({ navigation, route }: any) => {

    const dispatch = useDispatch();

    useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        if (routeName === 'Filter' || routeName == undefined) {
            dispatch(hideTabBar());
        }
        else {
            dispatch(showTabBar());
        }
    }, [navigation, route]);


    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            {Object.entries(settingBookmarkStack).map(([name, component]) => (
                <Stack.Screen key={name} name={name} component={component} />
            ))}
        </Stack.Navigator>
    );
};
export { HomeStack, ChatStack, ProfileStack, SettingStack, BookmarkStack}