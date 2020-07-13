import React, {Component} from 'react';
import {ActivityIndicator, Alert, Dimensions, Image, Keyboard, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import {NavigationActions, StackActions} from "react-navigation";
import {Card, Container, Content} from 'native-base';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import firebase from 'react-native-firebase';

import CustomButton from "../../components/views/CustomButton";
import AppConstants from "../../globals/AppConstants";
import AppMessages from "../../globals/MessageConstants";
import {action_LoadingIndicator, action_UserLogin} from "../../redux/action";
import AppColor from "../../globals/ColorConstants";
import * as globals from "../../globals/globals";

const {height, width} = Dimensions.get("window");
const dialCode = '+91';

class VerificationOTP extends Component {

    //=======================================================================
    // constructor Method
    //=======================================================================

    constructor(props) {
        super(props);

        console.log("VerificationOTP props->", props)

        this.state = {
            isLoading: false,
            userObj: undefined,
            typedOTP: undefined,
        }
    }

    componentDidMount() {
        const {navigation} = this.props;
        if (navigation) {
            let userObj = navigation.getParam('userObj', undefined);
            if (userObj) {
                this.setState({
                    userObj: userObj
                }, () => {
                    this.sendOTP()
                })
            }
        }
    }

    sendOTP() {

        let number = dialCode + this.state.userObj.mobile;
        console.log(number);

        firebase.auth()
            .verifyPhoneNumber(number, true)
            .on('state_changed', (phoneAuthSnapshot) => {
                console.log("state_changed", phoneAuthSnapshot);

                // E.g you could handle android specific events only here, and let the rest fall back
                // to the optionalErrorCb or optionalCompleteCb functions
                switch (phoneAuthSnapshot.state) {
                    // ------------------------
                    //  IOS AND ANDROID EVENTS
                    // ------------------------
                    case firebase.auth.PhoneAuthState.CODE_SENT: // or 'sent'
                        console.log('code sent');
                        alert('A verification code send to ' + this.state.userObj.mobile);
                        // on ios this is the final phone auth state event you'd receive
                        // so you'd then ask for user input of the code and build a credential from it
                        // as demonstrated in the `signInWithPhoneNumber` example above
                        break;
                    case firebase.auth.PhoneAuthState.ERROR: // or 'error'
                        console.log('verification error');
                        console.log(phoneAuthSnapshot.error);
                        alert(phoneAuthSnapshot.error);
                        break;
                }

            }, (error) => {
                console.log("error", error);
                console.log(error.verificationId);

            }, (phoneAuthSnapshot) => {
                console.log("success", phoneAuthSnapshot);
                console.log("success", JSON.stringify(phoneAuthSnapshot));

                switch (phoneAuthSnapshot.state) {
                    case 'verified':
                        this.setState({
                            typedOTP: phoneAuthSnapshot.code
                        })
                }

            })

    }

    //=======================================================================
    // SignIn Tap Method
    //=======================================================================

    signInTap = () => {

        Keyboard.dismiss();

        if (this.state.typedOTP.length == 0 || this.state.typedOTP.length < 6) {
            Alert.alert(AppConstants.APP_NAME, AppMessages.EMPTY_OTP);
            return;
        }

        this.props.loadingIndicator(true);
        this.submitFieldToOdoo(this.state.userObj)
            .then((res) => {
                console.log(res)
                setTimeout(() => {
                    this.props.loadingIndicator(false);
                    if (res.success) {
                        alert(AppMessages.DISPLAY_MSG_SUCCESS)
                        this.moveToLogin();
                    }
                }, AppConstants.DEFAULT_TOUCH_DELAY * 5);
            })
            .catch((error) => {
                this.props.loadingIndicator(false);
                console.log(error)
            })
    }

    submitFieldToOdoo(userObj) {

        let params = {
            name: userObj.name,
            function: userObj.owner_name,
            mobile: userObj.mobile,
            hspl_password: userObj.password,
            is_shop: true,
            type: userObj.type,
            parent_id: userObj.parent_id,
        }
        console.log("Params: ",params)

        return globals.odoo.create('res.partner', params, this.props.odooResponse.user_context)
            .then(response => {
                //console.log(response)
                //alert(JSON.stringify(response))
                return response;
            })
            .catch(e => {
                //console.log(e)
                return e;
            })
    }

    moveToLogin() {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'Login'})],
        });
        this.props.navigation.dispatch(resetAction)
    }

    //=======================================================================
    // render Method
    //=======================================================================

    render() {

        return (
            <Container>
                <Content contentContainerStyle={{flex: 1}}>

                    {/* Background Image */}
                    <View
                        style={{backgroundColor: AppColor.LOGIN_BG, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}/>

                    <Image source={require('../../assets/images/login_footer_1.png')}
                           style={{width: width, height: width / 4.51, position: 'absolute', bottom: 0}}/>

                    <View style={{flex: 1, alignContent: 'center', justifyContent: 'center'}}>
                        <View style={{marginHorizontal: 20, flexDirection: 'column'}}>

                            <Card>
                                <View style={{
                                    paddingHorizontal: 10,
                                    paddingBottom: 20,
                                    backgroundColor: "rgba(255, 255, 255, 0.30)",
                                    borderRadius: 3,
                                    alignItems: 'center'
                                }}>
                                    <Image source={require('../../assets/images/app_logo.png')}
                                           style={{
                                               width: 256,
                                               height: 256 / 1.86,
                                               marginTop: 10,
                                               marginBottom: 30,
                                               alignSelf: 'center',
                                               resizeMode: 'contain'
                                           }}/>

                                    <Text style={{
                                        textAlign: 'center',
                                        color: AppColor.TEXT_COLOR,
                                        fontSize: 18,
                                        fontWeight: 'bold'
                                    }}>{this.getTitleVerificationMsg()}</Text>
                                    <View style={{marginTop: 20, height: 60,}}>
                                        <OTPInputView
                                            style={{width: '95%', paddingLeft: 10}}
                                            pinCount={6}
                                            code={this.state.typedOTP}
                                            autoFocusOnLoad={true}
                                            codeInputFieldStyle={styles.borderStyleBase}
                                            codeInputHighlightStyle={styles.borderStyleHighLighted}
                                            onCodeFilled={(code => {
                                                console.log(`Code is ${code}, you are good to go!`)
                                                this.setState({typedOTP: code})
                                            })}/>

                                    </View>

                                    {this.state.isLoading && (
                                        <ActivityIndicator animating={true} color={"#842723"} size={"large"}/>
                                    )}

                                </View>
                            </Card>
                        </View>

                        <View style={{marginHorizontal: 20, marginTop: 20}}>
                            <CustomButton
                                bgColor={"white"}
                                color={AppColor.LOGIN_BG}
                                buttonText="Verify" onPress={this.signInTap}/>
                        </View>
                    </View>

                </Content>
            </Container>
        )
    }

    getTitleVerificationMsg = () => {
        if (this.state.userObj) {
            return AppMessages.DISPLAY_MSG + " " + this.state.userObj.mobile; //this.state.dialCode + " " + this.state.mobile + " "
        } else {
            return AppMessages.DISPLAY_MSG;
        }

    }

}

