const { Router } = require('express');
const { check } = require('express-validator');
const { productosGet, productosPost, obtenerProductoPorId, productoPut, productoDelete } = require('../controllers/productos');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');
const { validarCampos, validarJWT, porRole } = require('../middlewares');
const { route } = require('./categorias');

const router = Router();

//Obtener productos
router.get('/', productosGet);

//Obtener producto por id

router.get('/:id', [
    check('id', 'El id no es correcto').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProductoPorId);

//Crear producto
router.post('/', [
    validarJWT,
    porRole('ADMIN_ROLE'),
    check('nombre', 'El nombre del producto es requerido').notEmpty(),
    check('categoria', 'La categoría es requerida').notEmpty(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], productosPost);

//Actualizar producto por token

router.put('/:id', [
    validarJWT,
    porRole('ADMIN_ROLE'),
    check('id', 'El id no es correcto').isMongoId(),
    check('id').custom(existeProductoPorId),
    check('nombre', 'El nombre del producto es requerido').notEmpty(),
    validarCampos
], productoPut)

router.delete('/:id', [
    validarJWT,
    porRole('ADMIN_ROLE'),
    check('id', 'El id no es correcto').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], productoDelete);

module.exports = router;


