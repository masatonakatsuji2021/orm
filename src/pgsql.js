const pg = require("pg");

const OrmPgsql = function(option){

    this.type = "pgsql";

    if(!option.host){
        option.host = "localhost";
    }

    if(!option.port){
        option.port = 5432;
    }

    if(!option.user){
        option.user = "postgres";
    }

    if(!option.password){
        option.password = "";
    }

    var dbSet = {
        host: option.host,
        port: option.port,
        user: option.user,
        password: option.password,
    };

    if(option.database){
        dbSet.database = option.database;
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

    var client = new pg.Client(dbSet);

    client.connect()
    
    /**
     * connection
     * @param {*} callback 
     * @returns 
     */
    this.connection = function(callback){
        callback();
        return this;
    };

    /**
     * query
     * @param {*} sql 
     * @param {*} callback 
     * @returns 
     */
    this.query = function(sql, callback){

        return client.query({text:sql}, function(err, res){
            if (err) {
                callback({
                    result: false,
                    error: err,
                });
                return;         
            }

            callback({
                result: true,
                res: res.rows,
            });
        });
    };

};
module.exports = OrmPgsql;