const validarCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validarRoles = require('../middlewares/validar-rol');
const validarArchivo = require('../middlewares/validar-archivo');

module.exports = {
    ...validarArchivo,
    ...validarCampos,
    ...validarJWT,
    ...validarRoles
}