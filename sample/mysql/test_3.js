const orm = require("../../");

var targetDb = "testdb_0001";

var o = new orm({
    type:"mysql",
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database : targetDb,
    table: "view_01",
});

o.then(function(resolve){

    var dropView = this.dropView()
        .ifExists(true)
    ;

    dropView.run(function(res){

        if(!res.result){
            console.log(res);
            return;
        }

        resolve();   
    });


}).then(function(resolve){

    var createView = this.createView()
        .ifNotExists(true)
        .sql("SELECT * FROM " + targetDb + ".table_01")
    ;

    createView.run(function(res){

        if(!res.result){
            console.log(res);
            return;
        }

        resolve();   
    });

}).then(function(resolve){

    console.log(this.getLog());

}).start();