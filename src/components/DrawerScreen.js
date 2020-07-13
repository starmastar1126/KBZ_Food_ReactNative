import React, {Component} from 'react';
import {Dimensions, FlatList, Image, ImageBackground, Text, View} from 'react-native';
import { NavigationActions, DrawerActions} from 'react-navigation';
import AppColors from '../globals/ColorConstants';
import Ripple from 'react-native-material-ripple';
import HeliconiaView from "../containers/screens/HeliconiaView";
import AppConstants from '../globals/AppConstants';

const {height, width} = Dimensions.get("screen");

const routes = [
    {name: "Dashboard", route: 'home', image: require('../assets/images/ic_menu_home.png'), selected: true},
    {name: "Your Request", route: 'your_request', image: require('../assets/images/ic_menu_request.png'), selected: false},
    {name: "My Profile", route: 'my_profile', image: require('../assets/images/ic_menu__my_account.png'), selected: false},
    {name: "Logout", route: 'logout', image: require('../assets/images/ic_menu_signout.png'), selected: false}
];

class DrawerScreen extends Component {

    renderItem = (item) => {
        return (<MenuItem item={item.item} style={{paddingLeft: 10, paddingBottom: 3, paddingTop: 3}} navigation={this.props.navigation}/>)
    }

    render() {
        return (
            <View style={{
                justifyContent: 'center',
                flex: 1,
                flexDirection: 'column',
                backgroundColor: AppColors.APP_TINT_COLORS
            }}>
                <ImageBackground source={require("../assets/images/img-bg-drawer.png")}
                                 style={{height: 150, alignItems: 'center', justifyContent: 'center'}}>
                    <Image
                        style={{width: 160, height: 160 * 0.54}}
                        source={require("../assets/images/app_logo.png")}/>
                </ImageBackground>

                {/*<View style={{backgroundColor: 'rgba(255,255,255,0.80)', height: 1, width: '100%'}}/>*/}
                <FlatList
                    data={routes}
                    renderItem={this.renderItem}
                    keyExtractor={(item, key) => key.toString()}
                />
                {/*<MenuItem
                    navigation={this.props.navigation}
                    style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 5 }}
                    item={
                        { name: "Logout", route: 'logout', image: require('../assets/images/ic_menu_signout.png'), selected: false }
                    } />*/}
                <HeliconiaView
                    darkTheme={false}
                    showLink={false}
                    showWithLove={false}
                />

            </View>
        )
    }

}

class MenuItem extends React.Component {

    constructor(props) {
        super(props);
    }

    navigateToScreen = (route) => () => {
        setTimeout(() => {
            const navigateAction = NavigationActions.navigate({
                routeName: route
            });
            this.props.navigation.dispatch(navigateAction);
            this.props.navigation.dispatch(DrawerActions.closeDrawer())
        }, AppConstants.DEFAULT_TOUCH_DELAY);
    }

    render() {
        return (
            <Ripple onPress={this.navigateToScreen(this.props.item.route)}>
                <View style={[this.props.style, {
                    flexDirection: 'row',
                    alignItems: 'center'
                }, this.props.item.selected ? {backgroundColor: 'rgba(0,0,0,0.10)'} : null]}>
                    <Image style={{width: 32, height: 32, marginLeft: 10, marginRight: 15}} source={this.props.item.image}/>
                    <Text style={{
                        height: 55,
                        alignContent: 'center',
                        fontSize: 16,
                        color: '#fff',
                        textAlignVertical: 'center'
                    }}>{this.props.item.name}</Text>
                </View>
            </Ripple>
        );
        // 
    }
}


// DrawerScreen.propTypes = {
//     navigation: PropTypes.object
// };

export default DrawerScreen;
