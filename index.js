import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mainRoutes from './routes/main.routes.js';
import { PORT } from './routes/config.js';
import { corsHandler } from './middlewares/corsHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Middlewares
app.use(corsHandler);   // Configuración unificada de CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Middleware para parsear cookies
app.use(morgan('dev'));

// Todas las rutas definidas en server/routes/index.js
app.use('/api', mainRoutes);

// Ruta raíz informativa
app.get('/', (req, res) => res.send('Proyecto final PP4 - API'));

// Arranca servidor
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

app.use(errorHandler);

export default app;
