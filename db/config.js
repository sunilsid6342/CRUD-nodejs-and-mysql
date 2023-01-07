// ejscrudmysql

const mysql=require("mysql")
const con=mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "Root",
    port: "3306",
    database: "ejscrudmysql"
});

con.connect(function(err) {
    if(err) throw err;
    console.log("connected succesful");
});

module.exports.con=con;