const { request, response } = require('express');
const { Categoria } = require('../models');


//Crear categoría con token
const crearCategoria = async (req = request, res = response) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB){
        return res.status(400).json({
            msg : "La categoría ya esxiste"
        });
    }

    //Generar Data
    const data = {
        nombre,
        created_by: req.usuario._id
    }

    const categoria = new Categoria(data);
    await categoria.save();

    res.status(201).json(
        categoria
    )

}

//Obtener todas las categorías
const obtenerCategorias = async ( req = request, res = response ) => {
    
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado : true };

    try {
        
        const [total, categorias] = await Promise.all([
            Categoria.countDocuments(query),
            Categoria.find(query)
                .populate('created_by', 'nombre')
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.json({
            total,
            categorias
        })

    } catch (error) {
        res.json({
            error
        })
    }
}

//Obtener categoría por id

const obtenerCategoriaPorId = async (req = request, res = response) => {
    const { id } = req.params;
    try {

        const categoria = await Categoria.findById(id).populate('created_by', 'nombre');

        res.status(200).json({
            categoria
        })
        
    } catch (error) {
        return res.status(500).json({
            msg : "Error en la consulta"
        })        
    }

}
//Actualizar categoría con token

const categoriaPut = async (req = request, res = response) => {

    const { id } = req.params;
    const { estado, created_by, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();

    try {

        const categoria = await Categoria.findByIdAndUpdate(id, data).populate('created_by', 'nombre');
        //console.log(categoria);
        if(!categoria){
            
            res.status(400).json({
                msg : "No se encontró la categoría"
            });

        }

        res.json({
            categoria
        })
    } catch (error) {
        return res.status(501).json({
            error
        })
    }

}

//Eliminar categoría con token
const categoriaDelete = async (req = request, res = response) => {

    const { id } = req.params;

    try {

        const categoria = await Categoria.findByIdAndUpdate(id, { estado : false })
                            .populate('created_by', 'nombre');
        
        res.json({
            categoria
        })

    } catch (error) {
        throw error;
    }

}
module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriaPorId,
    categoriaPut,
    categoriaDelete
}