import React from 'react';
import {
    View,
    Text,
} from "react-native";
import Ionicons from '../Icons/Ionicons';
import AppMessages from '../../globals/MessageConstants';
import AppColors from '../../globals/ColorConstants';
import AppConstant from '../../globals/AppConstants';

export default class EmptyView extends React.Component {

    constructor(props) {
        super(props);
    }

    _onPressButton = () => {
        setTimeout(() => {
            this.props.onPressButton()
        }, AppConstant.DEFAULT_TOUCH_DELAY);
    }

    render() {
        return (
            <View style={{ flexDirection: 'column', padding: 20, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons
                    color={AppColors.ICON_EMPTY_COLOR}
                    name={"ios-alert"}
                    size={96}
                />
                <Text style={{ marginTop: 10,marginBottom: 30, fontSize: 18, color: AppColors.ICON_EMPTY_COLOR, textAlign: 'center' }} >{AppMessages.EMPTY_SERVER_RESPONSE}</Text>
            </View>
        )
    }
}