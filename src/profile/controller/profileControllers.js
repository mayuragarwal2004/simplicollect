
const profileModel = require('../model/profileModel');


const updateName = async (req, res) => {
    const { firstName, lastName } = req.body;
    const memberId = req.params.memberId;

    console.log('Received:', { memberId, firstName, lastName }); // Add logging

    try {
        const updatedMember = await profileModel.updateName(memberId, firstName, lastName);
        
        
        if (!updatedMember || updatedMember.length === 0) {
            return res.status(404).json({ message: "Member not found" });
        }
        
        return res.status(200).json({
            success: true,
            data: {
                firstName: updatedMember.firstName,
                lastName: updatedMember.lastNname
            }
        });
    } catch (error) {
        console.error('Controller error:', error);
        return res.status(500).json({ 
            message: "Internal server error",
            error: error.message 
        });
    }
};

module.exports = {

    updateName

};