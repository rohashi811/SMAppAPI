var express = require('express');
var router = express.Router();

router.use('/student',          require('./students'));
router.use('/homestay',         require('./homestay')); 
router.use('/student-homestay', require('./student-homestay'));


module.exports = router;
