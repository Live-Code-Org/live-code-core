const User = require('../models/User');


const getUserProfile = async (req, res) => {
    try {
        const {githubHandle} = req.params;
        
        const user = await User.findOne({githubHandle: githubHandle.toLowerCase() }).select('-__v')

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        } else {
            res.status(200).json(user);
        }
    } catch (error) {
        console.error('Error in controller:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Internal Server Error'});
    }
};

const updateUserProfile = async (req, res) => {
    try {

        const {githubHandle} = req.params;
                const {
            fullName,
            avatarUrl,
            primaryRole,
            skillLevel,
            techStack,
            weeklyHours,
            workStyle
        } = req.body;

        const allowedUpdates = {};
        if (fullName !== undefined) allowedUpdates.fullName = fullName;
        if (avatarUrl !== undefined) allowedUpdates.avatarUrl = avatarUrl;
        if (primaryRole !== undefined) allowedUpdates.primaryRole = primaryRole;
        if (skillLevel !== undefined) allowedUpdates.skillLevel = skillLevel;
        if (techStack !== undefined) allowedUpdates.techStack = techStack;
        if (weeklyHours !== undefined) allowedUpdates.weeklyHours = weeklyHours;
        if (workStyle !== undefined) allowedUpdates.workStyle = workStyle;

        const updateUser = await User.findOneAndUpdate(
            { githubHandle: githubHandle.toLowerCase() },
            allowedUpdates,
            { new : true, runValidators: true }
        ).select('-__v');

        if (!updateUser) {
            return res.status(404).json({ message: "User not found"});
        }

        res.status(200).json(updateUser);


    } catch (error) {
        console.error('Error updating user profile:', error);

        if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile
};