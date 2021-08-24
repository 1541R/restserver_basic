const { response } = require('express');

const adminRole = (req, res = response, next) => {

    if(!req.usuario){
        return res.status(500).json({
            msg: "No se generó token correctamente"
        })
    }

    const { rol, nombre } = req.usuario;

    if(rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg : "Sin permisos"
        })
    }

    next();
}

const porRole = ( ...roles ) => {


    return ( req, res = response, next ) =>{
        if(!req.usuario){
            return res.status(500).json({
                msg: "No se generó token correctamente"
            })
        }

        if(!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg : `Operación permitida solo para usuarios con los siguientes roles: ${roles}`
            })
        }

        console.log(roles);
        next();
    }

    

}

module.exports = {
    adminRole,
    porRole
}