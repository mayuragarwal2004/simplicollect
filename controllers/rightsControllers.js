// controllers/rightsControllers.js
const rightsModel = require("../models/rightsModel");

const getAllRightsController = async (req, res) => {
  const { memberId } = req.user;
  const { chapterId } = req.query;
  try {
    const rights_raw = await rightsModel.getRightsByMemberIdAndChapterId(
      memberId,
      chapterId
    );

    const rights = rights_raw[0];
    console.log({ rights });

    const finalRightsData = [];
    const completedFeatures = [];

    for (i = 0; i < rights.length; i++) {
      const feature = rights[i];

      if (completedFeatures.includes(feature.featureParent)) {
        continue;
      }

      // add the title and url of the same feature parent to an array
      const links = [];
      let icon = "";
      for (j = 0; j < rights.length; j++) {
        if (rights[j].featureParent === feature.featureParent) {
          icon = rights[j].featureIcon;
          links.push({
            title: rights[j].featureName,
            to: rights[j].featureUrl,
          });
        }
      }

      finalRightsData.push({
        title: feature.featureParent,
        icon,
        links,
      });

      completedFeatures.push(feature.featureParent);
    }

    res.json(finalRightsData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllRightsController,
};
