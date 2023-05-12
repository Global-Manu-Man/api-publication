const mysql = require('mysql');

const db = mysql.createConnection({

    host:process.env.HOST,
    user:process.env.DB_USERNAME,
    password:process.env.PASSWORD,
    database:process.env.DB_NAME
});
db.connect((err)=>{

    if(err){
        console.log(err);

    }else{

        console.log("Connected");
    }
})

module.exports = db;