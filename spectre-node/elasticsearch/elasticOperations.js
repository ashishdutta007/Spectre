var connection = require('./elasticConnection.js');

exports.getClusterHealth = function getClusterHealth() {
    connection.cluster.health({}, function(err, response, status) {
        if (err) {
            console.log(err);
        } else {
            console.log("---Cluster Health---", response);
            console.log("status : ", status);
        }
    });
};

exports.createIndex = function createIndex(params) {
    connection.indices.create(params, function(err, response, status) {
        if (err) {
            console.log(err);
        } else {
            console.log(response);
        }
    });
};

exports.addDocs2Index = function addDocs2Index(params) {
    connection.index(params, function(err, response, status) {
        if (err) {
            console.log(err);
        } else {
            console.log('response', response);
        }
    });
};

exports.countDocsinIndex = function countDocsinIndex(index, type) {
    connection.count({
        index: index,
        type: type
    }, function(err, response, status) {
        if (err) {
            console.log(err);
        } else {
            console.log("count: ", response);
        }
    });
};

exports.deleteDocs = function deleteDocs(index, type, id) {
    connection.delete({
        index: index,
        type: type,
        id: id
    }, function(err, response, status) {
        if (err) {
            console.log(err);
        } else {
            console.log("Docs have been deleted ", response);
        }
    });
};
