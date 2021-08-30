const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require('../models');


const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios',
]

const buscarUsuarios = async ( termino = '', res = response ) => {
    const esMongoID =  ObjectId.isValid( termino );

    console.log(esMongoID);

    if( esMongoID ){
        const usuario = await Usuario.findById( termino );

        //console.log( usuario );

        return res.json({
            results : (usuario) ? [usuario] : []
        })
    }

    const regexp = RegExp( termino, 'i' );
    const usuarios = await Usuario.find({
        $or: [{ nombre : regexp }, { correo : regexp }],
        $and: [{ estado : true }]
    });

    res.json({
        results: usuarios 
    })

}

const buscarCategorias = async ( termino = '', res = response ) => {
    const esMongoID = ObjectId.isValid( termino );
    if(esMongoID){
        const categoria = await Categoria.findById( termino )
                .populate('created_by', 'nombre');
        return res.json({
            results: (categoria) ? [ categoria ] : []
        })
    }
    const regexp = RegExp( termino, 'i' );
    const categorias = await Categoria.find({
         nombre : regexp , estado : true 
    }).populate('created_by', 'nombre');

    res.json({
        results: categorias
    })

}

const buscarProductos = async ( termino = '', res = response ) => {
    const esMongoID = ObjectId.isValid( termino );
    if(esMongoID){
        const producto = await Producto.findById( termino )
                .populate('created_by', 'nombre')
                .populate('categoria', 'nombre');
        return res.json({
            results : ( producto ) ? [ producto ] : []
        })
    }

    const regexp = RegExp( termino, 'i' );
    const productos = await Producto.find({
        nombre : regexp, estado : true 
    }).populate('created_by', 'nombre').populate('categoria', 'nombre');

    res.json({
        results : productos
    })

}

const buscar = ( req = request, res = response ) => {

    const { coleccion, termino } = req.params;

    if( !coleccionesPermitidas.includes( coleccion ) ){
        res.status(400).json({
            msg : `Las colecciones permitidas son ${ coleccionesPermitidas }`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios( termino, res );
        break;
        case 'categorias': 
            buscarCategorias( termino, res );
        break;
        case 'productos':
            buscarProductos( termino, res )
        break;
        
        default:
            res.status(500).json({
                msg: `La coleccion ${coleccion} no está activa para busqueda`
            })
        break;
    }

    
}

module.exports =  { 
    buscar
}