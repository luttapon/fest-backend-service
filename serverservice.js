const express = require('express');
const cors = require('cors');
const userRoute = require('./routes/user.route');
const festRoute = require('./routes/fest.route');

const app = express(); //สร้าง web server
const Post = process.env.PORT

require('dotenv').config();


// ใช้ middleware
app.use(cors())
app.use(express.json());
app.use('/user', userRoute);
app.use('/fest',festRoute);


// test
app.get('/', (req, res) => {
    res.json('welcome to my Worldddd ! ...............................................Luttapon ');
});



app.listen(Post, () => {
    console.log(`Server is running on port ${Post}`);
    // console.log('Server is running on port' + Post);
});
   
