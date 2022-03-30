const Orm = require("./src");

var mysql1 = new Orm({
    type: "mysql",
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "test20220318",
    table: "test1",

    surrogateKey: "id",
    updateTimeStamp: "updated_at",
    logicalDeleteKey: "deleted",

    selectCallback: function(res){
        res.memo = "OK!!";
        return res;
    },
    insertCallback: function(res){

        res.firstName += "....OK";
        return res;
    },
    updateCallback: function(res){
        console.log("update callback");
        res.firstName += "append...";
        return res;
    },
});

var mysql2 = new Orm({
    type: "mysql",
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "test20220318",
    table: "test1",

    surrogateKey: "id",
    updateTimeStamp: "updated_at",
    logicalDeleteKey: "deleted",

    selectCallback: function(res){
        res.memo = "OK!!";
        return res;
    },
    insertCallback: function(res){

        res.firstName += "....OK";
        return res;
    },
    updateCallback: function(res){
        console.log("update callback");
        res.firstName += "append...";
        return res;

    },
});

mysql1.then(function(resolve){

    mysql1.begin(resolve);

}).then(function(resolve){

    mysql2.begin(resolve);

}).then(function(resolve){
    
    mysql1.insert()
        .data({
            firstName: "テスト1",
            lastName: "三郎001",
            age: 101,
        })
        .run(function(res){
            console.log(res);
            resolve();
        });

}).then(function(resolve){

    mysql2.insert()
        .data({
            firstName: "テスト2",
            lastName: "三郎002",
            age: 102,
        })
        .run(function(res){
            console.log(res);
            resolve();
        });
        
}).then(function(resolve){
    
    mysql2.commit(resolve);

}).then(function(resolve){
    
    mysql1.commit(resolve);

}).start();

/*
mysql.then(function(resolve){

    console.log("transaction begin");

    mysql.transaction().begin(function(res){
        console.log(res);
        resolve();
    });

}).then(function(resolve){

    console.log("update Start");

    mysql.update()
        .where("id", "=", 14)
        .data({
            firstName: "更新名....",
        })
        .run(function(res){
            console.log(res);
            resolve();
        });

}).then(function(resolve){

    console.log("Insert1 Start");

    mysql.insert()
        .data({
            firstName: "テスト",
            lastName: "三郎",
            age: 102,
        })
        .run(function(res){
            console.log(res);
            resolve();
        });

}).then(function(resolve){

    console.log("Insert2 Start");
        
    mysql.insert()
    .data({
        firstName: "テスト",
        lastName: "史郎",
        age: 102,
    })
    .run(function(res){
        console.log(res);
        resolve();
    });

}).then(function(resolve){

    console.log("transaction rollback");

    mysql.transaction().rollback(function(res){
        console.log(res);
        resolve();
    });

}).start();
*/

/*
mysql.select({
    field: [
        "id",
        "firstName",
    ],
    where:[
        ["id", ">", 3],
        ["id", "<", 5],
    ],
    getCount: function(res){
        console.log(res);
    },
    get: function(res){

        console.log(res);

    },
});
*/
/*
    .callback(function(res){
        res.status = "OKDAYO";
        return res;
    })
*/
/*
var sql = mysql
    .delete()
//    .logicalDeleteKey("delete_flg")
    .surrogate(22)
    .getSqls();

console.log(sql);
*/
/*
mysql
    .insert()
    .onGetData(true)
    .createTimeStamp("created_at")
    .updateTimeStamp("updated_at")
    .data({
        firstName: "AAA",
        lastName: "Next",
        age: 73,
    })
    .run(function(res){

        console.log(res);

    });
*/

/*
mysql
    .update()
    .onGetData(true)
    .surrogate(6)
    .updateTimeStamp("updated_at")
    .data({
        firstName:"更新",
        lastName: "たろう2",
    })
    .run(function(res){

        console.log(res);

    });
*/

/*
var sqls = mysql.insert()
    .setData({
        id:4,
        name: "aaaaaaa",
        value: "bbbbbbbbbb",
        ssss: null,
    })
    .getSql();

    console.log(sqls);

console.log(mysql.getBindSql(sqls.sql, sqls.bind));
/*
var sql = mysql.insert({
        id:4,
        name: "aaaaaaa",
        value: "bbbbbbbbbb",
    })
    .getSql();

    console.log(sql);
*/
/*
var sqls = mysql.update()
    .setData({
        name :"bbbbb",
        value: "cccccccccccc",
        uya:null,
        aaa: 0,
        cccc : 0.222,
    })
    .where("id","=",7)
    .getSql();

console.log(sqls);

console.log(mysql.getBindSql(sqls.sql, sqls.bind));
/*
var sql = mysql.createDatabase()
    .database("new_database01",{
        ifNotExists: true,
    })
    .getSql()
;

console.log(sql);

mysql.setDatabase("new_database01");

var sql = mysql.createTable()
    .table("table_01")
    .addColumn({
        name: "id",
        type: "int",
        length: 11,
        primaryKey: true,
        notNull: true,
        autoIncrement: true,
        comment: "ID (PK)",
    })
    .addColumn({
        name: "created_at",
        type: "datetime",
        notNull: true,
        comment: "Create DateTime",
    })
    .getSql()
;

console.log(sql);
*/

/*
var sql = mysql.createTable()
    .table("table_02")
    .addColumn({
        name: "id",
        type: "int",
        length: 11,
        primaryKey: true,
        notNull: true,
        autoIncrement: true,
        comment: "ID (PK)",
    })
    .addColumn({
        name: "name",
        type: "varchar",
        length: 100,
        notNull: true,
        comment: "Table Name",
    })
    .getSql()
;

console.log(sql);
/*
var sql = mysql.alterTable()
    .table("__db1")
    .renameTable("__db1_a")
    .deleteColumn("user_data_a")
    .deleteColumn("option_data1")
    .deleteColumn("option_data2")
    
    .addColumn({
        name: "user_data_a",
        type: "varchar",
        length : 200,
        notNull: true,
        comment: "ユーザー情報A",
        after: "id",
    })
    .getSql();

    console.log(sql);
*/

/*
mysql.createTable()
    .table("__db1",{
        ifNotExists: true,
    })
    .addColumn({
        name: "id",
        type: "int",
        length: 11,
        primaryKey: true,
        notNull: true,
        autoIncrement: true,
        default: null,
        comment: "ID (PK)",
    })
    .addColumn({
        name: "created_at",
        type: "datetime",
        notNull: true,
        comment: "レコード作成日時",
    })
    .addColumn({
        name: "updated_at",
        type: "datetime",
        notNull: true,
        comment: "レコード更新日時",
    })
    .addColumn({
        name: "name",
        type: "varchar",
        length: 255,
        notNull: true,
        comment: "名称",
    })
    .addColumn({
        name: "status",
        type: "int",
        length: 2,
        notNull: true,
        default: 0,
        comment: "ステータス",
    })
    .addColumn({
        name: "memo",
        type: "varchar",
        length: 255,
        comment: "メモ欄",
    })
    .run(function(){
        console.log("....OK!");
    });
*/




/*

console.log(mysql.dropTable()
    .table("aaaaaaaaaaaaaaaa")
    .getSql());
*/

/*
    .run(function(){
        console.log(".......delete table!");
    });
    */