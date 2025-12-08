import express from 'express';
import cors from 'cors';
import { config } from './config';
import { pool } from './db';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: 'API POA - Universidad de Sonsonate',
    status: 'funcionando',
    version: '2.0.0',
    typescript: true,
  });
});

app.use(routes);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`🚀 Servidor corriendo en puerto ${config.port}`);
  console.log(`📡 API disponible en http://localhost:${config.port}`);
  console.log(`🔷 TypeScript habilitado`);
});

process.on('SIGTERM', () => {
  pool.end();
  process.exit(0);
});
