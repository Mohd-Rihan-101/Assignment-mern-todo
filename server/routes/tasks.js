// server/routes/tasks.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/taskController');

router.get('/get', ctrl.getBoard);
router.get('/get/:id', ctrl.getTask);
router.get('/status', ctrl.getByStatus);
router.post('/add', ctrl.addTask);
router.put('/update', ctrl.updateTask);
router.put('/update-status', ctrl.updateStatus);
router.delete('/delete', ctrl.deleteTask);

module.exports = router;
