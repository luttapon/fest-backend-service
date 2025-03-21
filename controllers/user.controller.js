const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

//? สร้างตัวแปรอ้างอิงสำหรับ prisma เพื่อเอาไปใช้
const prisma = new PrismaClient();

//? อัปโหลดไฟล์-----------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/users");
  },
  filename: (req, file, cb) => {
    cb(null, 'user_' + Math.floor(Math.random() * Date.now()) + path.extname(file.originalname));
  }
})
exports.uploadUser = multer({
  storage: storage,
  limits: {
    fileSize: 1000000 //? file 1 mb
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));
    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Error: Images Only");
  }
}).single("userImage");//? ต้องตรงกับ column ในฐานข้อมูล
//?-------------------------------------------------

//? การเอาข้อมูลที่ส่งมาจาก Frontend เพิ่ม(Create/Insert) ลงตารางใน DB
exports.createUser = async (req, res) => {
  try {
    const result = await prisma.user_tb.create({
      data: {
        userFullame: req.body.userFullame,
        userName: req.body.userName,
        userPassward: req.body.userPassward,
        userImage: req.file ? req.file.path.replace('images\\users\\', '') : "",
      }
    })

    res.status(201).json({
      message: "เพิ่มข้อมูลสําเร็จ",
      data: result
    })
  } catch (err) {
    res.status(500).json({
      message: `พบเจอปัญหาในการทำงาน: ${err}`
    })
    console.log('Error', err);
  }
}
//?-------------------------------------------------

exports.checklogin = async (req, res) => {
  try {
   const result = await prisma.user_tb.findFirst({
    where : {
      userName : req.params.userName,
      userPassward : req.params.userPassward
    }
   })
   if(result){
    res.status(200).json({
      message: "OK",
      info: result
    });
  } else {
    res.status(404).json({
      message: "ไม่พบข้อมูล",
      info: result
    });
  }


   res.status(200).json({
    message: "OK",
    info: result
  })
   
  } catch (err) {
    res.status(500).json({
      message: `พบเจอปัญหาในการทำงาน: ${err}`
    })
    console.log(`Error: ${err}`);
  }
}
// update user
exports.updateUser = async (req, res) => {
  let result = {};


  try {
    // ต้องตรวจสอบด้วยว่ามีการเปลี่ยนรูปมั้ย ถ้าไม่เปลี่ยนไม่เป็นไร
    // ถ้าเปลี่ยนรูปจะต้องลบรูปเก่าทิ้ง และใช้รูปใหม่แทน
    if(req.file ){
      //แก้ไขรูป
        const userResult   = await prisma.user_tb.findFirst({
            where: {
                userid: parseInt(req.params.userid)
            }
        })
        // ดูว่ามีรูปหรือไม่ ถ้ามีก็ลบ
        if(userResult.userImage){
         fs.unlinkSync(path.join("images/users", userResult.userImage));  //? ลบรูปเก่า
        }
        // อัปเดตรูปใหม่
         result = await prisma.user_tb.update({
          where: {
            userid: parseInt(req.params.userid)
          },
          data: {
            userFullame: req.body.userFullame,
            userName: req.body.userName,
            userPassward: req.body.userPassward,
            userImage: req.file ? req.file.path.replace('images\\users\\', '') : "",
          }
        })

    }else{
      // ไม่แก้ไขรูป
       result = await prisma.user_tb.update({
        where: {
          userid: parseInt(req.params.userid)
        },
        data: {
          userFullame: req.body.userFullame,
          userName: req.body.userName,
          userPassward: req.body.userPassward,
        }
      })
    }

    res.status(200).json({
      message: "แก้ไขข้อมูลสําเร็จ",
      info: result
    })
  } catch (err) {
    res.status(500).json({
      message: `พบเจอปัญหาในการทำงาน: ${err}`
    })
    console.log('Error', err);
  } 
}