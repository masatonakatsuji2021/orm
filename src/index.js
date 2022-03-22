module.exports = function(option){

    var connection;

    if(!option){
        return;
    }

    if(!option.type){
        option.type = "mysql";
    }

    if(option.type == "mysql"){
        const mysql = require("./mysql.js");
        connection = new mysql(option);
    }
    else if(option.type == "pgsql"){
        const pgsql = require("./pgsql.js");
        connection = new pgsql(option);
    }
    else if(option.type == "sqlite3"){
        const sqlite3 = require("./sqlite3.js");
        connection = new sqlite3(option);
    }
    else if(option.type == "oracle"){
        const oracle = require("./oracle.js");
        connection = new oracle(option);
    }

    /**
     * connection
     * @param {*} callback 
     * @returns 
     */
    this.connection = function(callback){
        connection.connection(callback);
        return this;
    };

    /**
     * query
     * @param {*} sql 
     * @param {*} callback 
     * @returns 
     */
    this.query = function(sql, callback){
        return connection.query(sql, callback);
    };

};