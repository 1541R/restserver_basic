const { response, request } = require('express');


const usuariosGet = (req = request, res = response) => {
    const { token, numero, sucursal = 'Sin sucursal' } = req.query;
    const { nombre, edad } = req.body;
    
    res.json({
        message: "get API - controller",
        nombre,
        edad,
        token,
        numero,
        sucursal
    })

}

const usuariosPut = (req, res =  response) => {
    const { id } = req.params;
    res.json({
        ok: true,
        id
    })
}

const usuariosPost = (req, res) => {
    res.json({
        ok: true,
        message: "post API - controller"
    })
}

const usuariosDelete = (req, res) => {
    res.json({
        ok: true,
        message: "delete API - controller"
    })
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}