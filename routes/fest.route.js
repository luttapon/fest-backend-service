const express = require("express");
const festController = require("../controllers/fest.controller");
const route = express.Router();

route.post('/', festController.uploadFest, festController.createFest);


route.get('/:userid', festController.getAllFest);
route.get('/only/:festid', festController.getOnlyFest);

route.put('/:festid', festController.uploadFest, festController.updateFest);

route.delete('/:festid', festController.deleteFest);

module.exports = route;