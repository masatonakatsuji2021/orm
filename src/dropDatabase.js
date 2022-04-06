const OrmDropDatabase = function(context, option){

    var databaseName;
    var dropOption = {};

    /**
     * database
     * @param {*} dbName 
     * @returns 
     */
    this.database = function(dbName){
        databaseName = dbName
        return this;
    };

    /**
     * ifExists
     * @param {*} status 
     * @returns 
     */
    this.ifExists = function(status){
        dropOption.ifExists = status;
        return this;
    };

    /**
     * getSql
     * @returns 
     */
    this.getSql = function(){

        var sql = "DROP DATABASE";

        if(dropOption.ifExists){
            sql += " IF EXISTS";
        }

        sql += " " + databaseName + ";";

        return sql;
    };

    /**
     * run
     * @param {*} callback 
     * @returns 
     */
    this.run = function(callback){

        var sql = this.getSql();
 
        if(context.getType() == "sqlite3"){
            return callback({
                result: true,
            });
        }
 
        return context.query(sql, callback);
    }

    if(option){

        if(option.database){    
            this.database(option.database);
        }
        if(option.ifExists){
            this.ifExists(option.ifExists);
        }
    }

};
module.exports = OrmDropDatabase;