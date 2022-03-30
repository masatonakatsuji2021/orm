const OrmTransaction = function(context, callback, commitCallback, rollbackCallback){

    /**
     * begin
     * @param {function} callback 
     * @returns 
     */
    this.begin = function(callback){

        var vm = this;

        var sql = "begin";

        context.query(sql, function(res){
            if(callback){
                callback.bind(vm)(res);
            }
        });

        return this;
    };

    /**
     * commit
     * @param {function} callback 
     * @returns 
     */
    this.commit = function(callback){

        var vm = this;

        var sql = "commit";

        context.query(sql, function(res){
            if(callback){
                callback.bind(vm)(res);
            }
        });

        return this;
    };

    /**
     * rollback
     * @param {function} callback 
     * @param {Exception} error 
     * @returns 
     */
    this.rollback = function(callback, error){

        var vm = this;

        var sql = "rollback";

        context.query(sql, function(res){
            if(callback){
                if(error){
                    callback.bind(vm)(res, error);
                }
                else{
                    callback.bind(vm)(res);
                }
            }
        });

        return this;
    };

    if(callback){

        var vm = this;
        const commit = function(){
            vm.commit(function(res){
                if(commitCallback){
                    commitCallback.bind(vm)(res);
                }
            });
        };
        const rollback = function(error){
            vm.rollback(
                function(res, error){
                    if(rollbackCallback){
                        rollbackCallback.bind(vm)(res, error);
                    }
                },
                error
            );
        };

        this.begin(function(){
            callback.bind(vm)(commit, rollback);
        });
    }

};
module.exports = OrmTransaction;