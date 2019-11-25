// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "admin",
//   database: "node_complete",
//   password: "50lek)1seI3"
// });

// module.exports = pool.promise();

const Sequelize = require("sequelize");

const sequelize = new Sequelize("node_complete", "admin", "50lek)1seI3", {
  dialect: "mysql",
  host: "localhost"
});

module.exports = sequelize;
