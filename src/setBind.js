const setBind = function(){

    var binds = {};
    var bindIndex = 0;

    this.set = function(value){
        bindIndex++;
        binds[bindIndex] = value;
        return ":" + bindIndex;
    };

    this.getBind = function(){
        return binds;
    }
};
module.exports = setBind;