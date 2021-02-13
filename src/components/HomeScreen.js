import React from 'react';
import { createStackNavigator} from '@react-navigation/stack';
import Colors from 'concevContabilidad/src/res/colors';
import CRUDHoja from './CRUDHoja';
import ListaFilas from './ListaFilas';
import InsertarFila from './InsertarFila';
import ModificarFila from './ModificarFila';

const pantallasNav = createStackNavigator();

const pantallas = () =>{
    return(
        <pantallasNav.Navigator 
            screenOptions={{
                headerStyle: {
                    backgroundColor : Colors.blackPearl
                },
                headerTintColor: Colors.white
            }}
        >
            <pantallasNav.Screen 
                name = "CRUDHoja"
                component = {CRUDHoja}
            />
            <pantallasNav.Screen 
                name = "ListaFilas"
                component = {ListaFilas}
            />
            <pantallasNav.Screen 
                name = "InsertarFila"
                component = {InsertarFila}
            />
            <pantallasNav.Screen 
                name = "ModificarFila"
                component = {ModificarFila}
            />

        </pantallasNav.Navigator>
    );
}

export default pantallas;
