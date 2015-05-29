/* js_selforgmap.js - an implementation for self organising maps (Kohonen, 1985).
*/
window.sorgmap2 = (function(){

    var S = {};
    var sqr = function(a) { return a * a; }

    S.bestmatch = function(data, index, lattice, weights, updateLattice) {
        var i, j,
            dist = 0,
            distmin = Number.MAX_VALUE,
            jdistmin = 0,
            datum = data[index],
            lsize = lattice[0].length * lattice.length,
            w = 0,
            u, v
            ;
        for(j = 0; j < lsize; j++) {
            dist = 0;
            for(i = 0; i < datum.length; i++) {
                dist += sqr(datum[i] - weights[w++]);
            }
            if (dist < distmin) {
                distmin = dist;
                jdistmin = j;
            }
        }
        if (updateLattice) {
            u = jdistmin % lattice[0].length;
            v = Math.floor(jdistmin / lattice[0].length);
            lattice[v][u] = distmin;
        }
        return jdistmin;
    };
    /*
     *
     */
    S.learnOneEpoch = function(data, lattice, weights, params) {
        var lwidth = lattice[0].length,
            lheight = lattice.length,
            i, 
            datum, jdistmin
            ;
        for(i = 0; i < data.length; i++) {
            datum = data[i];
            // find best matching point in lattice
            jdistmin = S.bestmatch(data, i, lattice, weights, true);
            // find and update neighborhood
            params.updateNeighborhood(params, lattice, weights, datum, i,
                jdistmin % lwidth,  // u
                Math.floor(jdistmin / lwidth)   // v
                );
        }
    };

    S.updt_ = function(u, v, weights, datum, mu, lattice) {
        var lwidth = lattice[0].length,
            lheight = lattice.length,
            w
            ;
        for(var d = 0; d < datum.length; d++) {
            w = (v*lwidth + u) * (lwidth * lheight) + d;
            weights[w] += mu * (datum[d] - weights[w]);
        }
    };

    S.updt_box = function(params, lattice, weights, datum, i, ucent, vcent) {
        var lwidth = lattice[0].length,
            lheight = lattice.length,
            u = Math.max(0, Math.round(ucent - params.neighborhood / 2)),
            v = Math.max(0, Math.round(vcent - params.neighborhood / 2)),
            umax = Math.min(lwidth, u + params.neighborhood),
            vmax = Math.min(lheight, v + params.neighborhood)
            ;
        for(; v < vmax; v++) {
            for(; u < umax; u++) {
                S.updt_(u, v, weights, datum, params.mu, lattice);
            }
        }
    };

    S.updt_circ = function(params, lattice, weights, datum, i, ucent, vcent) {
        var lsize = lattice.length * lattice[0].length
            ;
        for(var u = 0; u < lattice[0].length; u++) {
            for(var v = 0; v < lattice.length; v++) {
                var dist = Math.sqrt(sqr(ucent - u) + sqr(vcent - v));
                if (dist < params.neighborhood) {
                    var w = i * lsize + v * lattice[0].length + u;
                    weights[w] += params.mu * (datum[v*lwidth + u] - weights[w]);
                }
            }
        }
    };

    S.createLattice = function(dimu, dimv) {
        var lattice = new Array(dimv);
        for(var v = 0; v < dimv; v++) {
            lattice[v] = new Array(dimu);
        }
        return lattice;
    };

    var _learn = function(data, lattice, weights, params, onSuccess) {
        S.learnOneEpoch(data, lattice, weights, params);
        params.mu = params.mu - params.deltamu;
        params.neighborhood = params.neighborhood - params.deltanb;
    };

    S.learn = function(data, lattice, params, onSuccess) {
        var lwidth = lattice[0].length;

        params = params || {};
        params.deltamu = params.deltamu || 0.001;
        params.mu = params.mu || 0.950;
        params.neighborhood = Math.min( params.neighborhood || lwidth - 1, lwidth);
        params.deltanb = params.deltanb || params.neighborhood * params.deltamu;
        params.updateNeighborhood = params.updateNeighborhood || S.updt_box;

        var weights = new Array(lattice.length * lattice[0].length * data.length);
        params.weights = weights;
        for(var i = 0; i < weights.length; i++) {
            weights[i] = (0.9 / weights.length) + Math.random() * 0.1 + 0.05;
        }
        var func = function() {
            _learn(data, lattice, weights, params, onSuccess);
            if (params.neighborhood > 0.1) {
                window.setTimeout(func, 0);
            } else {
                console.debug("learn done");
                onSuccess(lattice);
            }
        };
        func();
    };

    return S;
})();
