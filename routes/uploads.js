const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarCampos, validarArchivoGet } = require('../middlewares');
const router = Router();


router.post('/', validarArchivoGet, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoGet,
    check('id', 'No es un id válido').isMongoId(),
    check('coleccion').custom( co => coleccionesPermitidas( co, ['usuarios','productos'] ) ),
    validarCampos
], actualizarImagenCloudinary);
//actualizarImagen
router.get('/:coleccion/:id',[
    check('id', 'No es un id válido').isMongoId(),
    check('coleccion').custom( co => coleccionesPermitidas( co, ['usuarios', 'productos'] ) ),
    validarCampos
], mostrarImagen);

module.exports = router;