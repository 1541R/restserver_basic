const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async (req, res = response) => {

    const { id_token } =  req.body;

    try {
        const { nombre, img, correo } = await googleVerify(id_token);
        //console.log(googleUSer);
        let usuario = await Usuario.findOne({ correo });

        if(!usuario){
            
            const data = { nombre, correo, img, password: ':P', google: true }
            usuario = new Usuario( data );
            await usuario.save();

        }

        //Validr usuario en estado: false
        if(!usuario.estado){
            return res.status(401).json({
                msg : 'Acceso denegado. usuario bloqueado'
            })
        }

        //Generar JSON Web TOken

        const token = await generarJWT( usuario.id )
        
        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        res.status(400).json({
            msg : "Token de google no es valido"
        })
    }

}

module.exports = {
    login,
    googleSignIn
}