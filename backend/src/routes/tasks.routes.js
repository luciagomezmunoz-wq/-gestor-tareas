
 // Lucía Gómez Muñoz - 20/11/2026
const express = require('express');
const router = express.Router();

const tasksController = require('../controllers/tasks.controller');
const autenticar = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(autenticar);

// Estadísticas de tareas por equipo
router.get('/estadisticas/:teamId', tasksController.estadisticas);

// Consultar todas las tareas permitidas
router.get('/', tasksController.listar);

// Consultar una tarea por su ID
router.get('/:id', tasksController.obtener);

// Crear una tarea
router.post('/', tasksController.crear);

// Actualizar una tarea
router.put('/:id', tasksController.actualizar);
router.patch('/:id', tasksController.actualizar);

// Eliminar una tarea
router.delete('/:id', tasksController.eliminar);

module.exports = router;
