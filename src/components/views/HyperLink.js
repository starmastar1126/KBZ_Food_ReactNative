import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Linking, StyleSheet, Text} from 'react-native';

let textColor = 'white';

export default class HyperLink extends Component {

    constructor(props) {
        super(props);
        this._goToURL = this._goToURL.bind(this);

        textColor = props.darkTheme ? '#333' : 'white';
    }

    static propTypes = {
        url: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
    }

    render() {

        const {title} = this.props;

        return (
            <Text style={[styles.title, {color: this.props.darkTheme ? '#333' : 'white'}]} onPress={this._goToURL}>{title}</Text>
        );
    }

    _goToURL() {
        const {url} = this.props;
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(this.props.url);
            } else {
                console.log('Don\'t know how to open URI: ' + this.props.url);
            }
        });
    }
}

const styles = StyleSheet.create({
    title: {
        /*color: '#0010ff',
        fontWeight: 'bold',
        borderBottomWidth:1,
        borderBottomColor:'#0010ff'*/
    }
});