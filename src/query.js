const OrmQuery = function(sql, connection, callback, beforeCallback){

    var thenCallback;
    var successCallback;
    var errorCallback;

    if(callback){
        thenCallback = callback;
    }

    this.then = function(callback){
        thenCallback = callback;
        return this;
    };

    this.success = function(callback){
        successCallback = callback;
        return this;
    };

    this.error = function(callback){
        errorCallback = callback;
        return this;
    };

    connection.query(sql, function(res){

        if(beforeCallback){
            var buff = beforeCallback(res);
            if(buff){
                res = buff;
            }
        }

        if(res.res){
            if(successCallback){
                successCallback(res.res);
            }
        }
        else{
            if(errorCallback){
                errorCallback(res.error);
            }
        }

        if(thenCallback){
            thenCallback(res);
        }
    });
};
module.exports = OrmQuery;