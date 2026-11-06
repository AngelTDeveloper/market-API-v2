import { sequelize } from './src/models/index.js';

try {
  await sequelize.sync({alter: true});
  console.log('Modelos sincronizados con la base de datos.');
} catch (error) {
  console.error('Error al sincronizar los modelos con la base de datos:', error);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}