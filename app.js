import 'dotenv/config';
import express from 'express';
import authRoutes from './src/routes/auth.route.js';
import userRoutes from './src/routes/user.routes.js';

const app = express();
const port = Number(process.env.APP_PORT) || 3000;

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.get('/test', (_req, res) => {
  res.status(200).json({ message: 'API funcionando' });
});

app.listen(port, () => {
  console.log(`API escuchando en el puerto ${port}`);
});