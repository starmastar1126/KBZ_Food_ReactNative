import {StyleSheet} from 'react-native';
import AppColors from './ColorConstants';

export default styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: AppColors.APP_TINT_COLORS
    },
    bodyStyle: {
        backgroundColor: AppColors.APP_BACKGROUND_COLOR
    },
    textFieldIcon: {
        position: 'absolute', right: 10, top: 40
    },
    iconSize: {
        height: 24,
        width: 24
    }
})