var express = require('express');
var router = express.Router();

router.use('/student',          require('./students'));
router.use('/host',             require('./hosts'));
router.use('/group',            require('./groups'));
router.use('/agency',           require('./agencies'));
router.use('/school',           require('./schools'));
router.use('/company',          require('./companies'));
router.use('/payment',          require('./payments'));

module.exports = router;
