const termModel = require('../model/termModel');

// Controller to get all terms for a chapter
async function getTermsByChapter(req, res) {
    try {
        const { chapterId } = req.params;
        if (!chapterId) {
            return res.status(400).json({ error: 'chapterId is required' });
        }
        const terms = await termModel.getTermsByChapterId(chapterId);
        res.json(terms);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch terms', details: error.message });
    }
}

module.exports = {
    getTermsByChapter,
};
