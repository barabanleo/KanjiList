import {Text, View, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, RefreshControl} from 'react-native';
import * as React from 'react';

import * as SQLite from 'expo-sqlite';
import {AntDesign} from "@expo/vector-icons";

import { FAB, Portal, Provider } from 'react-native-paper';


import MyFAB from '../components/myFAB'
import Dialog from "react-native-dialog";



const db = SQLite.openDatabase("db.db");


class ListWordScreen extends React.Component{


    constructor() {
        super();
        this.state = {
            items: null,
            refreshing:false,
            index : 0,
            random : null,
            open : false,
            visible : false,
        }
    }



    createRandomArray(_array){

        var array = Array.from(Array(_array.length).keys())
        const shuffledArray = array.sort((a, b) => 0.5 - Math.random());

        this.setState({
            items: _array ,
            random : shuffledArray,
        })
    }

    componentDidMount() {

        db.transaction(tx => {
            tx.executeSql(
                "SELECT * from items WHERE date_add = (?);",
                [this.props.route.params.dateList],
                ( _, { rows: { _array } }) =>  this.createRandomArray(_array)
            );
        });

    }


    nextWord() {

        let { index } = this.state;

        this.setState({
            index : index+1
        })
    }

    resetList() {

        let { index } = this.state;

        this.setState({
            index : 0
        })
    }


    showDialog() {
        this.setState({
            visible : true
        })
    }

    render() {

        const onStateChange = ({ open }) => setState({ open });

        let { items , word ,index , random , open , visible} = this.state;

        if( items == undefined){

            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor : "black" }}>
                    <Text
                        style={{
                            textAlign: "center",
                            color: "white",
                            width: '66%',
                            alignItems: "center",
                            alignSelf: 'center',
                            fontSize: 20,
                            fontWeight: "bold",
                            padding: 20,
                            marginTop: 20
                        }}
                    >
                        Chargement
                    </Text>
                </View>
            );
        }

        else if(index == items.length){

            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor : "black" }}>
                    <Text
                        style={{
                            textAlign: "center",
                            color: "white",
                            width: '66%',
                            alignItems: "center",
                            alignSelf: 'center',
                            fontSize: 20,
                            fontWeight: "bold",
                            padding: 20,
                            marginTop: 20
                        }}
                    >
                        Fin de liste
                    </Text>

                    <Button
                        title="RESET"
                        onPress={() => {this.resetList()}}
                    >
                    </Button>

                    <MyFAB />

                </View>
            );

        }

        return (

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor : "black" }}>

                {items == undefined || items == "" || index == items.length ?

                    <Text
                        style={{
                            textAlign: "center",
                            color: "white",
                            width: '66%',
                            alignItems: "center",
                            alignSelf: 'center',
                            fontSize: 20,
                            fontWeight: "bold",
                            padding: 20,
                            marginTop: 20
                        }}
                    >
                        Pas de mots
                    </Text>

                    :

                    <View>


                    <Text
                        style={{color: "white", fontSize: 20, padding: 50, marginBottom: "10%"}}
                    >
                        {items[random[index]].word}

                    </Text>

                    <View style={{width : '66%'  , margin : '5%'}}>
                    <Button
                    title="Suivant"
                    onPress={() => {this.nextWord()}}
                    >
                    </Button>

                    </View>

                    </View>
                }

                <MyFAB showDialog={this.showDialog.bind(this)} />


                <Dialog.Container visible={visible}>
                    <Dialog.Title>Delete List</Dialog.Title>
                    <Dialog.Description>
                        Do you want to delete this list? You cannot undo this action.
                    </Dialog.Description>
                    <Dialog.Button label="Cancel" onPress={ () => this.onCancelDeleteList() } />
                    <Dialog.Button label="Delete" onPress={ () => this.onDeleteList(item.date_add) } />
                </Dialog.Container>

            </View>



        );

    }


};

export default ListWordScreen;