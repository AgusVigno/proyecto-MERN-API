const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, res) => {
    //revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array() });
    }

    try {
        //crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);

        //seteamos el creador via JWT
        proyecto.creador = req.usuario.id;

        //guardamos el proyecto en la BD
        proyecto.save();
        res.json(proyecto);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error en el servidor'});
    }
}

//obtener todos los proyectos
exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ creado: -1 });
        res.json({proyectos});
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error en el servidor'});
    }
}

//actualizar proyecto por ID
exports.actualizarProyecto = async (req, res) => {
    //revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array() });
    }

    //extraer informacion del proyecto
    const {nombre} = req.body;
    const nuevoProyecto = {};

    if(nombre){
        nuevoProyecto.nombre = nombre;
    }

    try {
        //revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        //si el proyecto existe o no
        if(!proyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //verificar creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        //actualizar
        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, {$set: nuevoProyecto}, {new:true});

        res.json({proyecto});
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error en el servidor'});
    }
}

//eliminar proyecto por ID
exports.eliminarProyecto = async (req, res) => {
    try {
        //revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        //si el proyecto existe o no
        if(!proyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //verificar creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        //eliminar
        await Proyecto.findOneAndRemove({ _id: req.params.id });
        res.json({msg: 'Proyecto eliminado'});
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error en el servidor'});
    }
}