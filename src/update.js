const setBind = require("./setBind.js");
const select = require("./select.js");

const OrmUpdate = function(context, option){

    var data = {};
    var wheres = [];

    /**
     * table
     * @param {*} tableName 
     * @returns 
     */
    this.table = function(tableName){
        context.setTable(tableName);
        return this;
    };

    /**
     * data
     * @param {*} _data 
     * @returns 
     */
    this.data = function(_data){
        data = _data;
        return this;
    };

    /**
     * onGetData
     * @param {*} status 
     * @returns 
     */
    this.onGetData = function(status){
        context.setUpdateOnGetData(status);
        return this;
    };

    /**
     * _wheres
     * @param {*} where_ 
     * @returns 
     */
     this._wheres = function(where_){
        wheres = where_;
        return this;
    };
    
    /**
     * where
     * @param {*} field 
     * @param {*} operand 
     * @param {*} value 
     * @param {*} joinOperand 
     * @returns 
     */
    this.where = function(field, operand, value, joinOperand){
        wheres.push({
            field: field,
            operand: operand,
            value: value,
            joinOperand: joinOperand,
        });
        return this;
    };

    /**
     * surrogate
     * @param {*} surrogateId 
     * @returns 
     */
    this.surrogate = function(surrogateId){

        var operand = "=";
        if(Array.isArray(surrogateId)){
            operand = "IN";
            return this.where(context.getSurrogateKey(), "IN", surrogateId);
        }
        
        return this.where(context.getSurrogateKey(), operand, surrogateId);
    };

    /**
     * updateTimeStamp
     * @param {*} status 
     * @returns 
     */
     this.updateTimeStamp = function(status){
        context.setUpdateTimeStamp(status);
        return this;
    };

    /**
     * callback
     * @param {*} callback 
     * @returns 
     */
     this.callback = function(callback){
        context.updateCallback(callback);
        return this;
    };

    /**
     * getSqls
     * @returns 
     */
     this.getSqls = function(){

        var sql = "UPDATE";

        const setbinds = new setBind();

        if(context.getType() == "sqlite3"){
            sql += " " + context.getTable();
        }
        else{
            sql += " " + context.getDatabase() + "." + context.getTable();
        }

        var listStr = "";

        if(context.getUpdateTimeStamp()){
            var d = new Date();
            var nowDate = d.getFullYear()
                + "/" + ("00" + (d.getMonth() + 1)).slice(-2)
                + "/" + ("00" + d.getDate()).slice(-2) 
                + " " + ("00" + d.getHours()).slice(-2)
                + ":" + ("00" + d.getMinutes()).slice(-2)
                + ":" + ("00" + d.getSeconds()).slice(-2)
            ;
            
            data[context.getUpdateTimeStamp()] = nowDate;
        }

        if(data){
            var colums = Object.keys(data);
            for(var n = 0 ; n < colums.length ; n++){
                var field = colums[n];
                var value = data[field];

                if(n > 0){
                    listStr += ", ";
                }

                listStr += field + " = " + setbinds.set(value);
            }

        }

        sql += " SET " + listStr;

        if(wheres.length){
            sql += " WHERE";
            for(var n = 0 ; n < wheres.length ; n++){
                var w_ = wheres[n];

                if(n > 0){
                    sql += " " + w_.joinOperand;
                }

                if(w_.value == null){
                    if(w_.operand == "="){
                        w_.operand = "IS";
                    }
                    else if(w_.operand == "!="){
                        w_.operand = "IS NOT";
                    }
                }

                if(w_.operand == "IN"){
                    sql += " " + w_.field + " " + w_.operand + " (" + setbinds.set(w_.value) + ")";
                }
                else{
                    sql += " " + w_.field + " " + w_.operand + " " + setbinds.set(w_.value);
                }
            }
        }

        sql += ";"

        return {
            sql: sql,
            bind: setbinds.getBind(),
        };
    };
    
    /**
     * getSql
     * @returns 
     */
    this.getSql = function(){
        var sqls = this.getSqls();
        return context.getBindSql(sqls.sql, sqls.bind);
    };

    /**
     * run
     * @param {*} callback 
     * @returns 
     */
    this.run = function(callback){

        var updateCallback = context.updateCallback();
        if(updateCallback){
            var buff = updateCallback(data);
            if(buff){
                data = buff;
            }
        }

        var sqls = this.getSqls();

        context.bind(sqls.sql, sqls.bind, function(res){

            if(!res.result){
                return callback(res);
            }

            if(!context.getUpdateOnGetData()){
                return callback(res);
            }

            var select_ = new select(context);

            select_._wheres(wheres).get(callback);
        });
    };

    if(option){
        if(option.data){
            this.data(option.data);
        }

        if(option.onGetData){
            this.onGetData(option.onGetData);
        }

        if(option.wheres){
            for(var n = 0 ; n < option.wheres.length ; n++){
                var w_ = option.wheres[n];
                this.where(w_.field, w_.operand, w_.value,w_.joinOperand);
            }
        }

        if(option.surrogate){
            this.surrogate(option.surrogate);
        }

        if(option.updateTimeStamp){
            this.updateTimeStamp(option.updateTimeStamp);
        }
    }

};
module.exports = OrmUpdate;