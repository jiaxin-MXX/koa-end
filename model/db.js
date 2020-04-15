var mysql = require('mysql');
var pool  = mysql.createPool({
  host            : 'localhost',
  user            : 'root',
  password        : '88888888',
  database        : 'phone'
});
 
module.exports = (sql, data=[]) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, data, function (error, results, fields) {
      if (error) {
        reject(error.message)
      } else {
        resolve(results)
      }
    })
  })
}
