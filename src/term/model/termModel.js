const db = require('../../config/db');

// Fetch all terms for a given chapterId
async function getTermsByChapterId(chapterId) {
    return db('term').where({ chapterId });
}

module.exports = {
    getTermsByChapterId,
};
