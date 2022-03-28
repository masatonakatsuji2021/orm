const sqlite3 = require("sqlite3");

const OrmDropTable = function(context, option){

    var tableName;
    var dropOption = {};

    /**
     * table
     * @param {*} name 
     * @param {*} opt 
     * @returns 
     */
    this.table = function(name, opt){
        tableName = name;

        if(opt){
            dropOption = opt;
        }

        return this;
    };

    /**
     * getSql
     * @returns 
     */
    this.getSql = function(){

        var sql = "DROP TABLE";

        if(dropOption.ifNotExists){
            sql += " IF NOT EXISTS";
        }

        sql += " " + context.getDatabase() + "." + tableName;

        sql += ";"

        return sql;
    };

    /**
     * run
     * @param {*} callback 
     * @returns 
     */
    this.run = function(callback){
        var sql = this.getSql();
        return context.query(sql, callback);
    }

    if(option){
        if(option.table){
            var _opt = {};
            if(option.option){
                _opt = option.option;
            }
            this.table(option.table, _opt);
        }
    }

};
module.exports = OrmDropTable;