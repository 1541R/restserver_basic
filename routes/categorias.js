const { Router, response } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, porRole } = require('../middlewares/index');

const { crearCategoria, obtenerCategorias, obtenerCategoriaPorId, categoriaPut, categoriaDelete } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();


//Obtener todas las categorías
router.get('/', obtenerCategorias)

//Obtener categoría por id
router.get('/:id',[
    check('id', 'El id no es válido').isMongoId(),
    validarCampos
] , obtenerCategoriaPorId)

//Crear categoría con token
router.post('/', [ validarJWT, 
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos
 ], crearCategoria )

//Actualizar categoría con token
router.put('/:id', [
    validarJWT,
    porRole('ADMIN_ROLE'),
    check('id').custom(existeCategoriaPorId),
    check('id', 'El id no es válido').isMongoId(),
    check('nombre', 'El nombre es obligatorio'),
    validarCampos
], categoriaPut)

//Eliminar categoría con token
router.delete('/:id', [
    validarJWT,
    porRole('ADMIN_ROLE'),
    check('id').custom(existeCategoriaPorId),
    check('id', 'El id no es válido').isMongoId(),
    validarCampos
], categoriaDelete)


module.exports = router;
