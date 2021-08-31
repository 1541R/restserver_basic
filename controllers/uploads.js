const path = require('path');
const fs = require('fs');

const { request, response } = require('express');
const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');

const cargarArchivo = async ( req = request, res = response ) => {

    try { //Poner el método con reject, dentro de un try, permite que el reject no haga explotar la applicación
        //Imagenes
        const filename = await subirArchivo(req.files, ['txt', 'md'], 'textos');
        
        res.json({
            filename
        })
        
    } catch (msg) {
        res.status(400).json({
            msg
        })
    }


}

const actualizarImagen = async (req = request, res = response) => {

    const { coleccion, id } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            
            modelo = await Usuario.findById(id);

            if( !modelo ){
                return res.status(400).json({
                    msg : `El usuario con el id: ${ id } no existe`
                })
            }

            break;

        case 'productos':
            
            modelo = await Producto.findById(id);

            if( !modelo ) {
                return res.status(400).json({
                    msg : `El producto con el id: ${ id } no existe`
                })
            }

        break;

        default:
            return res.status(500).json( { msg : 'Has olvidado algo' } );
    }

    if(modelo.img){
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
        if( fs.existsSync(pathImagen) ){
            fs.unlinkSync( pathImagen );
        }
    }

    const filename = await subirArchivo(req.files, ['jpg', 'png', 'gif', 'jpeg'], coleccion);

    modelo.img = filename;
    
    await modelo.save();

    res.json({
        modelo
    })
}

const mostrarImagen = async( req = request, res = response ) => {

    const { coleccion, id } = req.params;

    let modelo;
    
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById( id );

            if( !modelo ){
                return res.status(400).json({
                    msg : `El usuario con el id: ${ id } no existe`
                })
            }

            break;
        case 'productos':
            modelo = await Producto.findById(id);

            if( !modelo ){
                return res.status( 400 ).json({
                    msg: `El producto con el id: ${ id } no existe`
                })
            }
            break;
        default:
            return res.status(500).json( { msg : 'Has olvidado algo' } );
    }

    if(modelo.img){
        const pathImage = path.join( __dirname, '../uploads', coleccion, modelo.img );
        if( fs.existsSync(pathImage) ){
            return res.sendFile(pathImage);
        }

        return res.sendFile( path.join( __dirname, '../assets/no-image.jpg' ) );

    }

    return res.sendFile( path.join( __dirname, '../assets/no-image.jpg' ) );
    

}

module.exports = {
    actualizarImagen,
    cargarArchivo,
    mostrarImagen
}