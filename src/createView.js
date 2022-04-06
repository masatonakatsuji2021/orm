/**
 * OrmCreateView
 * 
 * @param {*} context 
 * @param {*} option 
 */
const OrmCreateView = function(context, option){

    var viewSql = "";
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
     * ifNotExists
     * @param {*} status 
     * @returns 
     */
    this.ifNotExists = function(status){
        viewOption.ifNotExists = status;
        return this;
    };

    /**
     * sql
     * 
     * @param {*} _viewSql 
     * @returns 
     */
    this.sql = function(_viewSql){
        viewSql = _viewSql;
        return this;
    };

    /**
     * getSql
     * 
     * @returns 
     */
    this.getSql = function(){

        var sql = "CREATE VIEW\n";

        if(viewOption.ifNotExists){
            sql += " IF NOT EXISTS";
        }

        if(context.getType() == "sqlite3"){
            sql += " " + context.getTable();
        }
        else{
            sql += " " + context.getDatabase() +  "." + context.getTable();
        }

        sql += "\n AS\n" + viewSql;

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
module.exports = OrmCreateView;