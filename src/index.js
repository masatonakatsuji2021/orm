module.exports = function(option){

    var connection;

    if(!option){
        return;
    }

    if(!option.type){
        option.type = "mysql";
    }

    if(option.type == "mysql"){
        const mysql = require("./mysql.js");
        connection = new mysql(option);
    }
    else if(option.type == "pgsql"){
        const pgsql = require("./pgsql.js");
        connection = new pgsql(option);
    }
    else if(option.type == "sqlite3"){
        const sqlite3 = require("./sqlite3.js");
        connection = new sqlite3(option);
    }
    else if(option.type == "oracle"){
        const oracle = require("./oracle.js");
        connection = new oracle(option);
    }

    /**
     * connection
     * @param {*} callback 
     * @returns 
     */
    this.connection = function(callback){
        connection.connection(callback);
        return this;
    };

    /**
     * query
     * @param {*} sql 
     * @param {*} callback 
     * @returns 
     */
    this.query = function(sql, callback){
        return connection.query(sql, callback);
    };

    /**
     * sanitize
     * @param {*} str 
     * @returns 
     */
    this.sanitize = function(str){

        str = str.toString();
        str = str.split('"').join("\\\"");
        str = str.split("'").join('\\\'');
        return str;
    };

    /**
     * bind
     * @param {*} sql 
     * @param {*} values 
     * @param {*} callback 
     * @returns 
     */
    this.bind = function(sql, values, callback){

        var colums = Object.keys(values);
        for(var n = 0 ; n < colums.length ; n++){
            var field = colums[n];
            var value = values[field];

            if(typeof value == "object"){
                if(Array.isArray(value)){
                    var _buff = "";
                    for(var v = 0 ; v < value.length ; v++){
                        if(v){
                            _buff += ", ";
                        }
                        _buff += "\"" + this.sanitize(value[v]) + "\"";
                    }

                    value = _buff;
                }
            }
            else{
                value = this.sanitize(value);
            }

            sql = sql.replace(":" + field, value);
        }

        return this.query(sql, callback);
    };

    
};