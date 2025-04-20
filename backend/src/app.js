import express from 'express';
import cors from 'cors';
import proyectoRouter from './routers/proyectos.routers.js';

const app = express();

app.use(cors());
app.use(express.json());

//Rutas
app.use('/api/proyectos', proyectoRouter); // Ruta para los proyectos

app.get('/', (req, res) => {
    res.send('Servidor backend funcionando');
});

export default app;