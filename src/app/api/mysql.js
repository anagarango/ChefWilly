import mysql from "mysql2/promise"
const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port:process.env.MYSQLPORT,
  connectionLimit: 3
});

// pool.getConnection(function(err, connection) {
//   connection.query( 'SELECT * FROM users', function(err, rows) {

//     console.log(pool._freeConnections.indexOf(connection)); // -1

//       connection.release();

//       console.log(pool._freeConnections.indexOf(connection)); // 0

//  });
// });

// export default pool

export default async function connection(query, values) {
  let connection;
  try {
    connection = await pool.getConnection();
    const result = await connection.query(query, values);
    return result;
  } finally {
    console.log(connection._events)
    if (connection) {
      connection.release();
    }
  }
}