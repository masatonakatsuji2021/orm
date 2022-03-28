const Orm = require("./src");

var mysql = new Orm({
    type: "mysql",
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "test20220318",
    table: "test1",
    surrogateKey: "id",
    // datetime:"updated_at",
    logicalDeleteKey: "deleted",
});

var sql = mysql
    .delete()
//    .logicalDeleteKey("delete_flg")
    .surrogate(22)
    .getSqls();

console.log(sql);

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