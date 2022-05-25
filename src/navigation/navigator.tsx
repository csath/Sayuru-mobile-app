import React from 'react';
import { Image, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { TabBar, TabItem } from '../shared/components/sayuru-customized';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import SignupScreen from '../modules/auth/screens/sign-up.screen';
import IntroScreen from '../modules/onboarding/screens/intro.screen';
import LocationsMainScreen from '../modules/locations/screens/locations-main.screen';
import LocationsJourneyScreen from '../modules/routes/screens/locations-journey.screen';
import colors from '../shared/styles/colors';
import HomeScreen from '../modules/home/screens/home.screen';
import DOFServicesScreen from '../modules/dof-services/screens/dof-services.screen';
import UserProfileScreen from '../modules/user-profile/screens/user-profile.screen';
import AlertScreen from '../modules/alerts/screens/alerts.screen';
import images from '../assets';
import SplashScreen from '../modules/splash-screen/screens/splash.screen';
import SwitchLangScreen from '../modules/switch-language/screens/switch-lang.screen';
import VerifyMobileNumScreen from '../modules/auth/screens/verify-mobile-num.screen';
import OtherZonesScreen from '../modules/home/screens/other-zones.screen';
import RoutesMainScreen from '../modules/home/screens/routes-main.screen';
import RouteDetailsScreen from '../modules/home/screens/route-details.screen';
import localize from '../localization/translations';
import { store } from '../store';
// import FuelCalculatorScreen from '../modules/fuel-calculator/screens/fuel-calculator.screen';
// import SignInScreen from '../modules/auth/screens/sign-in.screen';
// import ForcastScreen from '../modules/home/screens/forcast.screen';

const OnboardingStack = createStackNavigator(
    {
        Onboarding: IntroScreen,
        SwitchLang: SwitchLangScreen,
    },
    {
        initialRouteName: 'SwitchLang',
        headerMode: 'none'
    }
);

const AuthStack = createStackNavigator(
    {
        // SignIn: SignInScreen,
        SignUp: SignupScreen,
        VerifyMobileNum: VerifyMobileNumScreen
    },
    {
        initialRouteName: 'VerifyMobileNum',
        headerMode: 'none'
    }
);

const LocationStack = createStackNavigator(
    {
        LocationsMain: LocationsMainScreen,
    },
    {
        initialRouteName: 'LocationsMain',
        headerMode: 'none'
    }
);

const RoutesStack = createStackNavigator(
    {
        // RoutesMain: RoutesMainScreen,
        // RouteDetails: RouteDetailsScreen,
        LocationsJourney: LocationsJourneyScreen,
    },
    {
        initialRouteName: 'LocationsJourney',
        headerMode: 'none'
    }
);

const HomeStack = createStackNavigator(
    {
        HomeScreen: HomeScreen,
        // ForcastScreen: ForcastScreen,
        // FuelCalculator: FuelCalculatorScreen,
        DOFServices: DOFServicesScreen,
        OtherZones: OtherZonesScreen,
        RoutesMain: RoutesMainScreen,
        RouteDetails: RouteDetailsScreen,
    },
    {
        initialRouteName: 'HomeScreen',
        headerMode: 'none'
    }
)

const TabsVerifiedUserStack = createBottomTabNavigator({
    Tab_home: HomeStack,
    Tab_routes: RoutesStack,
    Tab_location: LocationStack,
    Tab_alerts: AlertScreen,
    Tab_profile: UserProfileScreen
}, {
    initialRouteName: 'Tab_home',
    tabBarComponent: props => {
        const { color, activeColor, inactiveColor } = getColors(props.navigation.state.index, props.navigation.state.routes);
        return (
            <TabBar
                color={color}
                activeColor={activeColor}
                inactiveColor={inactiveColor}
                useSayuruDefaults
            >
                <TabItem
                    onPress={() => props.navigation.navigate('Tab_home')}
                    active={props.navigation.state.index === 0}
                    useSayuruDefaults
                >
                    <Image
                        source={props.navigation.state.index === 0 ? images.tabbar_home_active : images.tabbar_home_inactive}
                        resizeMode="contain"
                        tintColor={props.navigation.state.index === 0 ? activeColor: inactiveColor}

                    />
                    <Text>{localize.tabBar.HOME}</Text>
                </TabItem>
                <TabItem
                    onPress={() => props.navigation.navigate('Tab_routes')}
                    active={props.navigation.state.index === 1}
                    useSayuruDefaults
                    disabled={!(store.getState().auth.isPremiumAccount || !store.getState().auth.isPremiumAccount && store.getState().auth.remainingFreeTrialDays > 0)}
                >
                    <Image
                        source={props.navigation.state.index === 1 ? images.tabbar_routes_active : images.tabbar_routes_inactive}
                        resizeMode="contain"
                        tintColor={props.navigation.state.index === 1 ? activeColor: inactiveColor}
                    />
                    <Text>{localize.tabBar.ROUTES}</Text>
                </TabItem>
                <TabItem
                    onPress={() => props.navigation.navigate('Tab_location')}
                    active={props.navigation.state.index === 2}
                    useSayuruDefaults
                    disabled={!(store.getState().auth.isPremiumAccount || !store.getState().auth.isPremiumAccount && store.getState().auth.remainingFreeTrialDays > 0)}
                >
                    <Image
                        source={props.navigation.state.index === 2 ? images.tabbar_location_active : images.tabbar_location_inactive}
                        resizeMode="contain"
                        tintColor={props.navigation.state.index === 2 ? activeColor : inactiveColor}
                    />
                    <Text>{localize.tabBar.LOCATION}</Text>
                </TabItem>
                <TabItem
                    onPress={() => props.navigation.navigate('Tab_alerts')}
                    active={props.navigation.state.index === 3}
                    useSayuruDefaults
                >
                    <Image
                        source={props.navigation.state.index === 3 ? images.tabbar_alerts_active : images.tabbar_alerts_inactive}
                        resizeMode="contain"
                        tintColor={props.navigation.state.index === 3 ? activeColor : inactiveColor}
                    />
                    <Text>{localize.tabBar.ALERTS}</Text>
                </TabItem>
                <TabItem
                    onPress={() => props.navigation.navigate('Tab_profile')}
                    active={props.navigation.state.index === 4}
                    useSayuruDefaults
                >
                    <Image
                        source={props.navigation.state.index === 4 ? images.tabbar_profile_active : images.tabbar_profile_inactive}
                        resizeMode="contain"
                        tintColor={props.navigation.state.index === 4 ? activeColor : inactiveColor}
                    />
                    <Text>{localize.tabBar.PROFILE}</Text>
                </TabItem>
            </TabBar >
        );
    },
    navigationOptions: {
        headerShown: false,
    }
})

const VerifiedUserStack = createStackNavigator(
    {
        TabsVerifiedUser: TabsVerifiedUserStack,
        // FuelCalculator: FuelCalculatorScreen
    },
    {
        initialRouteName: 'TabsVerifiedUser',
        headerMode: 'none'
    }
);

const SwitchStack = createSwitchNavigator(
    {
        Splash: SplashScreen,
        OnboardStack: OnboardingStack,
        Auth: AuthStack,
        VerifiedUser: VerifiedUserStack
    },
    {
        initialRouteName: 'Splash',
    }
);

const Navigator = createAppContainer(SwitchStack);

export default Navigator;


const getColors = (index, routes = []) => {
    let color = colors.primary_background;
    let activeColor = colors.dark_grey;
    let inactiveColor = colors.grey_1;

    if (index == 0 && routes[index]?.routes[routes[index]?.routes?.length - 1].routeName == "ForcastScreen") {
        color = colors.primary;
        activeColor = colors.white;
        inactiveColor = colors.tab_icon_inactive;
    }
    else if (index == 0 && routes[index]?.routes[routes[index]?.routes?.length - 1].routeName == "OtherZones") {
        color = colors.primary;
        activeColor = colors.white;
        inactiveColor = colors.tab_icon_inactive;
    }
    else if (index == 0 && routes[index]?.routes[routes[index]?.routes?.length - 1].routeName == "RoutesMain") {
        color = colors.primary;
        activeColor = colors.white;
        inactiveColor = colors.tab_icon_inactive;
    }
    else if (index == 0 && routes[index]?.routes[routes[index]?.routes?.length - 1].routeName == "RouteDetails") {
        color = colors.primary;
        activeColor = colors.white;
        inactiveColor = colors.tab_icon_inactive;
    }
    else if (index == 1 || index == 2) {
        color = colors.primary;
        activeColor = colors.white;
        inactiveColor = colors.tab_icon_inactive;
    }
    else if (index == 4) {
        color = colors.white;
        activeColor = colors.black
    }

    return ({
        color,
        activeColor,
        inactiveColor,
    })
}