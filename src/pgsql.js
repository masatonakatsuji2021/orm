const pgsql = require("pgsql");

const OrmPgsql = function(option){

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

    var client = new pgsql.Client(dbSet);

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