const OrmCreateDatabase = function(context, option){

    var databaseName;
    var databaseOption = {};

    this.database = function(name, opt){
        databaseName = name;

        if(opt){
            databaseOption = opt;
        }

        return this;
    };

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

    this.run = function(callback){
        var sql = this.getSql();
        return context.query(sql, callback);
    };

};
module.exports = OrmCreateDatabase;