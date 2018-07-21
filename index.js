var express = require('express')
var app = express()
const path = require('path')
var bodyParser = require('body-parser')
//var config = require("./config");
var mysql = require('mysql')
var port = process.env.PORT || 5000;


app.use(bodyParser.urlencoded({ extended:true}))
app.use(bodyParser.json()) 


var poolConfig = {
    connectionLimit: 10,
    user: "root",
    password: "",
    database: "ShowerDB",
    debug: false,
    host:'127.0.0.1',
    connectTimeout: 120000,
    timeout: 120000,
    multipleStatements: true
};

var connectionPool = mysql.createPool(poolConfig);
//require('./routes/authenticate')(app)

var settings={
    app:app,
    connectionPool:connectionPool
}
if(process.env.NODE_ENV==='production'){
    app.use(express.static('client/build'))
    const path = require('path')
    res.sendFile(path.resolve(__dirname,'client','build','index.html'))
}
require('./routes/api')(settings)
app.listen(port)
console.log("**listening on port: "+port+"**")