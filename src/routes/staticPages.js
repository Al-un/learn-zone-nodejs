var secured = require('../middleware/secured');
var router = require('express').Router();

const { StaticPagesController } = require('../controllers/staticPages');
var controller = new StaticPagesController();

router.get('/misc-info', controller.miscInfo);

module.exports = router