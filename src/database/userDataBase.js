import { dbClient } from '../config/dbConfigClient.js';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool(dbClient); 


pool.connect()
  .then(() => console.log('Conectou no DB server03'))
  .catch((err) => console.error('Erro na conexão do DB:', err));

export { pool }; 

