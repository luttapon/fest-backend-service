const {PrismaClient} = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {console} = require('console');

const prisma = new PrismaClient();






//อับโหลดไฟล์------------------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images/users");
    } ,
    filename: (req, file, cb) => {
        cb(null, 'user_'+ Math.floor(Math.random()* Date.now()) + path.extname(file.originalname));
    }
})
exports.uploadUser = multer({
     storage: storage,
     limits: {
         fileSize: 100000000
     },
     fileFilter: (req, file, cb) => {
         const fileTypes = /jpeg|jpg|png/;
         const mimeType = fileTypes.test(file.mimetype);
         const extname = fileTypes.test(path.extname(file.originalname));
         if(mimeType && extname) {
             return cb(null, true);
         }
         cb("Error: Images Only");
     }
}).single("userImage");
//----------------------------------


//เอาช้อมูลที่ส่งมาจาก frontend เพิ่ม (Create/Insert) ลง database
exports.createUser = async (req, res) => {
    try {
        const result = await prisma.user_tb.create({
            data:{
                userFullame: req.body.userFullame,
                userName: req.body.userName,
                userPassward: req.body.userPassward,
                userImage: req.file ? req.file.path.replace('images\\users\\', '') : "",
        }
        })

        res.status(200).json({massage: 'OK', info: result});
    } catch (error) {

        res.status(400).json({message: 'พบปัญหาในการทำงาน' + error});
        console.log('error' + error);
    }
}

//-------------------------------------------------------

