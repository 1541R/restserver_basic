const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs =  require('bcryptjs');

const usuariosGet = async (req = request, res = response) => {
    //const { token, numero, sucursal = 'Sin sucursal' } = req.query;
    try {
        const { limite = 5, desde = 0 } = req.query;
        const query = { estado : true };
    
        const [total, usuarios] = await Promise.all([
            Usuario.countDocuments(query),
            Usuario.find(query)
                .skip( Number(desde) )
                .limit( Number(limite) )
        ]);
        
        res.json({
            total,
            usuarios
        })
    } catch (error) {
        res.json({
            error
        })
    }

}

const usuariosPost = async (req = request, res = response ) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( { nombre, correo, password, rol } );
    const salt = bcryptjs.genSaltSync();
    usuario.password =  bcryptjs.hashSync( password, salt );

    //Encriptar contraseña

    //Guardar en DB

    await usuario.save();

    res.json({
        message: "Usuario registrado correctamente",
        usuario
    })
}

const usuariosPut = async(req, res =  response) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...rest } = req.body;
    //TODO Validar existe id

    //TODO Validar venga password

    if( password ){
        const salt = bcryptjs.genSaltSync();
        rest.password =  bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate(id, rest);

    res.json({
        usuario
    })
}


const usuariosDelete = async(req, res) => {
    const { id } = req.params;

    const usuario = await Usuario.findByIdAndUpdate(id, { estado : false });

    res.json({
        usuario
    })
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}