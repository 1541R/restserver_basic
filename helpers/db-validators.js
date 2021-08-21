const Role = require('../models/role');
const Usuario = require('../models/usuario');

const validarRol = async (rol) =>{
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
        throw new Error(`El ${rol} no está registrado en la base de datos`);
    }
} 

//Verificar si el correo existe
const existeEmail = async ( correo ) => {
    const findEmail = await Usuario.findOne({ correo });
    if(findEmail){
        throw new Error( `El correo ${correo} ya se encuntra registrado` );
    }
}

//Verificar si el id existe
const existeUsuarioPorId = async ( id ) => {
    const findUsuario = await Usuario.findById(id);
    if(!findUsuario){
        throw new Error( `No existe usuario con el id `+id );
    }
}


module.exports = {
    validarRol,
    existeEmail,
    existeUsuarioPorId
}