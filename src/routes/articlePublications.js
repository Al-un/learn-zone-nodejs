var secured = require('../middleware/secured');
var router = require('express').Router();

const { ArticlePublicationController } = require('../controllers/articlePublication');
var controller = new ArticlePublicationController();

router.get('/:id', controller.show);
router.post('/', secured, controller.create)
router.delete('/:id', secured, controller.delete)

module.exports = router