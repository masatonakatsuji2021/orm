const OrmCreateTableMysql = function(context, tableName, tableOption, colums){

    var sql = "CREATE TABLE";

    if(tableOption){
        if(tableOption.ifNotExists){
            sql += " IF NOT EXISTS";
        }
    }

    sql += " " + context.getDatabase() + "." + tableName + " ";

    /*
    if(context.getType() == "sqlite3"){
        sql += " " + tableName + " ";
    }
    else{

    }
    */

    if(colums.length){
        var primaryKeys = [];
        var columsList = "(\n";
        for(var n = 0 ; n < colums.length ; n++){
            if(n > 0){
                columsList += ", \n";
            }
            var c_ = colums[n];

            /*
            if(c_.autoIncrement){
                if(context.getType() == "pgsql"){
                    c_.name = "serial";
                }
            }
            */

            columsList += "  " + c_.name + " " + c_.type;

            if(c_.length){
                columsList += "(" + c_.length + ")";
            }

            if(c_.primaryKey){
                /*
                if(
                    context.getType() == "mysql" || 
                    context.getType() == "pgsql"
                ){
                */
                    primaryKeys.push(c_.name);
                /*
                }
                else if(context.getType() == "sqlite3"){

                }
                */
            }
        
            if(c_.notNull){
                columsList += " NOT NULL";
            }

            if(c_.autoIncrement){
                /*
                if(context.getType() == "mysql"){
                */
                    columsList += " AUTO_INCREMENT";
                /*
                }
                else if(context.getType() == "sqlite3"){

                }
                */
            }

            if(c_.default !== undefined){
                if(typeof c_.default == "string"){
                    columsList += " DEFAULT \"" + c_.default + "\"";
                }
                else{
                    columsList += " DEFAULT " + c_.default;
                }
            }

            if(c_.comment){
                columsList += " COMMENT \"" + c_.comment + "\"";
            }
        }
        
        /*
        if(
            context.getType() == "mysql" || 
            context.getType() == "sqlite3"
        ){
        */
        if(primaryKeys.length){
            columsList += ",\n  PRIMARY KEY (";
            for(var n2 = 0 ; n2 < primaryKeys.length ; n2++){
                if(n2 > 0){
                    columsList += ", ";
                }
                var p_ = primaryKeys[n2];
                columsList += p_;
            }
            columsList += ")";
        }
        //}

        columsList += "\n)";

        sql += columsList;
    }

    if(tableOption){

        if(tableOption.engine){
            sql += " ENGINE = " + tableOption.engine;
        }

        if(tableOption.character){
            sql += " CHARACTER SET " + tableOption.character;
        }

        if(tableOption.defaultCharset){
            sql += " DEFAULT CHARSET = " + tableOption.defaultCharset;
        }

        if(tableOption.collate){
            sql += " COLLATE " + tableOption.collate;
        }
    }

    sql += ";\n"

    return sql;
};
module.exports = OrmCreateTableMysql;