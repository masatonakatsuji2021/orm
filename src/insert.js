const setBind = require("./setBind.js");
const select = require("./select.js");

const OrmInsert = function(context, option){

    var data = {};

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
        context.setInsertOnGetData(status);
        return this;
    };

    /**
     * createTimeStamp
     * @param {*} status 
     * @returns 
     */
    this.createTimeStamp = function(status){
        context.setCreateTimeStamp(status);
        return this;
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
     * getSqls
     * @returns 
     */
    this.getSqls = function(){

        var sql = "INSERT INTO";
        
        const setbinds = new setBind();

        if(context.getType() == "sqlite3"){
            sql += " " + context.getTable();
        }
        else{
            sql += " " + context.getDatabase() + "." + context.getTable();
        }

        var fieldsListStr = "";
        var valueListStr = "";

        if(
            context.getCreateTimeStamp() ||
            context.getUpdateTimeStamp()
        ){

            var d = new Date();
            var nowDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

            if(context.getCreateTimeStamp()){
                data[context.getCreateTimeStamp()] = nowDate;
            }
    
            if(context.getUpdateTimeStamp()){
                data[context.getUpdateTimeStamp()] = nowDate;
            }
        }

        if(data){
            var colums = Object.keys(data);
            for(var n = 0 ; n < colums.length ; n++){
                var field = colums[n];
                var value = data[field];

                if(n > 0){
                    fieldsListStr += ", ";
                    valueListStr += ", ";
                }

                fieldsListStr += field;
    
                valueListStr += setbinds.set(value);
            }

        }

        sql += "(" + fieldsListStr + ") VALUES (" + valueListStr + ")";

        sql += ";"

        return {
            sql:sql,
            bind: setbinds.getBind(),
        };
    };

    /**
     * run
     * @param {*} callback 
     * @returns 
     */
    this.run = function(callback){
        var sqls = this.getSqls();
        return context.bind(sqls.sql, sqls.bind, function(res){

            if(!res.result){
                return callback(res);
            }

            if(
                !context.getInsertOnGetData() ||
                !context.getSurrogateKey() 
            ){
                return callback(res);
            }

            var insertId;
            if(context.getType() == "mysql"){
                insertId = res.res.insertId;
            }

            var select_ = new select(context);

            select_.where(context.getSurrogateKey(), "=", insertId).get(callback);
        });
    };

    if(option){
        if(option.data){
            this.data(option.data);
        }

        if(option.onGetData){
            this.onGetData(option.onGetData);
        }

        if(option.createTimeStamp){
            this.createTimeStamp(option.createTimeStamp);
        }

        if(option.updateTimeStamp){
            this.updateTimeStamp(option.updateTimeStamp);
        }
    }

};
module.exports = OrmInsert;