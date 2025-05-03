const visitorHistoryModel = require("../model/visitorHistoryModel");
const db = require("../../config/db");

const addHistory = async (req, res) => {
    const { visitorId } = req.params;
    const { type, to, title, content } = req.body;
    const visitor=await db("visitors").where("visitorId", visitorId).first();
    if (!visitor) {
        return res.status(404).json({ error: "Visitor not found" });
    }
    if (!["call", "note", "email", "whatsapp"].includes(type)) {
        return res.status(400).json({ error: "Invalid type" });
    }
    if (!content) {
        return res.status(400).json({ error: "Content is required" });
    }
    switch (type) {
        case "call":
            if (!to) {
                to=visitor.mobileNumber;
                // return res.status(400).json({ error: "'to' is required for call" });
            }
            break;
        case "email":
            if (!to) {
                to=visitor.email;
                // return res.status(400).json({ error: "'to' is required for " + type });
            }
            if ( !title) {
                return res.status(400).json({ error: " 'title' is required for " + type });
            }
            break;
        case "whatsapp":
            if (!to) {
                to=visitor.mobileNumber;
                // return res.status(400).json({ error: "'to' is required for " + type });
            }
            if ( !title) {
                return res.status(400).json({ error: " 'title' is required for " + type });
            }
            break;
        case "note":
            break;
    }

    try {
        const historyData = {
            visitorId,
            type,
            to: to || null,
            title: title || null,
            content,
            memberId:req.user.memberId,
        };

        await visitorHistoryModel.addHistory(historyData);
        res.json({ message: "History added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getHistoryByVisitorId = async (req, res) => {
    const { visitorId } = req.params;
    if(!visitorId){
        return res.status(400).json({ error: "Visitor ID is required" });
    }
    const visitor = await db("visitors").where("visitorId", visitorId).first();
    if (!visitor) {
        return res.status(404).json({ error: "Visitor not found" });
    }
    try {
        const history = await visitorHistoryModel.getHistoryByVisitorId(visitorId);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const updateHistory = async (req, res) => {
    const { visitorId, historyId } = req.params;
    const updateData = req.body;
    const visitor = await db("visitors").where("visitorId", visitorId).first();
    if (!visitor) {
        return res.status(404).json({ error: "Visitor not found" });
    }
    if(!historyId){
        return res.status(400).json({ error: "History ID is required" });
    }
    updateData.memberId=req.user.memberId;
    const history = await db("visitorHistory").where("historyId", historyId).first();
    if (!history) {
        return res.status(404).json({ error: "History not found" });
    }
    // if (history.visitorId !== visitorId) {
    //     return res.status(403).json({ error: "You are not authorized to update this history" });
    // }
    try {
        await visitorHistoryModel.updateHistory(visitorId, historyId, updateData);
        res.json({ message: "History updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const deleteHistory = async (req, res) => {
    const { visitorId, historyId } = req.params;
    const visitor = await db("visitors").where("visitorId", visitorId).first();
    if (!visitor) {
        return res.status(404).json({ error: "Visitor not found" });
    }
    if(!historyId){
        return res.status(400).json({ error: "History ID is required" });
    }
    const history = await db("visitorHistory").where("historyId", historyId).first();
    if (!history) {
        return res.status(404).json({ error: "History not found" });
    }
    // if (history.visitorId !== visitorId) {
    //     return res.status(403).json({ error: "You are not authorized to delete this history" });
    // }
    try {
        await visitorHistoryModel.deleteHistory(visitorId, historyId);
        res.json({ message: "History deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const getHistoryById = async (req, res) => {
    const { historyId } = req.params;
    if(!historyId){
        return res.status(400).json({ error: "History ID is required" });
    }
    try {
        const history = await visitorHistoryModel.getHistoryById(historyId);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
module.exports = {
    addHistory,
    getHistoryByVisitorId,
    updateHistory,
    deleteHistory,
    getHistoryById
}