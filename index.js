
var linkshare = require('linksharejs');
var util      = require('util');
var async     = require('async');

module.exports.setup = function(token) {
    linkshare.setup(token);
}

module.exports.queryAll = function(config, partial, query, callback) {
    linkshare.query(query, function(err, data) {
        if (err) {
            throw err;
        } else {
            config.partial(partial, {
                rows: data.items,
                query: query
            }, function(err, data) {
                if (err) throw err;
                else callback(null, data);
            });
        }
    });
}

module.exports.queryFirst = function(config, partial, query, callback) {
    linkshare.query(query, function(err, data) {
        if (err) {
            throw err;
        } else {
            config.partial(partial, {
                row: data.items && data.items[0] ? data.items[0] : undefined,
                query: query
            }, function(err, data) {
                if (err) throw err;
                else callback(null, data);
            });
        }
    });
}

module.exports.query = function(config, partial, query, callback) {
    linkshare.query(query, function(err, data) {
        if (err) {
            throw err;
        } else {
            var render2 = "";
            async.forEachSeries(data.items,
                function(row, cb) {
                    // row.currencySymbol = currencySymbol(row.currency);
                    // util.log(util.inspect(row));
                    // util.log(util.inspect(config));
                    var rndrd = config.partial(partial, {
                        row: row,
                        query: query
                    }, function(err, data) {
                        if (err) throw err;
                        render2 += data; // .content; // Wrap rndrd in any way?
                        // util.log('data ' + util.inspect(data));
                        cb();
                    });
                },
                function(err) {
                    if (err) throw err;
                    else callback(null, render2);
                }
            );    
        }
    });
}