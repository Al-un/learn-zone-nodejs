var router = require('express').Router();

const { ArticleController } = require('../controllers/article');
var controller = new ArticleController();

router.get('/', controller.list)
router.get('/:id', controller.dispatch_id);
router.get('/:id/edit', controller.edit);
router.post('/', controller.create)
router.put('/:id', controller.update)
router.patch('/:id', controller.update)
router.delete('/:id', controller.delete)

module.exports = router