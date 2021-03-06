/**
 * Created by Administrator on 2017/3/13.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableHighlight,
    ActivityIndicator,
    Image,
    ListView
} from 'react-native';

const styles = StyleSheet.create({
   container:{
       marginTop:65
   },
    heading:{
       backgroundColor:'#f8f8f8'
    },
    separator:{
       height:1,
        backgroundColor:'#dddddd'
    },
    image:{
       width:400,
        height:300
    },
    price:{
       fontSize:25,
        fontWeight:'bold',
        margin:5,
        color:'#48bbec'
    },
    title:{
       fontSize:20,
        margin:5,
        color:'#656565'
    },
    description:{
       fontSize:18,
        margin:5,
        color:'#656565'
    }
});

export default class PropertyView extends Component{


    render(){
        var property =this.props.property;
        var stats= property.bedroom_number+'bed'+property.property_type;
        if (property.bathroom_number){
            stats+=', '+property.bathroom_number+' '+(property.bathroom_number>1
                    ?'bathrooms':'bathroom');
        }

        var price =property.price_formatted.split(' ')[0];

        return(
            <View style={styles.container}>
                <Image style={styles.image}
                source={{uri:property.image_url}}
                />
                <View style={styles.heading}>
                    <Text style={styles.price}>£{price}</Text>
                    <Text style={styles.title}>{property.title}</Text>
                    <Text style={styles.description}>{property.summary}</Text>
                </View>
            </View>
        )
    }
}