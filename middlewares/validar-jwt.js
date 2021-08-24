const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async ( req =  request, res = response, next ) => {

    const token = req.header('x-token');

    if(!token) {
        return res.status(401).json({
            msg: "No autorizado"
        })
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const usuario = await Usuario.findById( uid );
         //Validar exista usuario
         if(!usuario){
            return res.status(401).json({
                msg : "Usuario no encontrado"
            })
        }
        //Validar estado del usuario que hace petición
        if(!usuario.estado){
            return res.status(401).json({
                msg : "Sin autorización"
            })
        }

        req.uid = uid;
        req.usuario = usuario;

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: "No autorizado - token error"
        })
    }

}

module.exports = {
    validarJWT
}