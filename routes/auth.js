//rutas para autenticar usuario
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');

//crea un usuario
// api/auth
router.post('/',
    [
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El password debe tener minimo 6 caracteres').isLength({min:6})
    ],
    authController.autenticarUsuario 
);

module.exports = router;