const mapStateToProps = (state) => ({
    isLoading: state.reducer_LoadingIndicator.isLoading,
    odooResponse: state.reducer_GetOdooRes.response,
})

const mapDispatchToProps = dispatch => ({
    loadingIndicator: (props) => dispatch(action_LoadingIndicator(props)),
    onLogin: (user) => dispatch(action_UserLogin(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(VerificationOTP)

//=======================================================================
// Styles
//=======================================================================

const styles = StyleSheet.create({
    card: {
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#fff',
        shadowOffset: {width: 3, height: 3,},
        shadowColor: 'black',
        shadowOpacity: 0.3,
        marginTop: 50,
    },
    formStyle: {
        width: '100%',
        flex: 1,
        marginBottom: 40
    },
    textInputStyle: {
        height: 45,
        marginTop: 5,
        marginBottom: 15,
        width: width - 130,
        borderColor: "gray",
        paddingLeft: 5,
        paddingRight: 20,
        marginRight: 35,
    },
    loginButtonView: {
        marginTop: -20,
        alignSelf: 'center',
        backgroundColor: 'gray',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        width: 40,
        borderRadius: 20,
    },
    titleStyle: {
        fontSize: 20, fontWeight: '900', color: '#00BBB1'
    },
    iconStyles: {
        position: 'absolute', right: 10, top: 25
    },


    borderStyleBase: {
        width: 35,
        height: 45,
        backgroundColor: "rgba(0, 0, 0, 0.05)", borderRadius: 3
    },

    borderStyleHighLighted: {
        borderColor: "#03DAC6",
    },
});