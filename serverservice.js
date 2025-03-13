const express = require('express');
const cors = require('cors');
const userRoute = require('./routes/user.route');

require('dotenv').config();

const app = express(); //สร้าง web server

const Post = process.env.PORT

// 
app.use(cors())
app.use(express.json());
app.use(`/user`, userRoute);


// test
app.get('/', (req, res) => {
    res.json('welcome to my Worldddd ! ...............................................Luttapon ');
});



app.listen(Post, () => {
    // console.log(`Server is running on port ${Post}`);
    console.log('Server is running on port' + Post);
});
   
