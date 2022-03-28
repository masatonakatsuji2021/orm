const OrmAlterTable = function(context, option){

    var tableName;
    var alterOption = [];

    this.table = function(name){
        tableName = name;
        return this;
    };

    /**
     * renameTable
     * @param {*} renameTableName 
     * @returns 
     */
    this.renameTable = function(renameTableName){
        alterOption.push({
            mode: "renameTable",
            renameTable: renameTableName,
        });
        return this;
    };

    /**
     * deleteColumn
     * @param {*} deleteColumnName 
     * @returns 
     */
     this.deleteColumn = function(deleteColumnName){
        alterOption.push({
            mode: "deleteColumn",
            deleteColumn: deleteColumnName,
        });
        return this;
    };

    /**
     * addColumn
     * @param {*} option 
     * @returns 
     */
    this.addColumn = function(option){
        alterOption.push({
            mode: "addColumn",
            option: option,
        });
        return this;
    };


    /**
     * getSql
     * @returns 
     */
    this.getSql = function(){

        if(context.getType() == "mysql"){
            const alterTable = require("./alterTableMysql.js");
        }
        else if(context.getType() == "pgsql"){
            const alterTable = require("./alterTablePgsql.js");
        }
        else if(context.getType() == "sqlite3"){
            const alterTable = require("./alterTableSqlite3.js");
        }
        else if(context.getType() == "oracle"){
            const alterTable = require("./alterTableOracle.js");
        }

        var sql = alterTable(context, tableName, alterOption);   

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

};
module.exports = OrmAlterTable;


