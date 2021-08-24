const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async (req, res = response) => {
    const { correo, password } = req.body;

    try {

        //Verificar si el email existe

        const usuario = await Usuario.findOne({ correo });
        if(!usuario){
            return res.status(400).json({
                msg: "El usuario o el passwrod no son correctos"
            })
        }


        //Verificar si usuario activo

        if(usuario.estado === false){
            return res.status(400).json({
                msg: "El usuario o el passwrod no son correctos - estado:false"
            })
        }

        //Verificar password

        const validPassword = bcryptjs.compareSync(password, usuario.password);

        if(!validPassword){
            return res.status(400).json({
                msg: "La contraseña es incorrecta"
            })
        }

        //Generar JWT

        const token = await generarJWT( usuario.id )

        res.json({
            usuario, 
            token
        })    
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Algo ha salido mal'
        })
    }

    
}

module.exports = {
    login
}