import {
    createNavigationContainerRef,
    StackActions,
    TabActions,
    useNavigation
} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<any>();

function navigate(name: string, params: any = {}) {
    if (navigationRef.isReady()) {
        // Perform navigation if the react navigation is ready to handle actions
        navigationRef.navigate(name, params);
    } else {
        // You can decide what to do if react navigation is not ready
        // You can ignore this, or add these actions to a queue you can call later
    }
}

function push(name: string, params: any = {}) {
    if (navigationRef.isReady()) {
        // Perform navigation if the react navigation is ready to handle actions
        navigationRef.dispatch(StackActions.push(name, params));
    } else {
        // You can decide what to do if react navigation is not ready
        // You can ignore this, or add these actions to a queue you can call later
    }
}

function pop(count?: number) {
    if (navigationRef.isReady()) {
        // Perform navigation if the react navigation is ready to handle actions
        navigationRef.dispatch(StackActions.pop(count));
    } else {
        // You can decide what to do if react navigation is not ready
        // You can ignore this, or add these actions to a queue you can call later
    }
}

function popToTop() {
    if (navigationRef.isReady()) {
        // Perform navigation if the react navigation is ready to handle actions
        navigationRef.dispatch(StackActions.popToTop());
    } else {
        // You can decide what to do if react navigation is not ready
        // You can ignore this, or add these actions to a queue you can call later
    }
}

function jumpToTab(name: string, params: any = {}) {
    if (navigationRef.isReady()) {
        // Perform navigation if the react navigation is ready to handle actions
        navigationRef.dispatch(TabActions.jumpTo(name, params));
    } else {
        // You can decide what to do if react navigation is not ready
        // You can ignore this, or add these actions to a queue you can call later
    }
}

function setOptions(options: any) {
    const navigation = useNavigation();
    navigation.setOptions(options);
}

const RootNavigation = {
    navigate,
    pop,
    popToTop,
    push,
    jumpToTab,
    setOptions
};

export default RootNavigation;
