/**
 * OrmSync
 * @param {*} callback 
 * @returns 
 */
const OrmSync = function(context, callback){

    var _callbacks = [];

    if(callback){
        _callbacks.push(callback);
    }

    const OrmSyncs = {

        /**
         * then
         * @param {*} callback 
         * @returns 
         */
        then: function(callback){

            _callbacks.push(callback);
            return this;
        },

        /**
         * start
         */
        start: function(){

            var index = 0;
            const resolve = function(){
                index++;
                
                if(!_callbacks[index]){
                    delete _callbacks;
                    return;
                }

                _callbacks[index].bind(context)(resolve);
            };

            _callbacks[0].bind(context)(resolve);
        },
    };

    return OrmSyncs;
};
module.exports = OrmSync;