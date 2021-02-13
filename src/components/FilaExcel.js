import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import Colors from 'concevContabilidad/src/res/colors';

const Fila = ({item, OnPressEditar, OnPressBorrar}) => (
    <View>
        <View style = {styles.contenedorFila}>
            <Text numberOfLines={2} style = {styles.txtDatoFilaTexto}>{item.descrpcion}</Text>
            <Text numberOfLines={2} style = {styles.txtDatoFilaTexto}>{item.otros}</Text>
        </View>
        <View style = {styles.contenedorFila}>
            <Text numberOfLines={2} style = {styles.txtDatoFila}>{item.fecha}</Text>
            <Text numberOfLines={2} style = {styles.txtDatoFila}>{item.ingresos}</Text>
            <Text numberOfLines={2} style = {styles.txtDatoFila}>{item.egresos}</Text>
            <Text numberOfLines={2} style = {styles.txtDatoFila}>{item.saldo}</Text>
            <Pressable style = {styles.btnEditar} onPress = {OnPressEditar}>
                <Image
                    style = {styles.imgIconEditar}
                    source= {require('concevContabilidad/src/assets/icono_Editar.png')}
                />
            </Pressable>
            <Pressable style={styles.btnSalir} onPress = {OnPressBorrar}>
                <Image
                    style = {styles.imgIconSalir}
                    source= {require('concevContabilidad/src/assets/icono_Basurero.png')}
                />
            </Pressable>
        </View>
    </View>
);

const styles = StyleSheet.create({
    contenedorFila: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        height: 40,
        maxHeight: 40,
        backgroundColor: Colors.charade,
    },
    txtDatoFila:{
        color: Colors.white,
        flex: 3,
        fontSize: 10,
        paddingHorizontal: 10,
    },
    txtDatoFilaTexto:{
        color: Colors.white,
        flex: 1,
        fontSize: 10,
        flexWrap: 'wrap',
        paddingHorizontal: 10,
    },
    btnEditar:{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.EasternBlue,
        flex: 1,
        padding:10,
    },
    imgIconEditar:{
        width:20,
        height:20,
    },
    btnSalir:{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.ruby,
        flex: 1,
        padding:10,
    },
    imgIconSalir:{
        width:20,
        height:20,
    }
  });

export default Fila;
