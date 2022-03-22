const sqlite3 = require("sqlite3");

const OrmSqlite3 = function(option){

    if(!option.path){
        option.path = "sqlite.sqlite";
    }

    const db = new sqlite3.Database(option.path);

    /**
     * connection
     * @param {*} callback 
     */
    this.connection = function(callback){
        db.serialize(function(){
            callback();
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
            return db.run(sql);
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