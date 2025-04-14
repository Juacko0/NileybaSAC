import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 5000;

console.log('MONGODB_URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Conectado a MongoDB')
    app.listen(PORT, () => {
        console.log('Servidor escuchando en http://localhost:' + PORT);
    });
}).catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
});