const { Router } =  require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');



const router = Router();

router.post('/login', [
    check('correo', 'Debes ingresar un correo').isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    validarCampos 
],
login);

router.post('/google', [
    check('id_token', 'No se ha recibido el token de acceso').notEmpty(),
    validarCampos
], googleSignIn)


module.exports = router;
