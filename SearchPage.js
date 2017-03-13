/**
 * Created by Administrator on 2017/3/10.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableHighlight,
    ActivityIndicator,
    Image
} from 'react-native';

import SearchResults from './SearchResults'

function urlForQueryAndPage(key, value, pageNumber) {
    var data = {
        country: 'uk',
        pretty: '1',
        encoding: 'json',
        listing_type: 'buy',
        action: 'search_listings',
        page: pageNumber
    };

    data[key] = value;

    var querystring = Object.keys(data)
        .map(key => key + '=' + encodeURIComponent(data[key]))
        .join('&');

    return 'http://api.nestoria.co.uk/api?' + querystring;
};

export default class SearchPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchString: 'london',
            isLoading: false,
            message: ''
        };
        this.__handleResponse = this.__handleResponse.bind(this);
    }

    render() {

        var spinner = this.state.isLoading ?
            (
                <ActivityIndicator
                    hidden="'true"
                    size='large'/>
            ) :
            (<View/>);

        console.log('SearchPage.render');

        return (
            <View style={styles.container}>
                <Text style={styles.description}>
                    Search for houses to buy!
                </Text>
                <Text style={styles.description}>
                    Search by place-name,postcode or search near your location.
                </Text>
                <View style={styles.flowRight}>
                    <TextInput
                        style={styles.searchInput}
                        value={this.state.searchString}
                        onChange={this.onSearchTextChanged.bind(this)}
                        placeholder='Search via name or postcode'/>
                    <TouchableHighlight style={styles.button}
                                        onPress={this.onSearchPressed.bind(this)}
                                        underlayColor='#99d9f4'>
                        <Text style={styles.buttonText}>Go</Text>
                    </TouchableHighlight>
                </View>
                <View style={{height: 36, alignSelf: 'stretch'}}>
                    <TouchableHighlight style={styles.button}
                                        underlayColor='#99d9f4'>
                        <Text style={styles.buttonText}
                              onPress={this.onLocationPressed.bind(this)}
                        >Location</Text>
                    </TouchableHighlight>
                </View>
                <Image
                    source={require('./Resources/house@2x.png')}
                    style={styles.container}
                />
                {spinner}
                <Text style={styles.description}>{this.state.message}</Text>
            </View>
        )
    }

    onLocationPressed() {

        console.log("onLocationPressed");

        navigator.geolocation.getCurrentPosition(
            position => {

                console.log("position " + position);

                var search = position.coords.latitude + "," + position.coords.longitude;

                this.setState({
                    searchString: search
                });

                var query = urlForQueryAndPage('centre_point', search, 1);
                this._executeQuery(query);

            },
            error => {
                console.log("location error:" + JSON.stringify(error));
                this.setState({
                    message: 'there was a problem with obtaining your location: ' + error
                });
            },
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );
    }

    onSearchTextChanged(event) {
        console.log('onSearchTextChanged');
        this.setState({searchString: event.nativeEvent.text});
        console.log(this.state.searchString);
    }

    _executeQuery(query) {
        console.log(query);
        this.setState(
            {isLoading: true}
            );

        fetch(query)
            .then(response => response.json())
            .then(json => this.__handleResponse(json.response))
            .catch(error => {
                    console.log(error);
                    this.setState({
                        isLoading: false,
                        message: 'Something bad happened ' + error
                    })
                }
            );
    }

    onSearchPressed() {
        var query = urlForQueryAndPage('place_name', this.state.searchString, 1);
        this._executeQuery(query);
    }

    __handleResponse(response) {
        this.setState({
            isLoading: false,
            message: ''
        });

        console.log(response)

        if (response.application_response_code.substr(0, 1) === '1') {

            console.log('Properties found: ' + response.listings.length);

            this.props.navigator.push({
                title: 'Results',
                component: SearchResults,
                passProps: {
                    listings: response.listings
                }
            });

        } else {
            this.setState({message: 'Location not recognized; please try again.'});
        }
    }
}

const styles = StyleSheet.create({
    description: {
        marginBottom: 20,
        fontSize: 18,
        textAlign: 'center',
        color: '#656565'
    },
    container: {
        padding: 30,
        marginTop: 65,
        alignItems: 'center'
    },
    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch'
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
    button: {
        height: 36,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#48bbec',
        borderColor: '#48bbec',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 4,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    searchInput: {
        height: 36,
        padding: 4,
        marginRight: 5,
        flex: 4,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#48bbec',
        borderRadius: 8,
        color: '#48bbec'
    }
});