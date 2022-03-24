const OrmCreateTable = function(context, option){

    var tableName;
    var tableOption = null;
    var colums = [];

    this.table = function(name, opt){
        tableName = name;

        if(opt){
            tableOption = opt;
        }

        return this;
    };

    this.addColumn = function( opt){
        colums.push(opt);
        return this;
    };

    this.getSql = function(){

        var createTableSql = "CREATE TABLE";

        if(tableOption){
            if(tableOption.ifNotExists){
                createTableSql += " IF NOT EXISTS";
            }
        }

        createTableSql += " " + context.getDatabase() + "." + tableName + " ";

        if(colums.length){
            var columsList = "(\n";
            for(var n = 0 ; n < colums.length ; n++){
                if(n > 0){
                    columsList += ", \n";
                }
                var c_ = colums[n];

                columsList += c_.name + " " + c_.type;

                if(c_.length){
                    columsList += "(" + c_.length + ")";
                }
            
            }

            columsList += "\n)";

            createTableSql += columsList;
        }

        if(tableOption){
            if(tableOption.character){
                createTableSql += " CHARACTER SET " + tableOption.character;
            }

            if(tableOption.collate){
                createTableSql += " COLLATE " + tableOption.collate;
            }
        }

        return createTableSql;
    };

    this.run = function(callback){

        var sql = this.getSql();

        console.log(sql);
    };

    if(option){

    }


};
module.exports = OrmCreateTable;