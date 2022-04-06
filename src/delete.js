const setBind = require("./setBind.js");
const update = require("./update.js");

const OrmDelete = function(context, option){

    var wheres = [];
    var physicalDelete;

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
     * physicalDelete
     * @param {*} status 
     * @returns 
     */
    this.physicalDelete = function(status){
        physicalDelete = status;
        return this;
    };

    /**
     * logicalDeleteSql
     * @returns 
     */
    const logicalDeleteSql = function(){

        var update_ = new update(context);
        var sqls = update_
            ._wheres(wheres)
            .data({
                [context.getLogicalDeleteKey()]: 1,
            })
            .getSqls();

        return sqls;
    };

    /**
     * physicalDeleteSql
     * @returns 
     */
    const physicalDeleteSql = function(){

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
    };


    /**
     * getSqls
     * @returns 
     */
     this.getSqls = function(){

        if(context.getLogicalDeleteKey()){

            if(physicalDelete){
                // Get Physical Delete Sql
                return physicalDeleteSql();
            }
            else{
                // Get Logical Delete Sql
                return logicalDeleteSql();
            }
        }
        else{
            // Get Physical Delete Sql
            return physicalDeleteSql();
        }

     }

     /**
      * getSql
      * @returns 
      */
     this.getSql = function(){
        var sqls = this.getSqls();
        return context.getBindSql(sqls.sql, sqls.bind);
     }


    /**
      * run
      * @param {*} callback 
      */
    this.run = function(callback){
        var sqls = this.getSqls();
        context.bind(sqls.sql, sqls.bind, function(res){
            callback(res);
        });
    };

};
module.exports = OrmDelete;