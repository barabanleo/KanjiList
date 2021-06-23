import * as React from 'react';
import { FAB, Portal, Provider } from 'react-native-paper';

class MyFAB extends React.Component {


    constructor() {
        super();
        this.state = {
            open : false,
        }
    }


    render(){

        let { open } = this.state;


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
                                icon: 'bell',
                                label: 'Remind',
                                onPress: () => console.log('Pressed notifications'),
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