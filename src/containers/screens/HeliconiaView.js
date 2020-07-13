import React, {Component} from 'react';
import {Text} from "native-base";
import {View} from "react-native";
import HyperLink from "../../components/views/HyperLink";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

let textColor = 'white'
let showLink = true;
let showWithLove = true;

export default class HeliconiaView extends Component {
    constructor(props) {
        super(props);

        textColor = props.darkTheme ? "black" : "white"
        if (props.showLink != undefined) {
            showLink = props.showLink
        }

        if (props.showWithLove != undefined) {
            showWithLove = props.showWithLove
        }
    }

    render() {
        return (
            <View style={{...this.props.style, alignItems: 'center', justifyItems: 'center', marginTop: 20, marginBottom: 10}}>
                <Text style={{fontSize: 13, color: this.props.darkTheme ? '#333' : '#cecece'}}>Powered By</Text>
                <Text style={{fontSize: 15, color: textColor}}>Heliconia Solutions Pvt. Ltd.</Text>
                {showLink && (
                    <HyperLink darkTheme={this.props.darkTheme} title="www.heliconia.io" url="http://heliconia.io"/>
                )}

                {showWithLove && (
                    <View style={{marginTop: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 13, color: textColor, marginRight: 5}}>Made In India With</Text>
                        <FontAwesome size={18} name={'heart'} color={'red'}/>
                    </View>
                )}
            </View>
        );
    }
}