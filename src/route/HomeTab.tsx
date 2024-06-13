import React from 'react';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BookmarkStack, ChatStack, HomeStack, ProfileStack, SettingStack } from './TabStack';
import { Entypo } from '@expo/vector-icons';
import { orange, placeholderTextColor } from '../styles/styles';
import { Feather } from '@expo/vector-icons';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { RootReducer } from '../redux/store/reducer';

const Tab = createBottomTabNavigator();

const HomeTab = () => {

    const { showTabBar } = useSelector((state: RootReducer) => state.authReducer);

    const iconSize = 22;

    const TabItems = [
        {
            name: 'Tab1',
            component: HomeStack,
            icon: <Entypo name="home" size={iconSize} />,
        },
        {
            name: 'Tab2',
            component: ProfileStack,
            icon: <FontAwesome name="id-card" size={iconSize} color="black" />,
        },
        {
            name: 'Tab3',
            component: ChatStack,
            icon: <Entypo name="chat" size={iconSize} color="black" />,
        },
        {
            name: 'Tab4',
            component: BookmarkStack,
            icon: <MaterialCommunityIcons name="clipboard-search" size={iconSize} color="black" />
        },
        {
            name: 'Tab5',
            component: SettingStack,
            icon: <FontAwesome name="user" size={iconSize} color="black" />,
        },
    ];

    return (
        <Tab.Navigator>
            {TabItems.map((item) => (
                <Tab.Screen
                    key={item.name}
                    name={item.name}
                    component={item.component}
                    options={({ route }) => ({
                        headerShown: false,
                        tabBarIcon: ({ color, size, focused }) => {
                            return React.cloneElement(item.icon, {
                                color: focused ? orange : placeholderTextColor,
                            });
                        },
                        tabBarLabel: () => null,
                        tabBarStyle: {
                            height: 60,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            display: showTabBar ? 'flex' : 'none',
                        }
                    })}
                />
            ))}
        </Tab.Navigator>
    );
};

export default HomeTab;