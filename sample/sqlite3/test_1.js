const orm = require("../../");

var o = new orm({
    type:"sqlite3",
    path:"test20220506.sqlite",
});

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
        database: "testdb_2022_0406",
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
        .database("testdb_2022_0406")
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

    // drop table (table_01)
    var dropTable = this.dropTable()
        .table("table_01")
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

    // create table (table_01)
    var createTable = this.createTable()
        .table("table_01")
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

    console.log(createTable.getSql());
    createTable.run(function(res){

        if(!res.result){
            console.log(res);
            return;
        }

        resolve();    
    });
    
}).then(function(resolve){

    // insert table (table_01) - 1
    var insert = this.insert()
        .table("table_01")
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

    // insert table (table_01) - 2
    var insert = this.insert()
        .table("table_01")
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

    // insert table (table_01) - 3
    var insert = this.insert()
        .table("table_01")
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

    // insert table (table_01) - 4
    var insert = this.insert()
        .table("table_01")
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

    // update table (table_01)

    var update = this.update()
        .table("table_01")
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

    // delete table (table_01)
    var del = this.delete()
        .table("table_01")
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

    // delete table (table_01) logical delete
    var del = this.delete()
        .table("table_01")
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

    // seelct table (table_01) - not logical delete
    var select = this.select();

    select.get(function(res){
        console.log(res);
        resolve();
    });

}).then(function(resolve){

    console.log("\n");

    // seelct table (table_01) - logical delete only
    var select = this.select()
        .onLogicalDelete(true)
    ;

    select.get(function(res){
        console.log(res);
        resolve();
    });

}).then(function(){

    console.log("\n");

    // seelct table (table_01) - all
    var select = this.select()
        .allLogicalDelete(true)
    ;

    select.get(function(res){
        console.log(res);
    });

}).start();