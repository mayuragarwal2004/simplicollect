const db = require("../../config/db");

const addHistory=async(data)=>{
    return db("visitorHistory").insert({...data,createdAt:new Date()});
}
const getHistoryByVisitorId=async(visitorId)=>{
    return db("visitorHistory").where("visitorId", visitorId).orderBy("createdAt", "desc");
}
const updateHistory=async(visitorId,historyId,updateData)=>{
    return db("visitorHistory").where("visitorId", visitorId).andWhere("historyId", historyId).update({...updateData,updatedAt:new Date()});
}
const deleteHistory=async(visitorId,historyId)=>{
    return db("visitorHistory").where("visitorId", visitorId).andWhere("historyId", historyId).del();
}
const getHistoryById=async(historyId)=>{
    return db("visitorHistory").where("historyId", historyId).first();
}

module.exports={
    addHistory,
    getHistoryByVisitorId,
    updateHistory,
    deleteHistory,
    getHistoryById
}
