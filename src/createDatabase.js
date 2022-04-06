const OrmCreateDatabase = function(context, option){

    var databaseName;
    var databaseOption = {};

    /**
     * database
     * @param {*} name 
     * @param {*} opt 
     * @returns 
     */
    this.database = function(name, opt){
        databaseName = name;

        if(opt){
            databaseOption = opt;
        }

        return this;
    };

    /**
     * databaseOption
     * @param {*} dbOpt 
     * @returns 
     */
    this.databaseOption = function(dbOpt){
        databaseOption = dbOpt;
        return this;
    }

    /**
     * getDatabase
     * @returns 
     */
    this.getDatabase = function(){
        return databaseName;
    };

    /**
     * ifNotExists
     * @param {*} status 
     * @returns 
     */
    this.ifNotExists = function(status){
        databaseOption.ifNotExists = status;
        return this;
    };

    /**
     * character
     * @param {*} character 
     * @returns 
     */
    this.character = function(character){
        databaseOption.character = character;
        return this;
    };

    /**
     * collate
     * @param {*} collate 
     * @returns 
     */
    this.collate = function(collate){
        databaseOption.collate = collate;
        return this;
    }

    /**
     * getSql
     * @returns 
     */
    this.getSql = function(){

        var sql = "CREATE DATABASE";

        if(databaseOption){
            if(databaseOption.ifNotExists){
                sql += " IF NOT EXISTS";
            }
        }

        sql += " " + databaseName;

        if(databaseOption){
            if(databaseOption.character){
                sql += " CHARACTER SET " + databaseOption.character;
            }
            if(databaseOption.collate){
                sql += " COLLATE " + databaseOption.collate;
            }
        }

        sql += ";\n";

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
    };

    if(option){
        if(option.database){
            this.database(option.database);
        }
        if(option.option){
            this.databaseOption(optin.option);
        }
        if(option.ifNotExists){
            this.ifNotExists(option.ifNotExists);
        }
        if(option.character){
            this.character(option.character);
        }
        if(option.collate){
            this.collate(option.collate);
        }
    }
};
module.exports = OrmCreateDatabase;