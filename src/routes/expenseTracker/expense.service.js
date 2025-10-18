const Expense = require('./expense.model');

class ExpenseService {
  static async addExpense(data) {
    // TODO: Add validation
    return await Expense.create(data);
  }

  static async getExpenseById(id) {
    return await Expense.findById(id);
  }

  static async getExpensesByChapter(chapterId) {
    return await Expense.findByChapter(chapterId);
  }

  static async getExpensesByMember(memberId) {
    return await Expense.findByMember(memberId);
  }

  static async updateExpense(id, data) {
    // TODO: Add validation
    return await Expense.update(id, data);
  }

  static async deleteExpense(id) {
    return await Expense.delete(id);
  }
}

module.exports = ExpenseService;
