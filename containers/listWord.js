import {Text, View, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, RefreshControl} from 'react-native';
import * as React from 'react';

import * as SQLite from 'expo-sqlite';
import {AntDesign} from "@expo/vector-icons";

import { FAB, Portal, Provider } from 'react-native-paper';


import MyFAB from '../components/myFAB'
import Dialog from "react-native-dialog";
import {inline} from "react-native-web/dist/exports/StyleSheet/compile";



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

        if( this.props.route.params.dateList == "favoris") {

            db.transaction(tx => {
                tx.executeSql(
                    "SELECT * from items WHERE favoris = 1;",
                    [],
                    ( _, { rows: { _array } }) =>  this.createRandomArray(_array)
                );
            });

        } else {

            db.transaction(tx => {
                tx.executeSql(
                    "SELECT * from items WHERE date_add = (?);",
                    [this.props.route.params.dateList],
                    ( _, { rows: { _array } }) =>  this.createRandomArray(_array)
                );
            });

        }

    }


    nextWord() {

        let { index } = this.state;

        this.setState({
            index : index+1
        })
    }

    addTomorowList(word) {

        var today = new Date();

        var month = (today.getMonth()+1).toString()
        if(month < 10) {
            month = 0+month
        }

        var day = (today.getDate()+1).toString()
        if (day < 10){
            day = 0+day
        }

        var date = today.getFullYear().toString()+month+day;

        db.transaction(
            tx => {
                tx.executeSql("insert into items (word,date_add) values (? , ?)", [word, date]);
            },
            null,
        );

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


    addFavorite(id) {

        db.transaction(tx => {
            tx.executeSql(
                "UPDATE items SET favoris = (?) WHERE id = (?);",
                [true , id],
            );
        });
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

            console.log(items)

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

                    <View style={{ marginTop :'30%' , flex: 1, justifyContent: 'center'}} >
                        <Text
                            style={{ textAlign:'center' ,  color: "white", fontSize: 30, marginBottom: "10%" , alignItems : 'center' }}
                        >
                            {items[random[index]].word}
                        </Text>

                        <View style={{ textAlign : 'center' , alignSelf : "stretch" , flexDirection : "row"  , justifyContent : "space-between"}}>

                            <TouchableOpacity
                                onPress={ () => {this.nextWord()}}
                                style={{
                                    alignSelf : "stretch" ,
                                    backgroundColor:  "#1c9963" ,
                                    borderColor: "#000",
                                    borderWidth: 1,
                                    padding: 20 ,
                                    margin : '10%',
                                    color : 'white',
                                }}>
                                <Text style={{color : 'white'}}>Suivant</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={ () => {this.addTomorowList(items[random[index]].word)}}
                                style={{
                                    alignSelf : "stretch" ,
                                    backgroundColor:  "#1c9963" ,
                                    borderColor: "#000",
                                    borderWidth: 1,
                                    padding: 20 ,
                                    margin : '10%',
                                }}>
                                <Text style={{color : 'white'}}>Demain</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                }

                <MyFAB showDialog={this.showDialog.bind(this)} addFavorite={this.addFavorite.bind(this)} idWord={items[random[index]].id} boolFav={items[random[index]].favoris } />


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