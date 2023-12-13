const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path=require('path');
const imageModel=require('./model/image')

mongoose.connect('mongodb://127.0.0.1:27017/image')


const app=express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'))

// here specify storage ie,multer.diskStorage
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{     //herre we provide path to the file ie, create afolder public and inside it should dispplay the image folder there only the image will be uploaded
        cb(null, 'public/images')    //in this callback function we create the path for store images, first null indicates error and next indicate the path for image
    },
    filename:(req, file, cb)=>{     //here specifies filename
        // here it specifies file and its field name and also date and its path name original 
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})


// assign storage in storage
const upload=multer({
    storage: storage
})





 app.post('/upload', upload.single('file'), (req, res) => {
    imageModel.create({ image: req.file.filename })
        .then(result => {
            console.log(req.file);
            res.json(result); // Send JSON response after creating the image record
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err.message }); // Send error response with status code 500
        });
});



app.get('/getimage',(req,res)=>{
    imageModel.find()
    .then(image => res.json(image))
    .catch(err => res.json(err))
})

app.listen(3000,()=>{
    console.log('server is running');
})
