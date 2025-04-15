import express from 'express';
import { findUserById, findUserByUserName, followAnyUser, UnFollowAnyUser, updatedProfile, findUserProfile } from '../controller/user.controller.js';
import { upload } from '../image-uploader/cloudinary.js';
import { tokenVerify } from '../verify/token.js';

const userRouter = express.Router();

// Update user profile (image upload)
userRouter.put('/update-profile', tokenVerify, upload.single('image'), updatedProfile);

// Get user by ID
userRouter.get('/get-user-id/:id', tokenVerify, findUserById);

// Get logged-in user's profile (based on token)
userRouter.get('/get-user-profile', tokenVerify, findUserProfile);

// Get user by username
userRouter.post('/get-user-username', tokenVerify, findUserByUserName);

// Follow a user
userRouter.get('/follow-user/:targetUserId', tokenVerify, followAnyUser);

// Unfollow a user
userRouter.get('/unfollow-user/:targetUserId', tokenVerify, UnFollowAnyUser);

export default userRouter;
