const termModel = require('../model/termModel');
const chapterModel = require('../../chapter/model/chapterModel');

// Controller to get all terms for a chapter
async function getTermsByChapter(req, res) {
    try {
        let { chapterId } = req.params;
        if (!chapterId) {
            return res.status(400).json({ error: 'chapterId is required' });
        }

        let chapter = await chapterModel.findChapterById(chapterId);
        
        if (!chapter) {
            chapter = await chapterModel.findChapterBySlug(chapterId);
            if (!chapter) {
                return res.status(404).json({ error: 'Chapter not found' });
            }
            chapterId = chapter.chapterId;
        }
        console.log(`finding term of the chapter`);
        console.log({ chapter });

        console.log(chapterId);
        
        
        const terms = await termModel.getTermsByChapterId(chapterId);
        console.log({ terms });
        res.json(terms);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch terms', details: error.message });
    }
}

module.exports = {
    getTermsByChapter,
};
