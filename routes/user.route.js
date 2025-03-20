const express = require('express');
const userController = require('../controllers/user.controller');
const route = express.Router();

// เพิ่มใช้ Post ค้นหาดึงข้อมูล get

route.post('/', userController.uploadUser,userController.createUser);
//  ค้นหาดึงข้อมูล get
route.get('/:userName/:userPassward', userController.checklogin);
// แก้ไขข้อมูล put
route.put('/:userid', userController.uploadUser, userController.updateUser);
module.exports = route;