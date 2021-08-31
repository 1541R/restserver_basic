const { Categoria, Usuario, Role, Producto } = require('../models');


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

//Verificar si la Categoria existe
const existeCategoriaPorId = async ( id ) => {
    const findCategoria = await Categoria.findById(id);
    if(!findCategoria){
        throw new Error( `No existe categoría con el id ${id}` );
    }
}

//Verificar si el producto existe
const existeProductoPorId = async ( id ) => {
    const findProducto = await Producto.findById(id);
    if(!findProducto){
        throw new Error( `No existe producto con el id `+id );
    }
}

//Validar colecciones permitidas 

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {

    const coleccionIncluida = colecciones.includes(coleccion);

    if(!coleccionIncluida){
        throw new Error(`La colección ${coleccion} no es permitida - ${colecciones}`);
    }

    return true;

}

module.exports = {
    validarRol,
    existeEmail,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}