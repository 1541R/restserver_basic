const { validationResult } = require('express-validator');

const validarCampos = ( req, res, next ) => {
    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status(400).json(
            errors
        )
    }
    next();
}

/*const soyunaPrueba = (req, res, next) => {
    console.log(req.body);
    next();
} */

module.exports = {
    validarCampos
}