import React from 'react';
import { ActivityIndicator, View, Text } from "react-native";
import AppColors from '../../globals/ColorConstants';

export default class UILoader extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" animating color={AppColors.APP_TINT_COLORS} />
                {/* <ProximaNovaText style={{ marginTop: 7 }} >Please Wait...</ProximaNovaText> */}
            </View>
        );
    }
}