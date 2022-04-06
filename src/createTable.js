const OrmCreateTable = function(context, option){

    var tableOption = {};
    var colums = [];

    /**
     * table
     * @param {*} name 
     * @param {*} opt 
     * @returns 
     */
    this.table = function(name, opt){
        context.setTable(name);

        if(opt){
            tableOption = opt;
        }

        return this;
    };

    /**
     * tableOption
     * @param {*} _option 
     * @returns 
     */
    this.tableOption = function(_option){
        tableOption = _option;
        return this;
    };

    /**
     * getTable
     * @returns 
     */
    this.getTable = function(){
        return context.getTable();
    };

    /**
     * reCreate
     * @param {*} reCreate 
     * @returns 
     */
    this.reCreate = function(reCreate){
        tableOption.reCreate = reCreate;
        return this;
    };

    /**
     * ifNotExists
     * @param {*} status 
     * @returns 
     */
     this.ifNotExists = function(status){
        tableOption.ifNotExists = status;
        return this;
    };

    /**
     * engine
     * @param {*} engine 
     * @returns 
     */
     this.engine = function(engine){
        tableOption.engine = engine;
        return this;
    };

    /**
     * character
     * @param {*} character 
     * @returns 
     */
    this.character = function(character){
        tableOption.character = character;
        return this;
    };

    /**
     * defaultCharset
     * @param {*} defaultCharset 
     */
    this.defaultCharset = function(defaultCharset){
        tableOption.defaultCharset = defaultCharset;
        return this;
    };

    /**
     * collate
     * @param {*} collate 
     * @returns 
     */
    this.collate = function(collate){
        tableOption.collate = collate;
        return this;
    }

    /**
     * addColumn
     * @param {*} opt 
     * @returns 
     */
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

        var sql = createTable(context, context.getTable(), tableOption, colums);

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
            this.table(option.table);
        }
        if(option.option){
            this.tableOption(option.option);
        }

        if(option.colums){
            colums = option.colums;
        }
    }

};
module.exports = OrmCreateTable;