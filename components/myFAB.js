import * as React from 'react';
import { FAB, Portal, Provider } from 'react-native-paper';

class MyFAB extends React.Component {


    constructor() {
        super();
        this.state = {
            open : false,
            colorFav : "grey",
        }
    }

    componentDidMount() {

        if( this.props.boolFav == true){

            this.setState( {
                colorFav : 'orange'
            })
        }


    }


    AddFavorite (){

        this.props.addFavorite(this.props.idWord);


        if(this.state.colorFav =='grey'){
            this.setState( {
                colorFav : 'orange'
            })
        } else {
            this.setState( {
                colorFav : 'grey'
            })
        }


    }


    render(){

        let { open , colorFav} = this.state;

        return (
            <Provider>
                <Portal>
                    <FAB.Group
                        open={open}
                        icon={open ? 'calendar-today' : 'plus'}
                        actions={[
                            { icon: 'plus', onPress: () => console.log('Pressed add') },
                            {
                                icon: 'star',
                                label: 'Star',
                                onPress: () => this.props.showDialog(),
                            },
                            {
                                icon: 'email',
                                label: 'Email',
                                onPress: () => console.log('Pressed email'),
                            },
                            {
                                icon: 'star',
                                label: 'Favorite',
                                color: colorFav,
                                onPress: () => this.props.addFavorite(this.props.idWord),
                                small: false,
                            },
                        ]}
                        onStateChange={ () => this.setState({ open : !open })}
                        onPress={() => {
                            if (open) {
                                // do something if the speed dial is open
                            }
                        }}
                    />
                </Portal>
            </Provider>
        );
    }



};

export default MyFAB;