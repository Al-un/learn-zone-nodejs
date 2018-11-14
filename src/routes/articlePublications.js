var router = require('express').Router();

const { ArticlePublicationController } = require('../controllers/articlePublication');
var controller = new ArticlePublicationController();

router.get('/:id', controller.show)
router.post('/', controller.create)
router.delete('/:id', controller.delete)

module.exports = router