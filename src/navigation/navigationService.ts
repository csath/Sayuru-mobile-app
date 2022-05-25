import { NavigationActions, DrawerActions } from 'react-navigation';

let _navigator: any;

function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef;
}

function navigate(routeName, params) {
    _navigator.dispatch(
        NavigationActions.navigate({ routeName, params })
    );
}

function goBack() {
    _navigator.dispatch(NavigationActions.back());
}

function refresh(key, params) {
    _navigator.dispatch(
        NavigationActions.setParams({ key, params })
    );
}

function getCurrentRoute() {
    let route = _navigator.state.nav;
    while (route.routes) {
        route = route.routes[route.index];
    }
    return route;
}

function openDrawer() {
    _navigator.dispatch(
        DrawerActions.openDrawer()
    );
}

function closeDrawer() {
    _navigator.dispatch(
        DrawerActions.closeDrawer()
    );
}

function toggleDrawer() {
    _navigator.dispatch(
        DrawerActions.toggleDrawer()
    );
}

export default {
    navigate,
    setTopLevelNavigator,
    goBack,
    getCurrentRoute,
    refresh,
    openDrawer,
    closeDrawer,
    toggleDrawer
};