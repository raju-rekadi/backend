const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  database: "sample",
  user: "root",
  password: "12345678",
});

connection.connect(function (error) {
  if (error) {
    throw error;
  } else {
    // Query to create table
     var query = "CREATE TABLE IF NOT EXISTS users (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,firstname VARCHAR(30) NOT NULL,lastname VARCHAR(30) NOT NULL,email VARCHAR(50) NOT NULL,password VARCHAR(200) NOT NULL,gender VARCHAR(50) NOT NULL,status VARCHAR(50) NOT NULL,date date NOT NULL)";
     connection.query(query, (err, rows) => {
         if(err){
           console.log("table not created",err)
         }else{
           console.log("users table present")
         }
     })
    console.log("MySQL Database is connected Successfully");
  }
});

module.exports = connection;
