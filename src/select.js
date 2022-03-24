const OrmSelect = function(context){

    var wheres = [];
    var fields = [];

    /**
     * fields
     * @param {*} values 
     * @returns 
     */
    this.fields = function(values){
        fields = values;
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

        if(!joinOperand){
            joinOperand = "AND";
        }

        wheres.push({
            field: field,
            operand: operand,
            value: value,
            joinOperand: joinOperand,
        });
        
        return this;
    };

    /**
     * getSqls
     * @returns 
     */
    this.getSqls = function(){

        var selectSql = "select";
        var binds = {};
        var bindIndex = 0;

        const setBind = function(value){
            bindIndex++;
            binds[bindIndex] = value;
            return ":" + bindIndex;
        };

        if(fields.length){
            var fieldStr = " ";
            for(var n = 0 ; n < fields.length ; n++){
                if(n > 0){
                    fieldStr += ", ";
                }
                fieldStr += fields[n];
            }

            selectSql += fieldStr;
        }
        else{
            selectSql += "*";
        }

        if(context.getType() == "sqlite3"){
            selectSql += " from " + context.getTable();
        }
        else{
            selectSql += " from " + context.getDatabase() + "." + context.getTable();
        }

        if(wheres.length){
            selectSql += " where";
            for(var n = 0 ; n < wheres.length ; n++){
                var w_ = wheres[n];

                if(n > 0){
                    selectSql += " " + w_.joinOperand;
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
                    selectSql += " " + w_.field + " " + w_.operand + " (" + setBind(w_.value) + ")";
                }
                else{
                    selectSql += " " + w_.field + " " + w_.operand + " " + setBind(w_.value);
                }
            }
        }

        selectSql += ";"

        return {
            sql: selectSql,
            bind: binds,
        };
    };

    /**
     * get
     * @param {*} callback 
     * @returns 
     */
    this.get = function(callback){
        var sqls = this.getSqls();
        return context.bind(sqls.sql, sqls.bind, callback);
    };

};
module.exports = OrmSelect;