const express = require('express');
const ExpenseController = require('./expense.controller');
// const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// router.use(authMiddleware);

router.post('/', ExpenseController.createExpense);
router.get('/', ExpenseController.getExpenses);
router.get('/:id', ExpenseController.getExpense);
router.put('/:id', ExpenseController.updateExpense);
router.delete('/:id', ExpenseController.deleteExpense);

module.exports = router;
