import React from 'react';
import {Alert, Text, View} from 'react-native';
import {action_LoadingIndicator, action_NetworkStatus, action_UserLogin} from '../../../redux/action';
import {connect} from 'react-redux';
import CustomButton from "../../../components/views/CustomButton";
import AppConstants from "../../../globals/AppConstants";
import AppMessages from "../../../globals/MessageConstants";
import AppColor from "../../../globals/ColorConstants";
import styles from "./Styles";
import HeliconiaView from "../HeliconiaView";
import * as globals from "../../../globals/globals";

class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            isOnRefresh: false,
            user: props.user
        }
    }

    componentDidMount(): void {
        this.hasDistributorCodeValid()
    }

    componentWillReceiveProps(newProps) {
        console.log("Home newProps-->", JSON.stringify(newProps))
        if (newProps && newProps.isConnected) {
        }
    }

    hasDistributorCodeValid() {
        const params = {
            fields: ['id', 'name', 'list_price'],
        }

        return globals.odoo.search_read('product.product', params, this.props.odooResponse.user_context)
            .then(response => {
                console.log(response)
                if (response != undefined && response.success && response.data.length > 0) {
                    /*let id = response.data[0].id;
                    return id;*/
                    console.log("response:" ,response)
                }
                //return 0;
            })
            .catch(e => {
                console.log(e);
                return 0;
            })
    }


    logout = () => {
        Alert.alert(AppConstants.APP_NAME, AppMessages.PROMPT_LOGOUT,
            [
                {
                    text: 'No',
                    onPress: () => {

                    },
                    style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        this.props.loadingIndicator(true);
                        setTimeout(() => {
                            this.props.loadingIndicator(false);
                            this.props.onLogin(undefined);

                            /*const resetAction = StackActions.reset({
                                index: 0,
                                actions: [NavigationActions.navigate({routeName: 'Login'})],
                            });
                            this.props.navigation.dispatch(resetAction)*/

                            this.props.navigation.navigate('LoginStack');

                        }, AppConstants.DEFAULT_TOUCH_DELAY * 5);
                    }
                }
            ]);
    }


    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 20}}>
                <Text style={{marginTop: 20, marginRight: 120, fontSize: 16}}>Welcome ,</Text>
                <Text style={styles.titleContainer}>{this.state.user.name}</Text>

                {/*<Text style={styles.mobileContainer}>{this.state.user.mobile}</Text>
                <Text style={styles.emailContainer}>{this.state.user.email}</Text>*/}

                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={styles.emailContainer}>Coming Soon...</Text>
                </View>

                <CustomButton
                    style={{marginTop: 20}}
                    bgColor={AppColor.LOGIN_BG}
                    color={'white'}
                    buttonText="Log Out" onPress={this.logout}/>

                <HeliconiaView
                    darkTheme={true}/>
            </View>

        );
    }
}

const mapStateToProps = (state) => ({
    isConnected: state.reducer_NetworkStatus.isConnected,
    user: state.reducer_UserLogin.user,
    odooResponse: state.reducer_GetOdooRes.response,
})

const mapDisatchToProps = dispatch => ({
    networkStatus: (props) => dispatch(action_NetworkStatus(props)),
    onLogin: (user) => dispatch(action_UserLogin(user)),
    loadingIndicator: (props) => dispatch(action_LoadingIndicator(props))
})

export default connect(mapStateToProps, mapDisatchToProps)(Home);