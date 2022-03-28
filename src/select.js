const setBind = require("./setBind.js");

const OrmSelect = function(context, option){

    var wheres = [];
    var fields = [];
    var orderBy = [];
    var limits = null;
    var offsets = null;

    /**
     * fields
     * @param {*} values 
     * @returns 
     */
    this.fields = function(values){
        for(var n = 0 ; n < values.length ; n++){
            var v_ = values[n];
            fields.push(v_);
        }
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
     * orderBy
     * @param {*} columnName 
     * @param {*} sort 
     * @returns 
     */
    this.orderBy = function(columnName, sort){
        orderBy.push({
            column: columnName,
            sort: sort,
        });
        return this;
    };

    /**
     * limit
     * @param {*} limit 
     * @returns 
     */
    this.limit = function(limit){
        limits = limit;
        return this;
    };

    /**
     * offset
     * @param {*} offset 
     * @returns 
     */
    this.offset = function(offset){
        offsets = offset;
        return this;
    };

    /**
     * paging
     * @param {*} PageIndex 
     * @returns 
     */
    this.paging = function(PageIndex){
        offsets = limits * (PageIndex - 1);
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
     * getSqls
     * @returns 
     */
    this.getSqls = function(){

        var selectSql = "select";

        const setBinds = new setBind();

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
            selectSql += " WHERE";
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
                    selectSql += " " + w_.field + " " + w_.operand + " (" + setBinds.set(w_.value) + ")";
                }
                else{
                    selectSql += " " + w_.field + " " + w_.operand + " " + setBinds.set(w_.value);
                }
            }
        }

        if(orderBy.length){
            selectSql += " ORDER BY";
            for(var n = 0 ; n < orderBy.length ; n++){
                var o_ = orderBy[n];
                if(n > 0){
                    selectSql += ",";
                }
                selectSql += " " + o_.column + " " + o_.sort;

            }
        }

        if(limits){
            if(!offsets){
                offsets = 0;
            }
            selectSql += " LIMIT " + offsets + "," + limits;
        }

        selectSql += ";"

        return {
            sql: selectSql,
            bind: setBinds.getBind(),
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

    /**
     * getCount
     * @param {*} callback 
     * @returns 
     */
    this.getCount = function(callback){
        fields = [
            "count(*) As count"
        ];
        return this.get(callback);
    };

    if(typeof option == "object"){
        if(option.where){
            for(var n = 0 ; n < option.where.length ; n++){
                var w_ = option.where[n];
                this.where(w_[0], w_[1], w_[2], w_[3]);
            }
        }

        if(option.surrogate){
            this.surrogate(option.surrogate);
        }

        if(option.field){
            this.fields(option.field);
        }

        if(option.orderBy){
            for(var n = 0 ; n < option.orderBy.length ; n++){
                var o_ = option.orderBy[n];
                this.orderBy(o_[0], o_[1]);
            }
        }

        if(option.limit){
            this.limit(option.limit);
        }

        if(option.paging){
            this.paging(option.paging);
        }
    }

};
module.exports = OrmSelect;