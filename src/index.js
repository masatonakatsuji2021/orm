const OrmQuery = require("./query.js");
const mysql = require("./mysql.js");
const pgsql = require("./pgsql.js");
const sqlite3 = require("./sqlite3.js");
const oracle = require("./oracle.js");
const select = require("./select.js");
const insert = require("./insert.js");
const update = require("./update.js");
const deletes = require("./delete.js");
const createDatabase = require("./createDatabase.js");
const createTable = require("./createTable.js");
const dropTable = require("./dropTable.js");
const alterTable = require("./alterTable.js");

module.exports = function(option){

    var connection;

    /*
    if(!option.type){
        option.type = "mysql";
    }
    */

    if(!option){
        option = {};
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
     * setting
     * @param {*} newConnection 
     * @returns 
     */
    this.setting = function(newConnection){

        if(newConnection.type == "mysql"){
            connection = new mysql(newConnection);
        }
        else if(newConnection.type == "pgsql"){
            connection = new pgsql(newConnection);
        }
        else if(newConnection.type == "sqlite3"){
            connection = new sqlite3(newConnection);
        }
        else if(newConnection.type == "oracle"){
            connection = new oracle(newConnection);
        }
        return this;
    };

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

    /**
     * getType
     * @returns 
     */
    this.getType = function(){
        return connection.type;
    };

    /**
     * getDatabase
     * @returns 
     */
    this.getDatabase = function(){
        return connection.dbName;
    };

    /**
     * setDatabase
     * @param {*} dbName 
     * @returns 
     */
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
     * getSurrogateKey
     * @returns 
     */
    this.getSurrogateKey = function(){
        return connection.surrogateKey;
    };

    /**
     * setSurrogateKey
     * @param {*} keyName 
     * @returns 
     */
    this.setSurrogateKey = function(keyName){
        connection.surrogateKey = keyName;
        return this;
    };

    /**
     * getUpdateOnGetData
     * @returns 
     */
    this.getUpdateOnGetData = function(){
        return connection.updateOnGetData;
    };

    /**
     * setUpdateOnGetData
     * @param {*} status 
     * @returns 
     */
    this.setUpdateOnGetData = function(status){
        connection.updateOnGetData = status;
        return this;
    };

    /**
     * getInsertOnGetData
     * @returns
     */
    this.getInsertOnGetData = function(){
        return connection.insertOnGetData;
    };

    /**
     * setInsertOnGetData
     * @param {*} status 
     * @returns 
     */
    this.setInsertOnGetData = function(status){
        connection.insertOnGetData = status;
        return this;
    };

    /**
     * getCreateTimeStamp
     * @returns 
     */
    this.getCreateTimeStamp = function(){
        return connection.createTimeStamp;
    };

    /**
     * setCreateTimeStamp
     * @param {*} status 
     * @returns 
     */
    this.setCreateTimeStamp = function(status){
        connection.createTimeStamp = status;
        return this;
    };

    /**
     * getUpdateTimeStamp
     * @returns 
     */
    this.getUpdateTimeStamp = function(){
        return connection.updateTimeStamp;
    };

    /**
     * setUpdateTimeStamp
     * @param {*} status 
     * @returns 
     */
    this.setUpdateTimeStamp = function(status){
        connection.updateTimeStamp = status;
        return this;
    };

    /**
     * getLogicalDeleteKey
     * @returns 
     */
    this.getLogicalDeleteKey = function(){
        return connection.logicalDeleteKey;
    };

    /**
     * setLogicalDeleteKey
     * @param {*} keyName 
     * @returns 
     */
    this.setLogicalDeleteKey = function(keyName){
        connection.logicalDeleteKey = keyName;
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

                        var v = value[n2];

                        if(n2){
                            _buff += ", ";
                        }

                        if(v === null){
                            _buff += "null";
                        }
                        else if(typeof v === "number"){
                            _buff += v;
                        }
                        else{
                            _buff += "\"" + this.sanitize(v) + "\"";
                        }
                    }
                    value = _buff;
                }
            }
            else{
                if(value === null){
                    value = "NULL";
                }
                else if(typeof value === "number"){
                    value = value;
                }
                else{
                    value = "\"" + this.sanitize(value) + "\"";
                }
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
     * @param {*} option 
     * @returns 
     */
    this.select = function(option){
        return new select(this, option);
    };

    /**
     * insert
     * @param {*} option 
     * @returns 
     */
    this.insert = function(option){
        return new insert(this, option);
    };

    /**
     * update
     * @param {*} option 
     * @returns 
     */
    this.update = function(option){
        return new update(this, option);
    };

    /**
     * deleete
     * @param {*} option 
     * @returns 
     */
     this.delete = function(option){
        return new deletes(this, option);
    };

    /**
     * createDatabase
     * @param {*} option 
     * @returns 
     */
    this.createDatabase = function(option){
        return new createDatabase(this, option);
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
     * dropTable
     * @param {*} option 
     * @returns 
     */
    this.dropTable = function(option){
        return new dropTable(this, option);
    };

    /**
     * alterTable
     * @param {*} option 
     * @returns 
     */
    this.alterTable = function(option){
        return new alterTable(this, option);
    };
};