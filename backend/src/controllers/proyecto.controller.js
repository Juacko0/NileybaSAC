import mongoose from "mongoose";
import Proyecto from "../models/Proyecto.js";

//Crear nuevo proyecto
export const crearProyecto = async (req, res) => {
    try {
        const nuevoproyecto = new Proyecto(req.body);
        await nuevoproyecto.save();
        res.status(201).json(nuevoproyecto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el proyecto' });
    }
};

//Listar todos los proyectos
export const listarProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find().populate('empleadosAsignados');
        res.status(200).json(proyectos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al listar los proyectos' });
    }
};

//Obtener un proyecto por ID
export const obtenerProyecto = async (req, res) => {
  try {
      const { id } = req.params;

      // Validación del ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: 'ID de proyecto no válido' });
      }

      // Obtener el proyecto con empleados asignados poblados
      const proyecto = await Proyecto.findById(id).populate('empleadosAsignados');

      if (!proyecto) {
          return res.status(404).json({ message: 'Proyecto no encontrado' });
      }

      res.status(200).json(proyecto);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener el proyecto' });
  }
};

// Actualizar un proyecto
export const actualizarProyecto = async (req, res) => {
    try {
      const proyectoActualizado = await Proyecto.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!proyectoActualizado) {
        return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
      }
      res.json(proyectoActualizado);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // Eliminar un proyecto
  export const eliminarProyecto = async (req, res) => {
    try {
      const proyectoEliminado = await Proyecto.findByIdAndDelete(req.params.id);
      if (!proyectoEliminado) {
        return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
      }
      res.json({ mensaje: 'Proyecto eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Agregar una tarea a un proyecto
export const agregarTarea = async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);
    if (!proyecto) return res.status(404).json({ mensaje: 'Proyecto no encontrado' });

    console.log("Datos recibidos en req.body:", req.body); // <-- Aquí
    const { titulo, descripcion, fechaInicio, fechaFin, estado } = req.body;

    proyecto.tareas.push({
      titulo,
      descripcion,
      fechaInicio,
      fechaFin,
      estado
    });

    await proyecto.save();

    const nuevaTarea = proyecto.tareas[proyecto.tareas.length - 1];
    res.status(200).json(nuevaTarea);
  } catch (error) {
    console.error("Error en agregarTarea:", error); // <-- Esto ayuda mucho
    res.status(500).json({ mensaje: 'Error al agregar tarea', error: error.message });
  }
};


// Eliminar una tarea de un proyecto
export const eliminarTarea = async (req, res) => {
    try {
        const { id, tareaId } = req.params;
        const proyecto = await Proyecto.findById(id);
        if (!proyecto) return res.status(404).json({ mensaje: 'Proyecto no encontrado' });

        proyecto.tareas = proyecto.tareas.filter(t => t._id.toString() !== tareaId);
        await proyecto.save();
        res.status(200).json({ mensaje: 'Tarea eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar tarea', error: error.message });
    }
};

// Actualizar el estado de una tarea dentro de un proyecto
export const actualizarEstadoTarea = async (req, res) => {
  try {
    const { idProyecto, idTarea } = req.params;
    const { estado } = req.body;
    console.log('Estado recibido:', estado);
    // Validar estado permitido
    const estadosPermitidos = ['pendiente', 'en progreso', 'completada'];
    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({ mensaje: 'Estado no válido' });
    }

    const proyecto = await Proyecto.findById(idProyecto);
    if (!proyecto) return res.status(404).json({ mensaje: 'Proyecto no encontrado' });

    const tarea = proyecto.tareas.id(idTarea);
    if (!tarea) return res.status(404).json({ mensaje: 'Tarea no encontrada' });

    tarea.estado = estado;
    await proyecto.save();

    res.status(200).json(tarea); // Solo devolvemos la tarea actualizada
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el estado de la tarea', error: error.message });
  }
};


// Obtener resumen de avance del proyecto
export const generarReporteProyecto = async (req, res) => {
    try {
      const { id } = req.params;
      const proyecto = await Proyecto.findById(id);
  
      if (!proyecto) {
        return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
      }
  
      const totalTareas = proyecto.tareas.length;
      const completadas = proyecto.tareas.filter(t => t.estado === 'completada').length;
      const enProgreso = proyecto.tareas.filter(t => t.estado === 'en progreso').length;
      const pendientes = proyecto.tareas.filter(t => t.estado === 'pendiente').length;
  
      const progresoCalculado = totalTareas > 0 ? Math.round((completadas / totalTareas) * 100) : 0;
  
      const reporte = {
        nombreProyecto: proyecto.nombre,
        totalTareas,
        completadas,
        enProgreso,
        pendientes,
        progresoCalculado,
        fechaInicio: proyecto.fechaInicio,
        fechaFin: proyecto.fechaFin,
      };
  
      res.json(reporte);
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al generar el reporte del proyecto' });
    }
  };

// Obtener todas las tareas de un proyecto
export const obtenerTareasProyecto = async (req, res) => {
    try {
        const { id } = req.params;
        const proyecto = await Proyecto.findById(id).populate('tareas');
        if (!proyecto) return res.status(404).json({ mensaje: 'Proyecto no encontrado' });

        res.status(200).json(proyecto.tareas);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las tareas del proyecto', error: error.message });
    }
};

export const nombresProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({}, '_id nombre'); // Solo extrae id y nombre
    res.json(proyectos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener nombres de proyectos' });
  }
};