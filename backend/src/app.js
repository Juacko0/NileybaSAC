import express from 'express';
import cors from 'cors';
import proyectoRouter from './routers/proyectos.routers.js';
import avanceRouter from './routers/avance.router.js';
import empleadoRouter from './routers/empleado.router.js';
import eppRouter from './routers/epp.routers.js';

const app = express();

app.use(cors());
app.use(express.json());

//Rutas
app.use('/api/proyectos', proyectoRouter); // Ruta para los proyectos
app.use('/api/avances', avanceRouter); // Ruta para los avances
app.use('/api/empleados', empleadoRouter); // Ruta para los empleados
app.use('/api/epp', eppRouter); // Ruta para las entregas de EPP

app.get('/', (req, res) => {
    res.send('Servidor backend funcionando');
});

export default app;