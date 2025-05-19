import express from 'express';
import cors from 'cors';
import proyectoRouter from './routers/proyectos.routers.js';
import avanceRouter from './routers/avance.router.js';
import empleadoRouter from './routers/empleado.router.js';
import eppRouter from './routers/epp.routers.js';
import asistenciaRouter from './routers/asistencia.router.js';
import Factura from './routers/factura.router.js'; // Asegúrate de que la ruta sea correcta

const app = express();

app.use(cors());
app.use(express.json());

//Rutas
app.use('/api/proyectos', proyectoRouter); // Ruta para los proyectos
app.use('/api/avances', avanceRouter); // Ruta para los avances
app.use('/api/empleados', empleadoRouter); // Ruta para los empleados
app.use('/api/epp', eppRouter); // Ruta para las entregas de EPP
app.use('/api/asistencias', asistenciaRouter); // Ruta para las asistencias
app.use('/api/facturas', Factura); // Ruta para las facturas

app.get('/', (req, res) => {
    res.send('Servidor backend funcionando');
});

export default app;