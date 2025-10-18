const db = require('../../config/db');

class Expense {
  static async create(data) {
    const [id] = await db('Expense').insert(data);
    return { id, ...data };
  }

  static async findById(id) {
    return await db('Expense').where({ id }).first();
  }

  static async findByChapter(chapterId) {
    return await db('Expense').where({ chapterId });
  }

  static async findByMember(expenseByMemberId) {
    return await db('Expense').where({ expenseByMemberId });
  }

  static async update(id, data) {
    return await db('Expense').where({ id }).update(data);
  }

  static async delete(id) {
    return await db('Expense').where({ id }).del();
  }
}

module.exports = Expense;

