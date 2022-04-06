const mysql = require("mysql");

const OrmMysql = function(option){

    const logs = [];

    this.type = "mysql";
    this.sallogateKey = null;

    if(!option.host){
        option.host = "localhost";
    }

    if(!option.port){
        option.port = 3306;
    }

    if(!option.user){
        option.user = "root";
    }

    if(!option.password){
        option.password = "";
    }

    if(!option.database){
        option.database = "";
    }

    var dbSet = {
        host: option.host,
        port: option.port,
        user: option.user,
        password: option.password,
    };

    if(option.database){
        this.dbName = option.database;
    }

    // table name
    if(option.table){
        this.tableName = option.table;
    }

    // Surrogate Key
    if(option.surrogateKey){
        this.surrogateKey = option.surrogateKey;
    }

    // Insert On Get Data
    if(option.insertOnGetData){
        this.insertOnGetData = option.insertOnGetData;
    }

    // Update On Get Data
    if(option.updateOnGetData){
        this.updateOnGetData = option.updateOnGetData;
    }

    // Create Time Stamp
    if(option.createTimeStamp){
        this.createTimeStamp = option.createTimeStamp;
    }

    // Update Time Stamp
    if(option.updateTimeStamp){
        this.updateTimeStamp = option.updateTimeStamp;
    }

    // logical Delete Key
    if(option.logicalDeleteKey){
        this.logicalDeleteKey = option.logicalDeleteKey;
    }

    // select callback
    if(option.selectCallback){
        this.selectCallback = option.selectCallback;
    }

    // insert callback
    if(option.insertCallback){
        this.insertCallback = option.insertCallback;
    }

    // update callback
    if(option.updateCallback){
        this.updateCallback = option.updateCallback;
    }

    const connection = mysql.createConnection(dbSet);

    /**
     * connection
     * @param {*} callback 
     * @returns 
     */
    this.connection = function(callback){

        connection.connect(function(err){

            if(err){
                return callback({
                    result: false,
                    error: err,
                });
            }

            callback({
                result: true,
            });
        });

        return this;
    };

    /**
     * query
     * @param {*} sql 
     * @param {*} callback 
     * @returns 
     */
    this.query = function(sql, callback){

        return connection.query(sql, function(err, res){

            logs.push(sql);

            if(err){
                callback({
                    result: false,
                    sql: sql,
                    error: err,
                });
                return;
            }
  
            callback({
                result :true,
                sql: sql,
                res: res,
            });
        });
    };

    /**
     * getLog
     * @returns 
     */
    this.getLog = function(){
        return logs;
    };

};
module.exports = OrmMysql;