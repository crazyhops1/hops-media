import uploadImageToCloudinary from "../image-uploader/cloudinary.js";
import userModel from "../model/user.model.js";

// Find user by their user ID
export const findUserById = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const user = await userModel.findById(id).select('userProfile userName followers following _id');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'User found', data: user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Find user profile by ID
export const findUserProfile = async (req, res) => {
    const id = req.id;

    if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const user = await userModel.findById(id).select('userProfile userName followers following');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'User found', data: user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Update user profile image
export const updatedProfile = async (req, res) => {
    const userId = req.id;  // Assuming req.id is the logged-in user's ID from JWT or session

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    // Ensure a file is uploaded
    if (!req.file) {
        return res.status(400).json({ message: 'Please provide an image.' });
    }

    try {
        const imagePath = req.file.path;

        // Upload the image to Cloudinary
        const imageUrl = await uploadImageToCloudinary(imagePath);

        // Update the user's profile with the new image URL
        const updatedProfile = await userModel.findByIdAndUpdate(
            userId,
            { userProfile: imageUrl },
            { new: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'Profile image updated successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Find user by their username
export const findUserByUserName = async (req, res) => {
    const { userName } = req.body;

    if (!userName) {
        return res.status(400).json({ message: 'Username is required' });
    }

    try {
        const user = await userModel.findOne({ userName }).select("userName userProfile followers following _id");

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'User found', data: user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Follow a user
export const followAnyUser = async (req, res) => {
    const userId = req.id; // Ensure this comes from the logged-in user's ID
    const { targetUserId } = req.params;
  
    

    if (!targetUserId) {
        return res.status(400).json({ message: 'Target user ID is required' });
    }

    if (userId === targetUserId) {
        return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    try {
        const findUser = await userModel.findById(userId);
        if (!findUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const findTargetUser = await userModel.findById(targetUserId);
        if (!findTargetUser) {
            return res.status(404).json({ message: 'Target user not found' });
        }

        if (!findUser.following.includes(targetUserId)) {
            await userModel.findByIdAndUpdate(userId, { $push: { following: targetUserId } });
            await userModel.findByIdAndUpdate(targetUserId, { $push: { followers: userId } });

            return res.status(201).json({ message: 'Followed this user' });
        } else {
            return res.status(400).json({ message: 'You are already following this user' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Unfollow a user
export const UnFollowAnyUser = async (req, res) => {
    const userId = req.id;
    const { targetUserId } = req.params;

    if (!targetUserId) {
        return res.status(400).json({ message: 'Target user ID is required' });
    }

    if (userId === targetUserId) {
        return res.status(400).json({ message: 'You cannot unfollow yourself' });
    }

    try {
        const findUser = await userModel.findById(userId);
        if (!findUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const findTargetUser = await userModel.findById(targetUserId);
        if (!findTargetUser) {
            return res.status(404).json({ message: 'Target user not found' });
        }

        if (findUser.following.includes(targetUserId)) {
            await userModel.findByIdAndUpdate(userId, { $pull: { following: targetUserId } });
            await userModel.findByIdAndUpdate(targetUserId, { $pull: { followers: userId } });

            return res.status(200).json({ message: 'Unfollowed the user successfully' });
        } else {
            return res.status(400).json({ message: 'You are not following this user' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
