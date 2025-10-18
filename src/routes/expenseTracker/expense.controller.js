const ExpenseService = require('./expense.service');

class ExpenseController {
  static async createExpense(req, res, next) {
    try {
      const expense = await ExpenseService.addExpense(req.body);
      res.status(201).json(expense);
    } catch (error) {
      next(error);
    }
  }

  static async getExpenses(req, res, next) {
    try {
      const { chapterId, memberId } = req.query;
      let expenses;
      if (chapterId) {
        expenses = await ExpenseService.getExpensesByChapter(chapterId);
      } else if (memberId) {
        expenses = await ExpenseService.getExpensesByMember(memberId);
      } else {
        // Handle case where no filter is provided, or return an error
        return res.status(400).json({ message: 'Chapter ID or Member ID is required' });
      }
      res.status(200).json(expenses);
    } catch (error) {
      next(error);
    }
  }

  static async getExpense(req, res, next) {
    try {
      const expense = await ExpenseService.getExpenseById(req.params.id);
      if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
      }
      res.status(200).json(expense);
    } catch (error) {
      next(error);
    }
  }

  static async updateExpense(req, res, next) {
    try {
      const expense = await ExpenseService.updateExpense(req.params.id, req.body);
      res.status(200).json(expense);
    } catch (error) {
      next(error);
    }
  }

  static async deleteExpense(req, res, next) {
    try {
      await ExpenseService.deleteExpense(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ExpenseController;
