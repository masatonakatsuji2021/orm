const setBind = require("./setBind.js");
const update = require("./update.js");

const OrmDelete = function(context, option){

    var wheres = [];

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
     * logicalDeleteKey
     * @param {*} keyName 
     * @returns 
     */
    this.logicalDeleteKey = function(keyName){
        context.logicalDeleteKey = keyName;
        return this;
    };

    /**
     * getSqls
     * @returns 
     */
     this.getSqls = function(){

        if(context.getLogicalDeleteKey()){

            var update_ = new update(context);
            var sqls = update_
                ._wheres(wheres)
                .data({
                    [context.getLogicalDeleteKey()]: 1,
                })
                .getSqls();

            return sqls;
        }
        else{

            var sql = "DELETE FROM";

            const setbinds = new setBind();
    
            if(context.getType() == "sqlite3"){
                sql += " " + context.getTable();
            }
            else{
                sql += " " + context.getDatabase() + "." + context.getTable();
            }
    
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
        }

     }

     /**
      * run
      * @param {*} callback 
      */
    this.run = function(callback){
        var sqls = this.getSqls();
        context.bind(sqls.sql, sqls.bind, function(res){
            callback(res);
/*
            if(!res.result){
                return callback(res);
            }

            if(!context.getUpdateOnGetData()){
                return callback(res);
            }

            var select_ = new select(context);

            select_._wheres(wheres).get(callback);
            */
        });
    };

};
module.exports = OrmDelete;