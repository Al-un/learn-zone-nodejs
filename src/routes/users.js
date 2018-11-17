var router = require('express').Router();

const { UserController } = require('../controllers/user');
var controller = new UserController();

router.get('/', controller.list)
router.get('/:id', controller.parse_new_or_show);
router.get('/:id/edit', controller.edit);
router.post('/', controller.create)
router.put('/:id', controller.update)
router.patch('/:id', controller.update)
router.delete('/:id', controller.delete)

module.exports = router