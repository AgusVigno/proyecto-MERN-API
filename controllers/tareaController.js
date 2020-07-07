const Proyecto = require('../models/Proyecto');
const Tarea = require('../models/Tarea');
const { validationResult } = require('express-validator');

exports.crearTarea = async (req, res) => {
    //revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array() });
    }

    
    try {
        //extraer el proyecto y comprobar si existe
        const {proyecto} = req.body;
        
        //revisar el ID
        let existeProyecto = await Proyecto.findById(proyecto);

        //si el proyecto existe o no
        if(!existeProyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //verificar creador del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        //creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea});
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error en el servidor'});
    }
}

//obtener todos los proyectos
exports.obtenerTareas = async (req, res) => {
    try {
        //extraer el proyecto y comprobar si existe
        const {proyecto} = req.body;
        
        //revisar el ID
        let existeProyecto = await Proyecto.findById(proyecto);

        //si el proyecto existe o no
        if(!existeProyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //verificar creador del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        } 

        //obtener las tareas
        const tareas = await Tarea.find({ proyecto });
        res.json({tareas});
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error en el servidor'});
    }
}

//actualizar proyecto por ID
exports.actualizarTarea = async (req, res) => {
    try {
        // Extraer el proyecto y comprobar si existe
        const { proyecto, nombre, estado } = req.body;


        // Si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea) {
            return res.status(404).json({msg: 'No existe esa tarea'});
        }

        // extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({msg: 'No Autorizado'});
        }
        // Crear un objeto con la nueva información
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        // Guardar la tarea
        tarea = await Tarea.findOneAndUpdate({_id : req.params.id }, nuevaTarea, { new: true } );

        res.json({ tarea });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}

//eliminar proyecto por ID
exports.eliminarTarea = async (req, res) => {
    try {
        // Extraer el proyecto
        const { proyecto } = req.body;

        //revisar el ID
        let tarea = await Tarea.findById(req.params.id);

        //si la tarea existe o no
        if(!tarea){
            return res.status(404).json({msg: 'Tarea no encontrada'});
        }

        // buscar proyecto en la BD
        const existeProyecto = await Proyecto.findById(proyecto);

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({msg: 'No Autorizado'});
        }

        //eliminar
        await Tarea.findOneAndRemove({ _id: req.params.id });
        res.json({msg: 'Tarea eliminada'});
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error en el servidor'});
    }
}
