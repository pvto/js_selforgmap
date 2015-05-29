
var deepreduce = function(start, arr, update) {
    var ret = start,
        d;
    for(var i = 0; i < arr.length; i++) {
        d = arr[i];
        if (d instanceof Array) {
            ret = deepreduce(ret, d, update);
        }
        else {
            ret = update(ret, d);
        }
    }
    return ret;
};