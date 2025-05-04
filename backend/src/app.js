import express from 'express';
import cors from 'cors';
import proyectoRouter from './routers/proyectos.routers.js';
import avanceRouter from './routers/avance.router.js';

const app = express();

app.use(cors());
app.use(express.json());

//Rutas
app.use('/api/proyectos', proyectoRouter); // Ruta para los proyectos
app.use('/api/avances', avanceRouter); // Ruta para los avances

app.get('/', (req, res) => {
    res.send('Servidor backend funcionando');
});

export default app;