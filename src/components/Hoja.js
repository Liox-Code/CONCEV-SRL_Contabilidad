import React from 'react';
import { Text, View, Pressable, Image, StyleSheet } from 'react-native';
import Colors from 'concevContabilidad/src/res/colors';

const Hoja = ({data, onPressEntrar, onPressExportar, onPressEditar, onPressBorrar}) => {
    return(
        <View style={styles.contenedor}>
            <Pressable style={styles.btnIngresar} onPress = {onPressEntrar}>
                <Text numberOfLines={2} style={styles.txtBtnIngresar}>{data.nombre_hoja}</Text>
            </Pressable>
            <Pressable style={styles.btnExportar} onPress = {onPressExportar}>
                <Image
                    style = {styles.imgIconExportar}
                    source= {require('concevContabilidad/src/assets/icono_Exportar.png')}
                />
            </Pressable>
            <Pressable style={styles.btnEditar} onPress = {onPressEditar}>
                <Image
                    style = {styles.imgIconEditar}
                    source= {require('concevContabilidad/src/assets/icono_Editar.png')}
                />
            </Pressable>
            <Pressable style={styles.btnSalir} onPress = {onPressBorrar}>
                <Image
                    style = {styles.imgIconSalir}
                    source= {require('concevContabilidad/src/assets/icono_Basurero.png')}
                />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor:{
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: Colors.zircon,
    },
    btnIngresar:{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.zircon,
        flex: 6,
        padding: 6,
    },
    txtBtnIngresar:{
        color: Colors.blackPearl,
    },
    btnExportar:{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        padding: 6,
        backgroundColor: Colors.verde
    },
    imgIconExportar:{
        width:24,
        height:30,
    },
    btnEditar:{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        padding: 6,
        backgroundColor: Colors.EasternBlue
    },
    imgIconEditar:{
        width:30,
        height:30,
    },
    btnSalir:{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.ruby,
        flex: 1,
        padding: 6,
    },
    imgIconSalir:{
        width:30,
        height:36,
    }
});

export default Hoja;