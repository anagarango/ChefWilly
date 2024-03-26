import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  connectionLimit: 150
});

// Handle application shutdown to release all connections in the pool
process.on('beforeExit', async () => {
  console.log('Closing MySQL connections...');
  await pool.end();
  console.log('MySQL connections closed.');
});

export default async function connection(query, values) {
  let connect;
  try {
    connect = await pool.getConnection();
    const result = await connect.query(query, values);
    return result;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  } finally {
    pool.releaseConnection(connect)
    if(connect){
      connect.release()
    } 
  }
}
