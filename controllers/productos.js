const { request, response } = require('express');
const { Producto } = require('../models');

const productosGet = async ( req = request, res = response ) => {
    try {
        
        const { limite = 5, desde = 0 } = req.query;
        const query = { estado : true };
        
        const [total, productos] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query)
                .populate('created_by', 'nombre')
                .populate('categoria', 'nombre')
                .skip( Number(desde) )
                .limit( Number(limite) )
        ]);
        res.json({
            total,
            productos
        })

    } catch (error) {
        res.status(500).json({
            error
        })
    }
}

const obtenerProductoPorId = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findById(id)
            .populate('created_by', 'nombre')
            .populate('categoria', 'nombre');

        res.json({
            producto
        })

    } catch (error) {
        res.status(500).json({
            error
        })
    }
}

const productosPost = async ( req = request, res = response ) => {

    try {
        /** nombre estado created_by precio categoria descricion disponible */   
        if(req.usuario._id){     
            const nombre = req.body.nombre.toUpperCase();
            const productoDB = await Producto.findOne({nombre});
            //console.log(productoDB);
            if(productoDB){
                return res.status(400).json({
                    msg : `La categoría con el nombre ${productoDB.nombre} ya existe`
                })
            }
            const { precio, categoria, descricion, disponible = true } = req.body;
            const created_by = req.usuario._id
            const producto = new Producto({ nombre, precio, categoria, descricion, disponible, created_by })

            await producto.save();

            res.json({
                producto
            })
        }else{
            res.status(500).json({
                msg : "id Usuario"
            })
        }
    } catch (error) {
        res.status(500).json({
            error
        })
    }

}

//Actualizar producto por token 

const productoPut = async (req =  request, res =  response) => {
    try {
        
        const { id } = req.params;
        const { estado, created_by, ...data } = req.body;

        data.nombre = data.nombre.toUpperCase();

        const producto = await Producto.findByIdAndUpdate(id, data)
            .populate('created_by', 'nombre');

        if(!producto){
            res.status(400).json({
                msg : "No se encontró la categoría"
            })
        }

        res.json({
            producto
        })

    } catch (error) {
        res.status(500).json({
            error
        });
    }
}

const productoDelete = async ( req = request, res =  response ) => {
    try {
        
        const { id } = req.params;

        const producto = await Producto.findByIdAndUpdate(id, { estado : false })
            .populate('created_by', 'nombre');
        
            res.json({
                producto
            })

    } catch (error) {
        
            throw error
        
    }
}

module.exports = {
    productosGet,
    productosPost,
    obtenerProductoPorId,
    productoPut,
    productoDelete
}