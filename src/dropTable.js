const OrmDropTable = function(context, option){

    var dropOption = {};

    /**
     * table
     * @param {*} name 
     * @param {*} opt 
     * @returns 
     */
    this.table = function(name, opt){
        context.setTable(name);

        if(opt){
            dropOption = opt;
        }

        return this;
    };

    /**
     * ifExists
     * @param {*} status 
     * @returns 
     */
    this.ifExists = function(status){
        dropOption.ifExists = status;
        return this;
    };

    /**
     * getSql
     * @returns 
     */
    this.getSql = function(){

        var sql = "DROP TABLE";

        if(dropOption.ifExists){
            sql += " IF EXISTS";
        }

        if(context.getType() == "sqlite3"){
            sql += " " + context.getTable();
            ;
        }
        else{
            sql += " " + context.getDatabase() + "." + context.getTable();
        }

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
    }

    if(option){

        var _opt = {};
        if(option.option){
            _opt = option.option;
        }

        if(option.table){
            this.table(option.table, _opt);
        }
        if(option.ifExists){
            this.ifExists(option.ifExists);
        }
    }

};
module.exports = OrmDropTable;