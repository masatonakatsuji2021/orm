const OrmCreateTable = function(context, option){

    var tableName;
    var tableOption = null;
    var colums = [];

    this.table = function(name, opt){
        tableName = name;

        if(opt){
            tableOption = opt;
        }

        return this;
    };

    this.addColumn = function(opt){
        colums.push(opt);
        return this;
    };

    /**
     * getSql
     * @returns 
     */
    this.getSql = function(){

        var createTable;

        if(context.getType() == "mysql"){
            createTable = require("./createTableMysql.js");
        }
        else if(context.getType() == "pgsql"){
            createTable = require("./createTablePgsql.js");
        }
        else if(context.getType() == "sqlite3"){
            createTable = require("./createTableSqlite3.js");
        }
        else if(context.getType() == "oracle"){
            createTable = require("./createTableOracle.js");
        }

        var sql = createTable(context, tableName, tableOption, colums);

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
    };

    if(option){
        if(option.table){

            var _opt = null;
            if(option.option){
                _opt = option.option;
            }
    
            this.table(option.table, _opt);
        }

        if(option.colums){
            colums = option.colums;
        }
    }

};
module.exports = OrmCreateTable;