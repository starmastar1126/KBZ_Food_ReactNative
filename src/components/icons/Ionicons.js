import React from 'react';
import Icon  from 'react-native-vector-icons/Ionicons';
import AppColors from '../../globals/ColorConstants';

export default class Ionicons extends React.Component {
  render() {
    return (
      <Icon
        name={this.props.name}
        size={this.props.size || 24}
        color={this.props.color || AppColors.ICON_COLOR}
      />
    );
  }
}