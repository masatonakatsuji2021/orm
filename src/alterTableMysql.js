const OrmAlterTableMysql = function(context, tableName, alterOption){

    var sql = "ALTER TABLE";

    sql += " " + context.getDatabase() + "." + tableName;

    for(var n = 0 ; n < alterOption.length ; n++){

        var columsStr = "";

        if(n > 0){
            columsStr += ", ";
        }

        var ao_ = alterOption[n];

        if(ao_.mode == "renameTable"){
            columsStr += "\n  RENAME " + context.getDatabase() + "." + ao_.renameTable;
        }
        else if(ao_.mode == "deleteColumn"){
            columsStr += "\n  DROP " + ao_.deleteColumn;
        }
        else if(ao_.mode == "addColumn"){

            columsStr += "\n  ADD " + ao_.option.name + " " + ao_.option.type;

            if(ao_.option.length){
                columsStr += "(" + ao_.option.length + ")";
            }
    
            /*
            if(ao_.primaryKey){
                primaryKeys.push(ao_.name);
            }
            */
    
            if(ao_.option.notNull){
                columsStr += " NOT NULL";
            }
    
            if(ao_.option.autoIncrement){
                columsStr += " AUTO_INCREMENT";
            }
    
            if(ao_.option.default !== undefined){
                if(typeof ao_.option.default == "string"){
                    columsStr += " DEFAULT \"" + ao_.option.default + "\"";
                }
                else{
                    columsStr += " DEFAULT " + ao_.option.default;
                }
            }
    
            if(ao_.option.comment){
                columsStr += " COMMENT \"" + ao_.option.comment + "\"";
            }
    
            if(ao_.option.after){
                columsStr += " AFTER " + ao_.option.after;
            }    
        }

        sql += columsStr;
    }

    sql += ";";

    return sql;
};

module.exports = OrmAlterTableMysql;