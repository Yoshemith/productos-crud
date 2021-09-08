// ************ Require's ************
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

let storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        let folder = path.join(__dirname, '../../public/images/products');
        cb(null, folder);
    },
    filename: (req, file, cb)=>{
        let imageName = Date.now() + path.extname(file.originalname);
        cb(null, imageName);
    }
})

let fileUpload = multer({ storage });

// ************ Controller Require ************
const productsController = require('../controllers/productsController');

/*** GET ALL PRODUCTS ***/ 
router.get('/', productsController.index); 

/*** CREATE ONE PRODUCT ***/ 
router.get('/create/', productsController.create); 
router.post('/', fileUpload.single('product-image'), productsController.store); 


/*** GET ONE PRODUCT ***/ 
router.get('/detail/:id/', productsController.detail); 

/*** EDIT ONE PRODUCT ***/ 
router.get('/edit/:id', productsController.edit); 
router.patch('/edit/:id', productsController.update); 


/*** DELETE ONE PRODUCT***/ 
router.delete('/delete/:id', productsController.destroy); 


module.exports = router;
