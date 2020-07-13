import React, {Component} from 'react';
import {Alert, Dimensions, Image, Keyboard, ScrollView, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux'
import {Form, Input, Item, Label} from 'native-base';
import {action_LoadingIndicator} from "../../redux/action";
import md5 from 'md5';
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import globalStyles from '../../globals/GlobalStyles';
import Validation from "../../utils/ValidationManager";
import APPCONSTANTS from "../../globals/AppConstants";
import AppMessages from "../../globals/MessageConstants";
import AppColors from '../../globals/ColorConstants';
import * as globals from '../../globals/globals';
import CustomButton from "../../components/views/CustomButton";
import HeliconiaView from "./HeliconiaView";

const {height, width} = Dimensions.get("window");
let _this = null;
let fieldLogoSize = 24;

class Register extends Component {

    //=======================================================================
    // navigationOptions Method
    //=======================================================================
    /*static navigationOptions = ({ navigation, screenProps, }) => {
        const { state } = navigation;
        return {
            headerTitle : APPCONSTANTS.SCREEN_TITLE.INQUIRY,
            headerTintColor : AppColors.headerTintColor,
            headerStyle : globalStyles.headerStyle
        }
    }*/

    //=======================================================================
    // constructor Method
    //=======================================================================

    constructor(props) {
        super(props);
        _this = this;
        this.state = {
            shop_name: '',
            owner_name: '',
            shop_lat: 0,
            shop_lng: 0,
            mobile: '',
            password: '',
            confirm_password: '',
            distrb_code: ''
        }
    }

    //=======================================================================
    // signUpTap Method
    //=======================================================================

    signUpTap = () => {

        Keyboard.dismiss();

        if (Validation.emptyTextInput(this.state.shop_name, AppMessages.EMPTY_SHOP_NAME) &&
            Validation.emptyTextInput(this.state.owner_name, AppMessages.EMPTY_OWNER_NAME) &&
            Validation.emptyTextInput(this.state.mobile, AppMessages.EMPTY_MOBILE) &&
            Validation.emptyTextInput(this.state.password, AppMessages.EMPTY_PASSWORD_REG) &&
            Validation.emptyTextInput(this.state.confirm_password, AppMessages.EMPTY_PASSWORD_CONFIRM_REG) &&
            Validation.emptyTextInput(this.state.distrb_code, AppMessages.EMPTY_DIS_CODE) &&
            Validation.passwordLength(this.state.mobile, 10, AppMessages.INVALID_MOBILE_LENGTH) &&
            Validation.passwordLength(this.state.password, 6, AppMessages.INVALID_PASSWORD_LENGTH) &&
            Validation.samePassword(this.state.password, this.state.confirm_password, AppMessages.INVALID_PASSWORD_REG)) {

            if (globals.isInternetConnected) {
                this.processToSubmit();
            } else {
                Alert.alert(APPCONSTANTS.APP_NAME, AppMessages.MSG_NO_INTERNET)
            }
        }
    }

    processToSubmit() {
        this.props.loadingIndicator(true)

        //Check mobile number is available or not
        this.hasMobileNumberAvailable()
            .then((value) => {

                if (value) {

                    //Check distributor code is valid or not
                    this.hasDistributorCodeValid()
                        .then((res) => {
                            this.props.loadingIndicator(false)

                            if (res > 0) {
                                let userObj = {
                                    name: this.state.shop_name,
                                    owner_name: this.state.owner_name,
                                    mobile: this.state.mobile,
                                    password: md5(this.state.password),
                                    type: 'other',
                                    parent_id: res
                                };
                                this.moveToVerify(userObj);
                            } else {
                                Alert.alert(APPCONSTANTS.APP_NAME, AppMessages.INVALID_DISTRIBUTOR)
                            }

                        }).catch((err) => {
                        this.props.loadingIndicator(false)
                    })
                    //==//

                } else {
                    this.props.loadingIndicator(false)
                    Alert.alert(APPCONSTANTS.APP_NAME, AppMessages.REGISTERED_MOBILE)
                }
            })
    }

    moveToVerify(userObj) {
        this.props.navigation.navigate("VerificationOTP", {
            userObj: userObj
        })
    }


    hasMobileNumberAvailable() {
        const params = {
            domain: [['mobile', '=', this.state.mobile]],
            fields: ['id'],
        }

        return globals.odoo.search_read('res.partner', params, this.props.odooResponse.user_context)
            .then(response => {
                console.log(response)
                if (response != undefined && response.success && response.data.length > 0) {
                    return false;
                }
                return true;
            })
            .catch(e => {
                console.log(e);
                return false;
            })
    }

    hasDistributorCodeValid() {
        const params = {
            domain: [['code', '=', this.state.distrb_code]],
            fields: ['id'],
        }

        return globals.odoo.search_read('res.partner', params, this.props.odooResponse.user_context)
            .then(response => {
                console.log(response)
                if (response != undefined && response.success && response.data.length > 0) {
                    let id = response.data[0].id;
                    return id;
                }
                return 0;
            })
            .catch(e => {
                console.log(e);
                return 0;
            })
    }

//======================================================================
// inquiryResponse
//======================================================================

    inquiryResponse = {
        success: (response) => {
            this.props.loadingIndicator(false)
            try {
                if (response.error == 0) {
                    Alert.alert(APPCONSTANTS.APP_NAME, response.msg)
                    this.props.navigation.goBack();
                } else {
                    Alert.alert(APPCONSTANTS.APP_NAME, response.msg)
                }
            } catch (error) {
                Alert.alert(APPCONSTANTS.APP_NAME, response.msg)
                console.log('loginResponse catch error ' + JSON.stringify(error));
            }
        },
        error: (err) => {
            this.props.loadingIndicator(false)
        },
        complete: () => {
            this.props.loadingIndicator(false)
        }
    }

//=======================================================================
// _focusInput Method
//=======================================================================

    _focusInput(inputField) {
        this[inputField]._root.focus();
    }

//=======================================================================
// render Method
//=======================================================================

    render() {
        return (
            <View style={{flex: 1, backgroundColor: AppColors.LOGIN_BG}}>
                {/* Background Image */}
                <View
                    style={{backgroundColor: AppColors.LOGIN_BG, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}/>

                <Image source={require('../../assets/images/login_footer_1.png')}
                       style={{width: width, height: width / 4.51, position: 'absolute', bottom: 0}}/>

                <ScrollView>

                    <View style={styles.card}>
                        <Form style={styles.formStyle}>

                            <Image source={require('../../assets/images/app_logo.png')}
                                   style={{
                                       width: 170,
                                       height: 170 / 1.86,
                                       marginTop: 20,
                                       alignSelf: 'center',
                                       resizeMode: 'contain'
                                   }}/>

                            <View style={{flex: 1, borderBottomWidth: 0.5, borderColor: 'lightgray'}}>
                                <Item floatingLabel style={{margin: 0, padding: 0}}>
                                    <Label>Shop Name</Label>
                                    <Input
                                        style={styles.textInputStyle}
                                        value={this.state.shop_name}
                                        blurOnSubmit={true}
                                        onChangeText={(text) => this.setState({shop_name: text})}
                                        textColor={AppColors.TEXT_INPUT_COLOR}
                                        inputContainerStyle={{paddingLeft: 10, paddingRight: 10}}
                                        labelTextStyle={{paddingLeft: 10, paddingRight: 10}}
                                        returnKeyType={"next"}
                                        onSubmitEditing={() => this._focusInput('ownerName')}
                                    />
                                </Item>
                                <View style={globalStyles.textFieldIcon}>
                                    <Entypo name={"user"} size={fieldLogoSize} color={"#243747"}/>
                                </View>
                            </View>

                            <View style={{flex: 1, borderBottomWidth: 0.5, borderColor: 'lightgray'}}>
                                <Item floatingLabel style={{margin: 0, padding: 0}}>
                                    <Label>Owner Name</Label>
                                    <Input
                                        style={styles.textInputStyle}
                                        getRef={(input) => this.ownerName = input}
                                        value={this.state.owner_name}
                                        blurOnSubmit={true}
                                        onChangeText={(text) => this.setState({owner_name: text})}
                                        textColor={AppColors.TEXT_INPUT_COLOR}
                                        inputContainerStyle={{paddingLeft: 10, paddingRight: 10}}
                                        labelTextStyle={{paddingLeft: 10, paddingRight: 10}}
                                        returnKeyType={"next"}
                                        onSubmitEditing={() => this._focusInput('emailInput')}
                                    />
                                </Item>
                                <View style={globalStyles.textFieldIcon}>
                                    <Entypo name={"user"} size={fieldLogoSize} color={"#243747"}/>
                                </View>
                            </View>
                            <View style={{flex: 1, borderBottomWidth: 0.5, borderColor: 'lightgray'}}>
                                <Item floatingLabel style={{margin: 0, padding: 0}}>
                                    <Label>Mobile</Label>
                                    <Input
                                        style={styles.textInputStyle}
                                        getRef={(input) => this.phoneNumberInput = input}
                                        value={this.state.mobile}
                                        blurOnSubmit={true}
                                        onChangeText={(text) => this.setState({mobile: text})}
                                        textColor={AppColors.TEXT_INPUT_COLOR}
                                        inputContainerStyle={{paddingLeft: 10, paddingRight: 10}}
                                        labelTextStyle={{paddingLeft: 10, paddingRight: 10}}
                                        returnKeyType={"next"}
                                        keyboardType={"name-phone-pad"}
                                        autoCapitalize='none'
                                        onSubmitEditing={() => this._focusInput('password')}
                                    />
                                </Item>
                                <View style={globalStyles.textFieldIcon}>
                                    <Entypo name={"mobile"} size={fieldLogoSize} color={"#243747"}/>
                                </View>
                            </View>

                            <View style={{flex: 1, borderBottomWidth: 0.5, borderColor: 'lightgray'}}>
                                <Item floatingLabel style={{margin: 0, padding: 0}}>
                                    <Label>Password</Label>
                                    <Input
                                        style={styles.textInputStyle}
                                        getRef={(input) => this.password = input}
                                        value={this.state.password}
                                        blurOnSubmit={true}
                                        onChangeText={(text) => this.setState({password: text})}
                                        textColor={AppColors.TEXT_INPUT_COLOR}
                                        inputContainerStyle={{paddingLeft: 10, paddingRight: 10}}
                                        labelTextStyle={{paddingLeft: 10, paddingRight: 10}}
                                        returnKeyType={"next"}
                                        secureTextEntry={true}
                                        onSubmitEditing={() => this._focusInput('cfmpassword')}
                                    />
                                </Item>
                                <View style={globalStyles.textFieldIcon}>
                                    <Entypo name={"lock"} size={fieldLogoSize} color={"#243747"}/>
                                </View>
                            </View>

                            <View style={{flex: 1, borderBottomWidth: 0.5, borderColor: 'lightgray'}}>
                                <Item floatingLabel style={{margin: 0, padding: 0}}>
                                    <Label>Confirm Password</Label>
                                    <Input
                                        style={styles.textInputStyle}
                                        getRef={(input) => this.cfmpassword = input}
                                        value={this.state.confirm_password}
                                        blurOnSubmit={true}
                                        onChangeText={(text) => this.setState({confirm_password: text})}
                                        textColor={AppColors.TEXT_INPUT_COLOR}
                                        inputContainerStyle={{paddingLeft: 10, paddingRight: 10}}
                                        labelTextStyle={{paddingLeft: 10, paddingRight: 10}}
                                        returnKeyType={"next"}
                                        secureTextEntry={true}
                                        onSubmitEditing={() => this._focusInput('disRef')}
                                    />
                                </Item>
                                <View style={globalStyles.textFieldIcon}>
                                    <Entypo name={"lock"} size={fieldLogoSize} color={"#243747"}/>
                                </View>
                            </View>

                            <View style={{flex: 1, borderBottomWidth: 0.5, borderColor: 'lightgray'}}>
                                <Item floatingLabel last style={{margin: 0, padding: 0}}>
                                    <Label>Distributor Code</Label>
                                    <Input
                                        style={styles.textInputStyle}
                                        getRef={(input) => this.disRef = input}
                                        value={this.state.distrb_code}
                                        blurOnSubmit={true}
                                        onChangeText={(text) => this.setState({distrb_code: text})}
                                        textColor={AppColors.TEXT_INPUT_COLOR}
                                        inputContainerStyle={{paddingLeft: 10, paddingRight: 10}}
                                        labelTextStyle={{paddingLeft: 10, paddingRight: 10}}
                                        maxLength={15}
                                        returnKeyType={"done"}

                                    />
                                </Item>
                                <View style={globalStyles.textFieldIcon}>
                                    <Entypo name={"code"} size={fieldLogoSize} color={"#243747"}/>
                                </View>
                            </View>

                        </Form>
                    </View>

                    <View style={{marginHorizontal: 20, marginTop: 20}}>
                        <CustomButton
                            bgColor={"white"}
                            color={AppColors.LOGIN_BG}
                            onPress={this.signUpTap}
                            buttonText="Register"/>
                    </View>

                    <HeliconiaView/>
                    <View style={{width: 1, height: 30}}/>
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    odooResponse: state.reducer_GetOdooRes.response,
})

const mapDispatchToProps = dispatch => ({
    loadingIndicator: (props) => dispatch(action_LoadingIndicator(props))
})

export default connect(mapStateToProps, mapDispatchToProps)(Register)

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
        marginTop: 40
    },
    formStyle: {
        width: '100%',
        flex: 1,
        marginBottom: 20
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
});