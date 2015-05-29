/* 
 * 
 *  This enables lattices of arbitrary dimensions, though it is comomn to
 *  use two or three dimensions.
 *
 *  Lattice here is an array of arrays (of arrays of ...) containing fp-values.
 *
 */
/*
sorgmap = 
(function(){
    // a helper function to clone a value as an array
    var clone = function(val, count) {
        var ret = [];
        for(var i = 0; i < count; i++) {
            ret.push(val);
        }
        return ret;
    }
    // a helper function to give the dimension of a regular array
    var dim = function(lattice) {
        var ret = 0,
            L = lattice
            ;
        while(L instanceof Array) {
            ret++;
            L = L[0];
        }
        return ret;
    };
    // a helper function to give the dimensions of a regular array
    var dims = function(lattice) {
        var ret = [],
            L = lattice
            ;
        while(L instanceof Array) {
            ret.push(L.length);
            L = L[0];
        }
        return ret;
    }
    // a helper function to determine the total size of a regular multidimensional array
    var totalsize = function(lattice) {
        var ret = 1,
            L = lattice
            ;
        while (L instanceof Array) {
            ret *= L.size;
            L = L[0];
        }
        return ret;
    };
    // a helper function to initialise weights incoming from data towards a lattice
    var initw = function(lsize) {
        var ret = [];
        for(var i = 0; i < lsize; i++) {
            ret.push(Math.random() - 0.5);
        }
        return ret;
    };
    // a helper function to init neighborhood size for the lattice as max(|dim|), where dim belongs to lattice dimensions
    var initneighborhood = function(lattice) {
        var L = lattice.length,
            ret = lattice[0]
            ;
        while (L instanceof Array) {
            if (L.length > ret) {
                ret = L.length;
            }
            L = L[0];
        }
        return ret;
    };
    // Math ...
    var sqr = function(a) { return a * a; }
    // a helper function to map weight array indices to a lattice
    var w_latticemap = function(lattice, datalength) {
        var ret = [],
            d = dim(lattice)
            ;
        for(var i = 0; i < datalength * lattice.lsize; i++) {
            var item = [],
                t = i,
                L = lattice;
            for(var j = 0; j < dim; j++) {
                t = t % L.length;
                item.push(t);
                L = L[0];
            }
            ret.push(item);
        }
        return ret;
    };


    var S = {};
    // a learning function to develop the given lattice towards a solution
    // as given in Kohonen (1985)
    S.learnOneEpoch = function(data, lattice, params) {
        // initialise the lattice weights if needed
        lattice.lsize = lattice.lsize || totalsize(lattice);
        lattice.dims = lattice.dims || dims(lattice);
        lattice.w = lattice.w || initw(lattice.lsize * data.length);
        lattice.neighborhood = lattice.neighborhood || initneighborhood(lattice);
        lattice.mu = lattice.mu || 0.99;
        lattice.deltamu = lattice.deltamu || 0.001;
        lattice.wmap = lattice.wmap || w_latticemap(lattice, data.length);
        // do one epoch of learning
        var datum, wpos, distmin, wdistmin, nextpos, dist,
            latflat, latpoint, dim, 
            nb = clone(0, lattice.dims.length), 
            nbmax
            ;
        for(var i = 0; i < data.length; i++) {
            datum = data[i];
            wpos = 0;
            distmin = Number.MAX_VALUE;
            wdistmin = 0;
            for(var j = 0; j < datum.length; j++) {
                nextpos = wpos + lattice.lsize;
                dist = 0;
                for(; w < nextpos; w++) {
                    dist += sqr(datum[j] - lattice.w[w]);
                }
                if (dist < distmin) {
                    distmin = dist;
                    wdistmin = w;
                }
            }
            // we now have the weight pointing to a slot in the lattice
            // we want to update the lattice
            latflat = wdistmin % (data.length * lattice.lsize);
            latpoint = lattice.wmap[latflat];
            dim = 0;
            var iters = add(dims(lattice), -1);
            // TODO: iterate over the whole lattice and update points 
            // where distance is within neighborhood
            var total = sum(iters),
                changedim = iters.length - 1;
            while(total > 0) {
                // . . .
                
                total--;
            }
        }
    };
    return S;
})();
*/