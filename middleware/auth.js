const jwt = require('jsonwebtoken');

module.exports = function (req, res, next){
    //leer el token del header
    const token = req.header('x-auth-token');

    //revisar si no hay token
    if(!token){
        return res.status(401).json({msg: 'Permiso denegado, no hay token'});
    }

    //validar el token
    try{
        const cifrado = jwt.verify(token, process.env.SECRETA);
        req.usuario = cifrado.usuario;
        next(); //para que pase al siguiente middleware
    }catch(error){
        return res.status(401).json({msg: 'Permiso denegado, token invalido'});
    }
}