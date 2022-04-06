/**
 * OrmDropView
 * @param {*} context 
 * @param {*} option 
 */
const OrmDropView = function(context, option){

    var viewOption = {};

    /**
     * view
     * @param {string} viewName View Name
     * @returns 
     */
    this.view = function(viewName){
        context.setTable(viewName);
        return this;
    };

    /**
     * viewOption
     * @param {*} _option 
     * @returns 
     */
    this.viewOption = function(_option){
        viewOption = _option;
        return this;
    };

    /**
     * ifExists
     * @param {*} status 
     * @returns 
     */
    this.ifExists = function(status){
        viewOption.ifExists = status;
        return this;
    };

    /**
     * getSql
     * 
     * @returns 
     */
     this.getSql = function(){

        var sql = "DROP VIEW\n";

        if(viewOption.ifExists){
            sql += " IF EXISTS";
        }

        if(context.getType() == "sqlite3"){
            sql += " " + context.getTable();
        }
        else{
            sql += " " + context.getDatabase() +  "." + context.getTable();
        }

        sql += ";"

        return sql;
    };

    /**
     * run
     * 
     * @param {*} callback 
     * @returns 
     */
    this.run = function(callback){
        var sql = this.getSql();
        return context.query(sql, callback);
    };

    if(option){



    }


};
module.exports = OrmDropView;