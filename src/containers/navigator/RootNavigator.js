import React from 'react';
import {createSwitchNavigator} from 'react-navigation';
import {createDrawerNavigator, DrawerActions} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';
import {Image, TouchableNativeFeedback, View} from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import Register from '../screens/Register';
import VerificationOTP from '../screens/VerificationOTP';
import AppColors from '../../globals/ColorConstants';
import globalStyles from '../../globals/GlobalStyles';
import HomeScreen from '../screens/Home/HomeScreen';
import F8Touchable from '../../utils/F8Touchable';
//import Sidebar from '../../components/Sidebar';
import DrawerScreen from '../../components/DrawerScreen';
import AuthLoading from '../../AuthLoading';

const MenuItem = ({navigation}) => {
    if (!navigation.state.isDrawerOpen) {
        return <Image source={require('../../assets/images/menu-button.png')}/>
    } else {
        return <Image source={require('../../assets/images/left-arrow.png')}/>
    }

}

const RootStack = createStackNavigator({
        Home: HomeScreen
    },
    {
        initialRouteName: 'Home',
        navigationOptions: ({navigation}) => ({
            title: "Home Cleaner",
            headerLeft:
                <F8Touchable
                    background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
                    onPress={() => {
                        navigation.dispatch(DrawerActions.toggleDrawer())
                    }}>
                    <View style={{marginLeft: 20}}>
                        <MenuItem navigation={navigation}/>
                    </View>
                </F8Touchable>
            ,
            headerTintColor: AppColors.HEADER_TINT_COLOR,
            headerStyle: globalStyles.headerStyle
        })
    }
);


export const HomeRoot = createDrawerNavigator({
        Home: {
            screen: RootStack
        }
    }, {
        initialRouteName: 'Home',
        contentComponent: DrawerScreen,
        drawerWidth: 260,
        drawerPosition: 'left',
        contentOptions: {
            activeTintColor: '#fff'
        }
    }
)


/*export const HomeRoot = createStackNavigator(
    {
        Home: HomeScreen
    }, {
        initialRouteName: 'Home',
        headerMode: 'none'
    }
)*/

export const LoginRoot = createStackNavigator(
    {
        Login: LoginScreen,
        Register: Register,
        VerificationOTP: VerificationOTP,
    }, {
        initialRouteName: 'Login',
        headerMode: 'none'
    }
)

export const MainRoot = createSwitchNavigator({
    AuthLoading: AuthLoading,
    LoginStack: LoginRoot,
    Home: HomeRoot
})
