import React, {Component} from 'react';
import {ActivityIndicator, Dimensions, NetInfo, View} from 'react-native'
//import NetInfo from "@react-native-community/netinfo";
import {connect} from 'react-redux';
import {MainRoot} from "./containers/navigator/RootNavigator";
import SplashScreen from 'react-native-splash-screen'
import AppContant from './globals/AppConstants';
import {action_LoadingIndicator, action_NetworkStatus, action_Odoo_Response} from './redux/action';
import * as globals from './globals/globals';
import Odoo from 'react-native-odoo-promise-based'

const {height, width} = Dimensions.get("window");

let subscriptionNetInfo;
let TAG = "AppRoot";
let reTryCounter = 0;
let MAX_RETRY_COUNTER = 5;

let odoo = new Odoo({
    host: AppContant.Odoo.host,
    port: AppContant.Odoo.port, /* Defaults to 80 if not specified */
    database: AppContant.Odoo.database,
    username: AppContant.Odoo.username, /* Optional if using a stored session_id */
    password: AppContant.Odoo.password, /* Optional if using a stored session_id */
    sid: AppContant.Odoo.sid, /* Optional if using username/password */
    protocol: AppContant.Odoo.protocol /* Defaults to http if not specified */
})

class AppRoot extends Component {

    constructor(props) {
        super(props)

        console.log(TAG + "-->", JSON.stringify(props));
        this.state = {
            isLogin: props.user != undefined ? true : false,
        }

        console.log(TAG + "-->", JSON.stringify(props));
        //Platform.OS == "android" && StatusBar.setBackgroundColor(AppColors.APP_TINT_COLORS_DARK);
        subscriptionNetInfo = NetInfo.isConnected.addEventListener('connectionChange', this.handleFirstConnectivityChange);
    }

    componentDidMount() {
        NetInfo.isConnected.fetch().then(isConnected => {
            console.log(TAG + " componentDidMount-->", isConnected);
            if (isConnected != undefined) {
                globals.isInternetConnected = isConnected
                //this.setState({ isLoading: true })
                this.props.networkStatus(true)
            }
        });

        this.props.loadingIndicator(false);
        SplashScreen.hide();

        this.connectOdoo();
    }

    /* Create new Odoo connection instance */
    connectOdoo() {

        odoo.connect()
            .then(response => {
                console.log(TAG + "connect response: ", response)

                if (response.success) {
                    reTryCounter = 0;
                    globals.odoo = odoo;
                    this.props.onOdooConnect(response)
                } else {

                    if (reTryCounter < MAX_RETRY_COUNTER) {
                        reTryCounter++;
                        setTimeout(() => {
                            this.connectOdoo()
                        }, 700)
                    }
                }
            })
            .catch(error => {
                console.log(TAG + "connect error: ", error)
            })
        globals.odoo = odoo;
    }

    handleFirstConnectivityChange = isConnected => {
        console.log("handleFirstConnectivityChange-->", isConnected);
        globals.isInternetConnected = isConnected
        // this.props.networkStatus(true)

    }

    componentWillUnmount() {
        subscriptionNetInfo.remove();
        NetInfo.isConnected.removeEventListener(this.handleFirstConnectivityChange);
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <MainRoot/>
                {this.props.isLoading && <View style={{
                    height,
                    width,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    zIndex: 1
                }}>
                    <ActivityIndicator size="large" animating color={'white'}/>
                </View>}
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.reducer_UserLogin.user,
    odooResponse: state.reducer_GetOdooRes.response,
    isLoading: state.reducer_LoadingIndicator.isLoading,
})

const mapDispatchToProps = dispatch => ({
    networkStatus: (props) => dispatch(action_NetworkStatus(props)),
    onOdooConnect: (response) => dispatch(action_Odoo_Response(response)),
    loadingIndicator: (props) => dispatch(action_LoadingIndicator(props)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppRoot)