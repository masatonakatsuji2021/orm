const sqlite3 = require("sqlite3");

const OrmSqlite3 = function(option){

    this.type = "sqlite3";
    
    if(!option.path){
        option.path = "sqlite.sqlite";
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

    const db = new sqlite3.Database(option.path);

    /**
     * connection
     * @param {*} callback 
     */
    this.connection = function(callback){
        db.serialize(function(){
            callback({
                result: true,
            });
        });
    };

    /**
     * query
     * @param {*} sql 
     * @param {*} callback 
     * @returns 
     */
    this.query = function(sql, callback){

        var mode = "run";
        if(sql.indexOf("select") === 0){
            mode = "all";
        }

        if(mode == "run"){
            return db.run(sql,function(err){

                if(err){
                    callback({
                        result: false,
                        error: err,
                    });
                    return;
                }
      
                callback({
                    result: true,
                });
            });
        }
        else{
            return db[mode](sql, function(err, res){

                if(err){
                    callback({
                        result: false,
                        error: err,
                    });
                    return;
                }
      
                callback({
                    result: true,
                    res: res,
                });
            });    
        }
    };

};
module.exports = OrmSqlite3;