const orm = require("../../");

var o = new orm({
    type:"mysql",
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
});

var targetDb = "testdb_0001";
var targetTable = "table_01";

o.then(function(resolve){

    // access check
    this.connection(function(res){

        if(!res.result){
            console.log("[ERROR] NO ACCSSS");
            return;
        }
    
        resolve();
    });

}).then(function(resolve){

    // drop database
    var dropDb = this.dropDatabase({
        database: targetDb,
        ifExists: true,
    });

    dropDb.run(function(res){

        if(!res.result){
            console.log(res);
            return;
        }
    
        console.log(dropDb.getSql());
        resolve();    
    });

}).then(function(resolve){

    // create database
    var createDb = this.createDatabase()
        .database(targetDb)
        .ifNotExists(true)
        .character("utf8mb4")
        .collate("utf8mb4_general_ci")
    ;

    createDb.run(function(res){

        if(!res.result){
            console.log(res);
            return;
        }

        console.log(createDb.getSql());
        o.setDatabase(createDb.getDatabase());
        resolve();    
    });

}).then(function(resolve){

    // drop table
    var dropTable = this.dropTable()
        .table(targetTable)
        .ifExists(true);
    ;

    dropTable.run(function(res){

        if(!res.result){
            console.log(res);
            return;
        }

        console.log(dropTable.getSql());
        resolve();
    });

}).then(function(resolve){

    // create table
    var createTable = this.createTable()
        .table(targetTable)
        .ifNotExists(true)
        .addColumn({
            name: "id",
            type: "int",
            length: 11,
            notNull: true,
            primaryKey: true,
            autoIncrement: true,
            comment: "ID (PK)",
        })
        .addColumn({
            name: "create_date",
            type: "datetime",
            comment: "Recode Create Date",
        })
        .addColumn({
            name: "update_date",
            type: "datetime",
            comment: "Recode Update Date",
        })
        .addColumn({
            name: "logical_delete",
            type: "int",
            length: 1,
            notNull: true,
            default: 0,
            comment: "Logical Delete Column",
        })
        .addColumn({
            name: "name",
            type: "varchar",
            length: 100,
            notNull: true,
            comment: "your name",
        })
        .addColumn({
            name: "status",
            type: "int",
            length: 2,
            notNull: true,
            default: 0,
            comment: "your status",
        })
        .addColumn({
            name: "memo",
            type: "varchar",
            length: 1000,
            comment: "memo",
        })
    ;

    createTable.run(function(res){

        if(!res.result){
            console.log(res);
            return;
        }

        console.log(createTable.getSql());
        resolve();    
    });

}).then(function(resolve){

    // insert table - 1
    var insert = this.insert()
        .table(targetTable)
        .data({
            name: "田中　太郎",
        })
    ;

    insert.run(function(res){

        if(!res.result){
            console.log(res);
            return;
        }

        console.log(insert.getSql());
        resolve();    
    });

}).then(function(resolve){

    this
        .setCreateTimeStamp("create_date")
        .setUpdateTimeStamp("update_date")
    ;

    // insert table - 2
    var insert = this.insert()
        .table(targetTable)
        .data({
            name: "山田　五郎",
            status: 1,
            memo: "メモテキストテキストテキスト"
        })
    ;

    insert.run(function(res){

        if(!res.result){
            console.log(res);
            return;
        }

        console.log(insert.getSql());
        resolve();    
    });

}).then(function(resolve){

    // insert table - 3
    var insert = this.insert()
        .table(targetTable)
        .data({
            name: "物理削除　太郎",
        })
    ;

    insert.run(function(res){

        if(!res.result){
            console.log(res);
            return;
        }

        console.log(insert.getSql());
        resolve();    
    });

}).then(function(resolve){

    // insert table - 4
    var insert = this.insert()
        .table(targetTable)
        .data({
            name: "論理削除　太郎",
        })
    ;

    insert.run(function(res){

        if(!res.result){
            console.log(res);
            return;
        }

        console.log(insert.getSql());
        resolve();    
    });


}).then(function(resolve){

    setTimeout(function(){
        
        resolve();

    },3000);

}).then(function(resolve){

    // update table

    var update = this.update()
        .table(targetTable)
        .where("id","=", 2)
        .data({
            name: "山田　五郎(更新後)",
        })
    ;

    update.run(function(res){

        if(!res.result){
            console.log(res);
            return;
        }

        console.log(update.getSql());
        resolve();    
    });

}).then(function(resolve){

    // delete table
    var del = this.delete()
        .table(targetTable)
        .where("id", "=", 3)
    ;

    del.run(function(res){

        if(!res.result){
            console.log(res);
            return;
        }

        console.log(del.getSql());
        resolve();    
    });

    
}).then(function(resolve){

    this.setLogicalDeleteKey("logical_delete");

    // delete table logical delete
    var del = this.delete()
        .table(targetTable)
        .where("id", "=", 4)
    ;

    del.run(function(res){

        if(!res.result){
            console.log(res);
            return;
        }

        console.log(del.getSql());
        resolve();    
    });


}).then(function(resolve){
    
    console.log("\n");

    // seelct table - not logical delete
    var select = this.select();

    select.get(function(res){
        console.log(res);
        resolve();
    });

}).then(function(resolve){

    console.log("\n");

    // seelct table - logical delete only
    var select = this.select()
        .onLogicalDelete(true)
    ;

    select.get(function(res){
        console.log(res);
        resolve();
    });

}).then(function(){

    console.log("\n");

    // seelct table - all
    var select = this.select()
        .allLogicalDelete(true)
    ;

    select.get(function(res){
        console.log(res);
    });


}).start();
