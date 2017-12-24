var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('location');

var service = {};


service.getAll = getAll;
service.getAllByUsername = getAllByUsername;
service.getById = getById;
service.create = create;
service.delete = _delete;

module.exports = service;
function getAll() {
    var deferred = Q.defer();

    db.location.find().toArray(function (err, location) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(location);
    });

    return deferred.promise;
}
function getAllByUsername(_username) {
    var deferred = Q.defer();
    db.location.find({ username: _username }).toArray(function (err, location) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(location);
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();
    db.location.findById(_id, function (err, location) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (location) {
            deferred.resolve(location);
        } else {
            // location not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(locationParam) {
    var deferred = Q.defer();

    // validation
    db.location.findOne(
        { location: locationParam.location },
        function (err, location) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            if (location) {
                deferred.reject('Location "' + locationParam.location + '" is already taken');
            } else {
                createLocation();
            }
        });

    function createLocation() {
        db.location.insert(
            locationParam,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.location.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}