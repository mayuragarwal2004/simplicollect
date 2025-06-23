const db = require('../../config/db');

// Fetch all terms for a given chapterId
async function getTermsByChapterId(chapterId) {
    return db('term').where({ chapterId });
}

// Fetch a single term by termId
async function getTermById(termId) {
    return db('term').where({ termId }).first();
}

module.exports = {
    getTermsByChapterId,
    getTermById,
};
