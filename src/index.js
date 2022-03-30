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
const transaction = require("./transaction.js");
const sync = require("./sync.js");

/**
 * ORM
 * 
 * OR-Mapping Class
 * @param {ConnectionSetting} connectionSetting SQL Connection Settings
 * 
 * @example  <caption>case MySQL:</caption>
 * new Orm({
 *      type: "mysql",
 *      host: "localhost",
 *      port: 3306,
 *      user: "root"
 *      password: "****",
 *      database: "database01",
 * })
 * 
 * @example <caption>Case PostgreSQL:</caption>
 * new Orm({
 *      type: "pgsql",
 *      host: "localhost",
 *      port: 5432,
 *      user: "postgres"
 *      password: "****",
 *      database: "database01",
 * })
 * 
 * @example <caption>case SQLite3:</caption>
 * new Orm({
 *      type: "sqlite3",
 *      path: "sqlite_server.sqlite",
 * })
 * 
 * @returns {ORM} ORM Object Class
 */
const Orm = function(connectionSetting){

    var connection;

    if(!connectionSetting){
        connectionSetting = {};
    }

    /**
     * setting
     * Execute SQL connection settings.
     * @param {*} newConnection SQL Connection Settings
     * @returns {ORM} ORM Object Class
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

    // Initial load
    this.setting(connectionSetting);

    /**
     * connection
     * Manually start the database connection.
     * @param {function} callback Callback function after database connection is completed
     * @returns {ORM} ORM Object Class
     */
    this.connection = function(callback){
        connection.connection(callback);
        return this;
    };

    /**
     * query
     * 
     * Manually execute any SQL request.
     * After requesting SQL, execute the callback function.
     * @param {string} sql SQL Code 
     * @param {function} callback Callback function after SQL request completion.
     * @param {function} beforeCallback 
     * @returns {OrmQuery} ORM Query Object Class
     */
    this.query = function(sql, callback, beforeCallback){
        return new OrmQuery(sql, connection, callback, beforeCallback);
    };

    /**
     * getType
     * 
     * Get the type of SQL Server   
     * 
     * MySQL = mysql,   
     * Sqlite3 = sqlite3,   
     * PostgreSQL = pgsql  
     * 
     * ete...
     * 
     * @returns {string} type of SQL Server
     */
    this.getType = function(){
        return connection.type;
    };

    /**
     * getDatabase
     * 
     * Get the database name (schema name)
     * @returns {string} database name
     */
    this.getDatabase = function(){
        return connection.dbName;
    };

    /**
     * setDatabase
     * 
     * Change the setting of the database name (schema name) to connect.
     * 
     * @param {string} dbName Connect to database name (schema name)
     * @returns {ORM} ORM Object Class
     */
    this.setDatabase = function(dbName){
        connection.dbName = dbName;
        return this;
    };

    /**
     * getTable
     * 
     * Gets the destination database table name.
     * 
     * @returns {string} destination database table name.
     */
    this.getTable = function(){
        return connection.tableName;
    };

    /**
     * setTable
     * 
     * Set the destination database table name.
     * 
     * @param {string} tableName destination database table name.
     * @returns {ORM} ORM Object Class
     */
    this.setTable = function(tableName){
        connection.tableName = tableName;
        return this;
    };

    /**
     * getSurrogateKey
     * 
     * Get the surrogate key name
     * 
     * @returns {string} surrogate key name
     */
    this.getSurrogateKey = function(){
        return connection.surrogateKey;
    };

    /**
     * setSurrogateKey
     * 
     * Set the surrogate key name
     * 
     * @param {string} keyName surrogate key name
     * @returns {ORM} ORM Object Class
     */
    this.setSurrogateKey = function(keyName){
        connection.surrogateKey = keyName;
        return this;
    };

    /**
     * getUpdateOnGetData
     * 
     * Acquires record information acquisition settings when updating records.
     * 
     * @returns {boolean} Record information acquisition settings when updating records
     */
    this.getUpdateOnGetData = function(){
        return connection.updateOnGetData;
    };

    /**
     * setUpdateOnGetData
     * 
     * Updates the record information acquisition settings when updating records.
     * 
     * @param {boolean} status Record information acquisition settings when updating records
     * @returns {ORM} ORM Object Class
     */
    this.setUpdateOnGetData = function(status){
        connection.updateOnGetData = status;
        return this;
    };

    /**
     * getInsertOnGetData
     * 
     * Acquires the record information acquisition settings when registering a record.
     * 
     * @returns {boolean} Record information acquisition settings when registering records
     */
    this.getInsertOnGetData = function(){
        return connection.insertOnGetData;
    };

    /**
     * setInsertOnGetData
     * 
     * Updates the record information acquisition settings when registering records
     * 
     * @param {boolean} status Record information acquisition settings when registering records
     * @returns {ORM} ORM Object Class
     */
    this.setInsertOnGetData = function(status){
        connection.insertOnGetData = status;
        return this;
    };

    /**
     * getCreateTimeStamp
     * 
     * Get the column name that is automatically set for the record creation date and time.
     * 
     * @returns {string} Record creation date and time automatic setting Column name
     */
    this.getCreateTimeStamp = function(){
        return connection.createTimeStamp;
    };

    /**
     * setCreateTimeStamp
     * 
     * Automatic setting of record creation date and time Set the column name.
     * 
     * @param {string} stampeName Record creation date and time automatic setting Column name
     * @returns {ORM} ORM Object Class
     */
    this.setCreateTimeStamp = function(stampeName){
        connection.createTimeStamp = stampeName;
        return this;
    };

    /**
     * getUpdateTimeStamp
     * 
     * Get the automatic setting column name of record update date and time.
     * 
     * @returns {string} Record update date and time automatic setting Column name
     */
    this.getUpdateTimeStamp = function(){
        return connection.updateTimeStamp;
    };

    /**
     * setUpdateTimeStamp
     * 
     * Automatic setting of record update date and time Set the column name.
     * 
     * @param {string} stampeName Record update date and time automatic setting Column name
     * @returns {ORM} ORM Object Class
     */
    this.setUpdateTimeStamp = function(stampeName){
        connection.updateTimeStamp = stampeName;
        return this;
    };

    /**
     * getLogicalDeleteKey
     * 
     * Gets the column name for record logical deletion.
     * 
     * @returns {string} Column name for record logical deletion
     */
    this.getLogicalDeleteKey = function(){
        return connection.logicalDeleteKey;
    };

    /**
     * setLogicalDeleteKey
     * 
     * Set the column name for record logical deletion.
     * 
     * @param {string} keyName name for record logical deletion 
     * @returns {ORM} ORM Object Class
     */
    this.setLogicalDeleteKey = function(keyName){
        connection.logicalDeleteKey = keyName;
        return this;
    };

    /**
     * selectCallback
     * 
     * Specify the callback function immediately after getting the record. 
     * 
     * @param {function} callback Callback function immediately after record acquisition
     * @returns {ORM} ORM Object Class
     */
    this.selectCallback = function(callback){
        if(callback != undefined){
            connection.selectCallback = callback;
            return this;
        }
        else{
            return connection.selectCallback;
        }
    };

    /**
     * insertCallback
     * 
     * Set the execution callback function just before record registration.
     * 
     * @param {function} callback Execution callback function just before record registration
     * @returns {ORM} ORM Object Class
     */
    this.insertCallback = function(callback){
        if(callback != undefined){
            connection.insertCallback = callback;
            return this;
        }
        else{
            return connection.insertCallback;
        }
    };

    /**
     * updateCallback
     * 
     * Specifies the execution callback function just before the record update
     * 
     * @param {function} callback Execution callback function just before record update
     * @returns {ORM} ORM Object Class
     */
    this.updateCallback = function(callback){
        if(callback != undefined){
            connection.updateCallback = callback;
            return this;
        }
        else{
            return connection.updateCallback;
        }
    };

    /**
     * sanitize
     * 
     * Perform sanitization for SQL.
     * 
     * @param {string} str Character string to be sanitized 
     * @returns {string} String after sanitization
     */
    this.sanitize = function(str){

        str = str.toString();
        str = str.split('"').join("\\\"");
        str = str.split("'").join('\\\'');
        return str;
    };

    /**
     * getBindSql
     * 
     * Generate executable SQL from prepared statement SQL and variable information.
     * 
     * @param {string} sql Prepared statement SQL
     * @param {object} values Variable information
     * @returns {string} Executable SQL
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

            sql = sql.replace("{:" + field + "}", value);
        }

        return sql;
    };

    /**
     * bind
     * 
     * Prepared statement Binds a variable to SQL and executes a SQL request.
     * 
     * @param {string} sql Prepared statement SQL
     * @param {object} values Variable information
     * @param {function} callback Callback function after SQL execution
     * @returns {OrmQuery} ORM Query Object Class
     */
    this.bind = function(sql, values, callback, beforeCallback){
        sql = this.getBindSql(sql, values);
        return this.query(sql, callback, beforeCallback);
    };

    /**
     * select
     * 
     * Gets the record acquisition class object.  
     * It is also possible to specify conditions in the argument and execute record acquisition as it is.
     * 
     * @param {object} [option] option settings
     * @returns {select} ORM Select Object Class
     */
    this.select = function(option){
        return new select(this, option);
    };

    /**
     * insert
     * 
     * Get the class object for record registration.  
     * You can also execute the record registration process directly by using the argument.
     * 
     * @param {object} [option] option settings 
     * @returns {insert} ORM Insert Object Class
     */
    this.insert = function(option){
        return new insert(this, option);
    };

    /**
     * update
     * 
     * 
     * 
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

    /**
     * then
     * @param {function} callback Callback
     * @returns 
     */
    this.then = function(callback){
        return sync(this, callback);
    };

    /**
     * transaction
     * @param {function} callback "Begin" After Callback,
     * @param {function} [commitCallback] "commit" after Callback,
     * @param {function} [rollbackCallback] "rollback" after Callback.
     * @returns OrmTransaction Class Object
     */
    this.transaction = function(callback, commitCallback, rollbackCallback){
        return new transaction(this, callback, commitCallback, rollbackCallback);
    };

    /**
     * trs (= transaction)
     * @param {function} callback "Begin" After Callback,
     * @param {function} [commitCallback] "commit" after Callback,
     * @param {function} [rollbackCallback] "rollback" after Callback.
     * @returns OrmTransaction Class Object
     */
    this.trs = this.transaction;

    /**
     * begin
     * @param {*} callback 
     * @returns 
     */
    this.begin = function(callback){
        const transactions = new transaction(this);
        return transactions.begin(callback);
    };

    /**
     * commit
     * @param {*} callback 
     * @returns 
     */
    this.commit = function(callback){
        const transactions = new transaction(this);
        return transactions.commit(callback);
    };

    /**
     * rollback
     * @param {*} callback 
     * @param {*} error 
     * @returns 
     */
    this.rollback = function(callback, error){
        const transactions = new transaction(this);
        return transactions.rollback(callback, error);
    };

};
module.exports = Orm;