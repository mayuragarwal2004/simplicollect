// controllers/rightsControllers.js
const rightsModel = require("../model/rightsModel");

const getSidebarRightsController = async (req, res) => {
  const { memberId } = req.user;
  const { chapterId } = req.query;
  try {
    const rights_raw = await rightsModel.getRightsByMemberIdAndChapterIdAndMenu(
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

const getApprovePaymentRightsController = async (req, res) => {
  const { memberId } = req.user;
  const { chapterId } = req.params;

  if (!memberId || !chapterId) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const all_rights = await rightsModel.getAllRightsByMemberIdAndChapterId(
      memberId,
      chapterId
    );

    const value_to_find = "approve_global_fee";

    const rights_raw = all_rights.filter((right) => {
      return right.featureId === value_to_find;
    });

    if (rights_raw.length === 0) {
      return res.json({ allowed: false });
    }
    res.json({ allowed: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getMakeTransactionRightsController = async (req, res) => {
  const { memberId } = req.user;
  const { chapterId } = req.params;

  if (!memberId || !chapterId) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const all_rights = await rightsModel.getAllRightsByMemberIdAndChapterId(
      memberId,
      chapterId
    );

    const value_to_find = "make-member-transaction";

    const rights_raw = all_rights.filter((right) => {
      return right.featureId === value_to_find;
    });

    if (rights_raw.length === 0) {
      return res.json({ allowed: false });
    }
    res.json({ allowed: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getChangeDateRightsController = async (req, res) => {
  const { memberId } = req.user;
  const { chapterId } = req.params;

  if (!memberId || !chapterId) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const all_rights = await rightsModel.getAllRightsByMemberIdAndChapterId(
      memberId,
      chapterId
    );

    const value_to_find = "change-package-selection-date";

    const rights_raw = all_rights.filter((right) => {
      return right.featureId === value_to_find;
    });

    if (rights_raw.length === 0) {
      return res.json({ allowed: false });
    }
    res.json({ allowed: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getSidebarRightsController,
  getApprovePaymentRightsController,
  getMakeTransactionRightsController,
  getChangeDateRightsController,
};
