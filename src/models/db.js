const mysql = require('mysql2');
const database = require('../config/database');

const db = mysql.createConnection({
  host: database.HOST,
  user: database.USER,
  password: database.PASSWORD,
  database: database.DB
});

// Kết nối đến cơ sở dữ liệu
db.connect((err) => {
  if (err) {
    console.error('Không thể kết nối đến cơ sở dữ liệu:', err);
  } else {
    console.log('Kết nối thành công đến cơ sở dữ liệu');
  }
});



module.exports = db;