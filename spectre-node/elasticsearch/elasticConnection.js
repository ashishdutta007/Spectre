var elasticsearch = require('elasticsearch');

//module is an js object, and module.exports is a property there
//exports is a js variable
//module.exports is returned when require('modules') is called
//if no module.exports exists expilicitly, then module.exports = exports is returned ; else exports is ignored
var client = new elasticsearch.Client({
    hosts: 'http://localhost:9200',
    log: 'trace'
});

module.exports = client;

//conn.indices - ops on indexes
//conn.index - index internal
//conn.cluster - cluster
//
