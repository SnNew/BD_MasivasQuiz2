const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres.zltnwpunevgoayvghunk',
  host: 'aws-0-us-east-1.pooler.supabase.com',
  database: 'postgres',
  password: '9ZIHfz64mmI3msWf',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

(async () => {
  try {
    const client = await pool.connect();
    console.log('Conectado exitosamente a Supabase');
    client.release();
  } catch (err) {
    console.error('Error al conectar con Supabase:', err.stack);
  }
})();

module.exports = pool;
