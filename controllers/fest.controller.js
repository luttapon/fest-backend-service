const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { response } = require('express');

//? สร้างตัวแปรอ้างอิงสำหรับ prisma เพื่อเอาไปใช้
const prisma = new PrismaClient();

//? อัปโหลดไฟล์-----------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/fests");
  },
  filename: (req, file, cb) => {
    cb(null, 'fest_' + Math.floor(Math.random() * Date.now()) + path.extname(file.originalname));
  }
})
exports.uploadFest = multer({
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
}).single("festImage");//? ต้องตรงกับ column ในฐานข้อมูล
//?-------------------------------------------------

//? การเอาข้อมูลที่ส่งมาจาก Frontend เพิ่ม(Create/Insert) ลงตารางใน DB
exports.createFest = async (req, res) => {
  try {
    const { festName,festDetail,festState,festCost,userid,festImage,festNumDate, } = req.body; 
    const result = await prisma.festival_tb.create({
      data: {
        festName:  festName,
        festDetail:  festDetail,
        festState:  festState,
        festCost: parseFloat(festCost),
        festNumDate:parseInt(festNumDate),
        userid: parseInt(userid),    
        festImage: req.file ? req.file.path.replace("images\\fests\\", '') : "",
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
exports.getAllFest = async (req, res) => {
  try {
    const result = await prisma.festival_tb.findMany({
      where: {
        userid: parseInt(req.params.userid),
      },
    })
    response.status(200).json({
      message: "ดึงข้อมูลสําเร็จ",
      info: result
    })
  }catch (err) {
    res.status(500).json({  
      message: `พบเจอปัญหาในการทำงาน: ${err}`
    })
    console.log('Error', err);
}
}


exports.getOnlyFest = async (req, res) => {
  try {
    const result = await prisma.festival_tb.findFirst({
      where: {
        userid: parseInt(req.params.userid),
      },
    })
    response.status(200).json({
      message: "ดึงข้อมูลสําเร็จ",
      info: result
    })
  }catch (err) {
    res.status(500).json({  
      message: `พบเจอปัญหาในการทำงาน: ${err}`
    })
    console.log('Error', err);
}
}

exports.updateFest = async (req, res) => {
  let result = {};
  try {
    // ต้องตรวจสอบด้วยว่ามีการเปลี่ยนรูปมั้ย ถ้าไม่เปลี่ยนไม่เป็นไร
    // ถ้าเปลี่ยนรูปจะต้องลบรูปเก่าทิ้ง และใช้รูปใหม่แทน
    if(req.file ){
      //แก้ไขรูป
        const festResult  = await prisma.festival_tb.findFirst({
            where: {
                festid: parseInt(req.params.festid)
            }
        })
        // ดูว่ามีรูปหรือไม่ ถ้ามีก็ลบ
        if(festResult.userImage){
         fs.unlinkSync(path.join("images/fests", festResult.festImage));  //? ลบรูปเก่า
        }
        // อัปเดตรูปใหม่
         result = await prisma.fest_tb.update({
          where: {
            festid: parseInt(req.params.festid)
          },
          data: {
            festName:  festName,
            festDetail:  festDetail,
            festState:  festState,
            festCost: parseFloat(festCost),
            festNumDate:parseInt(festNumDate),
            userid: parseInt(userid),    
            festImage: req.file ? req.file.path.replace("images\\fests\\", '') : "",
          }
        })

    }else{
      // ไม่แก้ไขรูป
      result = await prisma.fest_tb.update({
        where: {
          festid: parseInt(req.params.festid)
        },
        data: {
          festName:  festName,
          festDetail:  festDetail,
          festState:  festState,
          festCost: parseFloat(festCost),
          festNumDate:parseInt(festNumDate),
          userid: parseInt(userid),    
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

exports.deleteFest = async (req, res) => {
  try {
    const result = await prisma.fest_tb.delete({
      where: {
        festid: parseInt(req.params.festid)
      }
    })
    res.status(200).json({
      message: "ลบข้อมูลสําเร็จ",
      info: result
    })

  } catch (err) {
    res.status(500).json({
      message: `พบเจอปัญหาในการทำงาน: ${err}`
    })
    console.log('Error', err);
  }
}