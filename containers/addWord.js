import {Text, View, TextInput, Button , StyleSheet} from 'react-native';
import * as React from 'react';

import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase("db.db");



class AddWordScreen extends React.Component{


    styles = StyleSheet.create({
        appButtonContainer: {
            elevation: 8,
            backgroundColor: "#009688",
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 12
        },
        appButtonText: {
            fontSize: 18,
            color: "#fff",
            fontWeight: "bold",
            alignSelf: "center",
            textTransform: "uppercase"
        }
    });

    constructor() {
        super();
        this.state = {
            word: ''
        }
    }



    componentDidMount() {

        db.transaction(tx => {
            tx.executeSql(
                "create table if not exists items (id integer primary key not null, word text);"
            );
        });
    }


    submit() {

        if(this.state.word != "") {

            var today = new Date();

            var month = (today.getMonth()+1).toString()
            if(month < 10) {
                month = 0+month
            }

            var day = (today.getDate()).toString()
            if (day < 10){
                day = 0+day
            }

            var date = today.getFullYear().toString()+month+day;

            db.transaction(
                tx => {
                    tx.executeSql("insert into items (word,date_add) values (? , ?)", [this.state.word, date]);
                },
                null,
            );


        }

    }

    render() {

        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' , backgroundColor : 'black'}}>
                <Text style={{color : 'white' , fontWeight :'bold', fontSize : 20}}>Mots :</Text>

                <TextInput
                placeholder = "Entrer le mot"
                style={{ padding : '5%' , borderWidth : 2  , width : '66%', textAlign :'center',margin :'5%' , backgroundColor: 'white'}}
                onChangeText={(text) =>  { this.setState({word : text})}}
                />

                <View style={{width : '66%'  , margin : '5%'}}>
                    <Button
                        title="Ajouter"
                        onPress={() => {this.submit()}}

                    >
                    </Button>

                </View>


            </View>

        );

    }


}

export default AddWordScreen;