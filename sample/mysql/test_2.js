const orm = require("../../");

var targetDb = "testdb_0001";
var targetTable = "table_02";

var o = new orm({
    type:"mysql",
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database : targetDb,
    table: targetTable,
    createTimeStamp: "create_date",
    updateTimeStamp: "update_date",
});

o.then(function(resolve){

    var dropTable = this.dropTable()
        .ifExists(true)
    ;

    dropTable.run(function(res){

        if(!res.result){
            console.log(res);
            return;
        }

        resolve();    
    });

}).then(function(resolve){

    // create table
    var createTable = this.createTable()
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
            name: "name",
            type: "varchar",
            length: 100,
            notNull: true,
            comment: "field name",
        })
        .addColumn({
            name: "value",
            type: "text",
            notNull: true,
            comment: "field value",
        })
    ;

    createTable.run(function(res){

        if(!res.result){
            console.log(res);
            return;
        }

        resolve();    
    });

}).then(function(resolve){

    // transaction begin
    this.begin(resolve);
    
}).then(function(resolve){

    var lists = [
        {
            name: "name",
            value: "table value.....",
        },
        {
            name: "email",
            value: "text@xxxx.com",
        },
        {
            name: "domain",
            value: "www.xxxx.com",
        },
        {
            name: "discription",
            value: "text sample text text text.....",
        },
    ];

    this.for(0, lists.length, function(index, resolve2){
        var l_ = lists[index];

        var insert = this.insert()
            .data(l_)
        ;

        insert.run(function(res){

            if(!res.result){
                console.log(res);
                return;
            }
    
            resolve2();
        });
    },
    function(){
        resolve();
    });

}).then(function(resolve){

    // transaction commit
    this.commit(resolve);
    
}).then(function(resolve){

    console.log(this.getLog());

}).start();