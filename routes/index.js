var express = require('express');
var router = express.Router();

router.use('/student', require('./students'));


module.exports = router;
