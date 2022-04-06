const OrmTruncate = function(context, option){

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
     * getSql
     * @returns 
     */
    this.getSql = function(){
        var sql = "TRUNCATE TABLE " + context.getTable() + ";"; 
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

};
module.exports = OrmTruncate;