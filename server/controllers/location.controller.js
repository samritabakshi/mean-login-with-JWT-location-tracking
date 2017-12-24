var config = require('config.json');
var express = require('express');
var router = express.Router();
var locationService = require('services/location.service');

// routes
router.post('/', create);
router.get('/', getAll);
router.get('/username/:_username', getAllByUsername);
router.delete('/:_id', _delete);
router.get('/:_id', getById);
module.exports = router;

function create(req, res) {
    locationService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
function getById(req, res) {
    locationService.getById(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
function getAll(req, res) {
    locationService.getAll()
        .then(function (location) {
            res.send(location);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
function getAllByUsername(req, res) {
    locationService.getAllByUsername(req.params._username)
        .then(function (location) {
            res.send(location);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
function getCurrent(req, res) {
    locationService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    locationService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}