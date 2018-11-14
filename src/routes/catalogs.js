var router = require('express').Router();

const { CatalogController } = require('../controllers/catalog');
var controller = new CatalogController();

router.get('/', controller.list)
router.get('/:id', controller.show)
router.post('/', controller.create)
router.put('/:id', controller.update)
router.patch('/:id', controller.update)
router.delete('/:id', controller.delete)

module.exports = router