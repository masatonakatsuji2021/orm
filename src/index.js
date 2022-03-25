const OrmQuery = require("./query.js");
const mysql = require("./mysql.js");
const pgsql = require("./pgsql.js");
const sqlite3 = require("./sqlite3.js");
const oracle = require("./oracle.js");
const select = require("./select.js");
const createTable = require("./createTable.js");

module.exports = function(option){

    var connection;

    if(!option){
        return;
    }

    if(!option.type){
        option.type = "mysql";
    }

    if(option.type == "mysql"){
        connection = new mysql(option);
    }
    else if(option.type == "pgsql"){
        connection = new pgsql(option);
    }
    else if(option.type == "sqlite3"){
        connection = new sqlite3(option);
    }
    else if(option.type == "oracle"){
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
        return new OrmQuery(sql, connection, callback);
    };

    this.getType = function(){
        return connection.type;
    };

    this.getDatabase = function(){
        return connection.dbName;
    };

    this.setDatabase = function(dbName){
        connection.dbName = dbName;
        return this;
    };

    /**
     * getTable
     * @returns 
     */
    this.getTable = function(){
        return connection.tableName;
    };

    /**
     * setTable
     * @param {*} tableName 
     * @returns 
     */
    this.setTable = function(tableName){
        connection.tableName = tableName;
        return this;
    };

    /**
     * sanitize
     * @param {*} str 
     * @returns 
     */
    this.sanitize = function(str){

        str = str.toString();
        str = str.split('"').join("\\\"");
        str = str.split("'").join('\\\'');
        return str;
    };

    /**
     * getBindSql
     * @param {*} sql 
     * @param {*} values 
     * @returns 
     */
    this.getBindSql = function(sql, values){

        var colums = Object.keys(values);
        for(var n = 0 ; n < colums.length ; n++){
            var field = colums[n];
            var value = values[field];

            if(typeof value == "object"){
                if(Array.isArray(value)){
                    var _buff = "";
                    for(var n2 = 0; n2 < value.length ; n2++){
                        if(n2){
                            _buff += ", ";
                        }
                        _buff += "\"" + this.sanitize(value[n2]) + "\"";
                    }
                    value = _buff;
                }
            }
            else{
                value = "\"" + this.sanitize(value) + "\"";
            }

            sql = sql.replace(":" + field, value);
        }

        return sql;
    };

    /**
     * bind
     * @param {*} sql 
     * @param {*} values 
     * @param {*} callback 
     * @returns 
     */
    this.bind = function(sql, values, callback){
        sql = this.getBindSql(sql, values);
        return this.query(sql, callback);
    };

    /**
     * select
     * @returns 
     */

    /**
     * select
     * @param {*} option 
     * @returns 
     */
    this.select = function(option){
        return new select(this, option);
    };

    /**
     * createTable
     * @param {*} option 
     * @returns 
     */
    this.createTable = function(option){
        return new createTable(this, option);
    };

    /**
     * sanitize
     * @param {*} str 
     * @returns 
     */
    this.sanitize = function(str){

        str = str.toString();
        str = str.split('"').join("\\\"");
        str = str.split("'").join('\\\'');
        return str;
    };

    /**
     * bind
     * @param {*} sql 
     * @param {*} values 
     * @param {*} callback 
     * @returns 
     */
    this.bind = function(sql, values, callback){

        var colums = Object.keys(values);
        for(var n = 0 ; n < colums.length ; n++){
            var field = colums[n];
            var value = values[field];

            if(typeof value == "object"){
                if(Array.isArray(value)){
                    var _buff = "";
                    for(var v = 0 ; v < value.length ; v++){
                        if(v){
                            _buff += ", ";
                        }
                        _buff += "\"" + this.sanitize(value[v]) + "\"";
                    }

                    value = _buff;
                }
            }
            else{
                value = this.sanitize(value);
            }

            sql = sql.replace(":" + field, value);
        }

        return this.query(sql, callback);
    };

    
};