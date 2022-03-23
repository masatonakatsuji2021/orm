const Orm = require("./src");

var mysql = new Orm({
    type: "mysql",
});
/*
mysql.bind("select * from :table_name", {
    table_name: "test_table",
});
*/

/*
mysql.bind(
    "select * from test20220318.test1 where id = \":id\"", 
    {
        id: "\" or \"\" = \"",
    }, 
    function(res){
        console.log(res);
    }
);
*/

mysql.bind(
    "select * from test20220318.test1 where id IN (:id)", 
    {
        id: [3, 2, "aaaaa"],
    }, 
    function(res){
        console.log(res);
    }
);
