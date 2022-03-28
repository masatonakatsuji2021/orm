/*
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"test20220318",
});

connection.query("select * from test1 where id = ?",[
    "\" or \"\"=\"",
],function(err, res,opt,aaa){

    console.log(err);
    console.log(res);
});
*/

const pg = require("pg");

var client = new pg.Client({
    host: "localhost",
    user: "postgres",
    password: "",
    database:"monitor58g",
});

client.connect()


client.query({
    text: 'select * from test_table_0001 where id IN ($1)',
    values:[
        [1,3],
    ],
}, function(err, res){

    console.log(err);
    console.log(res);
    console.log(aaaa);

});