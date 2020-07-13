import React, { Component } from 'react';
import { View, Dimensions, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import AppColors from './globals/ColorConstants';
import { action_NetworkStatus } from './redux/action';
const { height, width } = Dimensions.get("window");


class AuthLoading extends Component {

    constructor(props) {
        super(props)

        console.log("AuthLoading Root-->", JSON.stringify(props));
        this.state = {
            isLogin: props.user != undefined ? true : false,
            userLanguage: props.userLanguage
        }
    }

    componentDidMount(){
        console.log("AuthLoading componentDidMount-->", JSON.stringify(this.props));

        if (this.state.isLogin) {
            this.props.navigation.navigate('Home');
        } else {
            this.props.navigation.navigate('LoginStack');
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }} >
                <View style={{ height, width, backgroundColor: "white", alignItems: 'center', justifyContent: 'center', position: 'absolute', zIndex: 1 }}>
                    <ActivityIndicator size="large" animating color={AppColors.APP_TINT_COLORS} />
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    isLoading: state.reducer_LoadingIndicator.isLoading,
    user: state.reducer_UserLogin.user
})

const mapDispatchToProps = dispatch => ({
    networkStatus: (props) => dispatch(action_NetworkStatus(props))
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoading)