const mysql = require("mysql");

const OrmMysql = function(option){

    this.type = "mysql";

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