const { Router } =  require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarRol, existeEmail, existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete } = require('../controllers/usuarios');



const router = Router();

router.get('/', usuariosGet)

router.put('/:id', [
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom( validarRol ),
    validarCampos
], usuariosPut)

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe de contener mínimo 6 caracteres').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( existeEmail ),
    //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom( validarRol ),
    validarCampos
], usuariosPost)

router.delete('/:id', [
    //check('id', 'El id no es válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete)


module.exports = router;