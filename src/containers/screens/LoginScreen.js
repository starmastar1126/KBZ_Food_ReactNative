import React, {Component} from 'react';
import {Dimensions, Image, Keyboard, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {Card, Container, Content, Form, Input, Item, Text} from 'native-base'
import md5 from 'md5';

import {action_LoadingIndicator, action_UserLogin} from '../../redux/action';
import * as globals from '../../globals/globals';
import CustomButton from "../../components/views/CustomButton";
import AppMessages from "../../globals/MessageConstants";
import AppConstants from "../../globals/AppConstants";
import AppColor from "../../globals/ColorConstants";
import Validation from "../../utils/ValidationManager";
import HeliconiaView from "./HeliconiaView";

//import countryJson from '../../assets/country_list.json';
const {height, width} = Dimensions.get("window");

//const countryJson = require('../../assets/country_list.json');
class Login extends Component {

    //=======================================================================
    // constructor Method
    //=======================================================================

    constructor(props) {
        super(props)
        this.state = {
            mobile: '',
            password: ''
        }
    }

    //=======================================================================
    // SignIn Tap Method
    //=======================================================================

    signInTap = () => {

        Keyboard.dismiss()
        if (!Validation.emptyTextInput(this.state.mobile, AppMessages.PROMPT_MOBILE) ||
            !Validation.emptyTextInput(this.state.password, AppMessages.PROMPT_PWD)) {
            return;
        }

        this.props.loadingIndicator(true);

        //domain: [['mobile', '=', this.state.mobile], ['hspl_password', '=', md5(this.state.password)], ['is_shop', '=', 'true']],
        const params = {
            domain: [['mobile', '=', this.state.mobile], ['hspl_password', '=', md5(this.state.password)], ['is_shop', '=', true]],
            fields: ['id', 'name', 'mobile', 'email', 'hspl_password', 'state', 'is_shop'],
        }

        setTimeout(() => {

            globals.odoo.search_read('res.partner', params, this.props.odooResponse.user_context)
                .then(response => {
                    this.props.loadingIndicator(false);
                    console.log(response);

                    if (response != undefined && response.success && response.data.length > 0) {

                        let data = response.data[0];
                        if (data.state) {

                            if (data.state == AppConstants.USER_LOGIN_STATUS.NEW) {
                                alert(AppMessages.INVALID_LOGIN_STATUS_NEW);
                            } else if (data.state == AppConstants.USER_LOGIN_STATUS.VERIFIED) {
                                this.successLogin(data);
                            } else if (data.state == AppConstants.USER_LOGIN_STATUS.CANCELLED) {
                                alert(AppMessages.INVALID_LOGIN_STATUS_CANCELLED);
                            } else {
                                alert(AppMessages.INVALID_LOGIN_STATUS_UNKNOWN);
                            }
                        } else {
                            alert(AppMessages.INVALID_LOGIN_STATUS_UNKNOWN);
                        }

                    } else {
                        alert(AppMessages.INVALID_DETAILS)
                    }
                })
                .catch(e => {
                    this.props.loadingIndicator(false);
                    console.log(e);
                    alert(e)
                })

        }, AppConstants.DEFAULT_TOUCH_DELAY * 5);


        /*odoo.connect()
            .then(response => {
                console.log("Connect:", response)

                /!*const  params = {
                    ids: [41],
                    fields: [ 'name' ],
                }*!/

                /!* odoo.get('res.partner', params, response.user_context)
                     .then(response => {console.log(response)})
                     .catch(e => { console.log(e) })*!/

                /!*odoo.create('res.partner', {
                    name: 'Jayesh from react-native',
                    email:'jayesh2d@d.com',
                    mobile:''
                }, response.user_context)
                    .then(response => { console.log(response) })
                    .catch(e => { console.log(e) })*!/


                const params = {
                    domain: [['mobile', '=', '8000337566']],
                    fields: ['name', 'mobile', 'email'],
                }
                odoo.search_read('res.partner', params, response.user_context)
                    .then(response => {
                        console.log(response)
                    })
                    .catch(e => {
                        console.log(e)
                    })

            })
            .catch(e => {
                console.log("Error:", e)
            })*/


        // const navigateAction = NavigationActions.navigate({
        //     routeName: "Home"
        // });
        // this.props.navigation.dispatch(navigateAction);

        //this.props.navigation.dispatch(DrawerActions.closeDrawer())


        // this.props.loadingIndicator(true)
        // let data = {
        //     email: this.state.email,
        //     password: this.state.password
        // }
        // API.login(this.loginResponse, data, true)
    }

    successLogin(data) {
        this.props.onLogin(data);

        /*const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'Home'})],
        });
        this.props.navigation.dispatch(resetAction)*/

        this.props.navigation.navigate("Home")
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
            <Container>
                <Content contentContainerStyle={{flex: 1}}>

                    {/* Background Image */}
                    <View
                        style={{backgroundColor: AppColor.LOGIN_BG, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}/>

                    <Image source={require('../../assets/images/login_footer_1.png')}
                           style={{width: width, height: width / 4.51, position: 'absolute', bottom: 0}}/>

                    <View style={{flex: 1, alignContent: 'center', justifyContent: 'center', paddingHorizontal: 20}}>

                        <Card style={{}}>
                            <View style={{padding: 20, flexDirection: 'column'}}>
                                <Image source={require('../../assets/images/app_logo.png')}
                                       style={{
                                           width: 256,
                                           height: 256 / 1.86,
                                           marginTop: 10,
                                           marginBottom: 30,
                                           alignSelf: 'center',
                                           resizeMode: 'contain'
                                       }}/>
                                <Form>
                                    <Item
                                        style={{
                                            marginLeft: 0,
                                            borderBottomWidth: 0,
                                            borderRadius: 3,
                                            marginBottom: 20,
                                            backgroundColor: "rgba(0, 0, 0, 0.07)"
                                        }}>
                                        <Input
                                            placeholder='Mobile'
                                            style={{paddingLeft: 20, paddingRight: 20}}
                                            returnKeyType={"next"}
                                            maxLength={10}
                                            keyboardType={"phone-pad"}
                                            blurOnSubmit={true}
                                            onChangeText={(text) => {
                                                this.setState({mobile: text})
                                            }}
                                        />
                                    </Item>
                                    <Item
                                        style={{
                                            marginLeft: 0, borderBottomWidth: 0, borderRadius: 3,
                                            backgroundColor: "rgba(0, 0, 0, 0.07)"
                                        }}>
                                        <Input
                                            placeholder='Password'
                                            style={{paddingLeft: 20, paddingRight: 20}}
                                            value={this.state.password}
                                            onChangeText={(text) => {
                                                this.setState({password: text})
                                            }}
                                            returnKeyType={"next"}
                                            secureTextEntry={true}
                                            maxLength={50}
                                        />
                                    </Item>
                                </Form>
                                <Text style={{marginTop: 20, alignSelf: 'flex-end'}}>Forgot Password?</Text>
                            </View>
                        </Card>

                        <View style={{marginHorizontal: 20, marginTop: 20}}>
                            <CustomButton
                                bgColor={"white"}
                                color={AppColor.LOGIN_BG}
                                buttonText="Login" onPress={this.signInTap}/>
                            <CustomButton
                                bgColor={"white"}
                                style={{marginTop: 10}}
                                color={AppColor.LOGIN_BG}
                                buttonText="Register" onPress={() => {
                                this.props.navigation.navigate("Register")
                            }}/>
                        </View>

                        <HeliconiaView/>
                    </View>

                </Content>
            </Container>
        )
    }

    getCoutryName = (item) => {
        return item.dial_code + " (" + item.name + ")";
    }
}

const mapStateToProps = (state) => ({
    odooResponse: state.reducer_GetOdooRes.response,
})

const mapDispatchToProps = dispatch => ({
    onLogin: (user) => dispatch(action_UserLogin(user)),
    loadingIndicator: (props) => dispatch(action_LoadingIndicator(props))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)

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
    }
});