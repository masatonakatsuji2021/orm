const mysql = require("mysql");

const OrmMysql = function(option){

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
    if(option.UpdateTimeStamp){
        this.UpdateTimeStamp = option.UpdateTimeStamp;
    }

    // logical Delete Key
    if(option.logicalDeleteKey){
        this.logicalDeleteKey = option.logicalDeleteKey;
    }

    const connection = mysql.createConnection(dbSet);

    /**
     * connection
     * @param {*} callback 
     * @param {*} errCallback 
     * @returns 
     */
    this.connection = function(callback, errCallback){

        connection.connect(function(err){

            if(err){
                errCallback(err);
            }
            else{
                callback();
            }
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
};
module.exports = OrmMysql;