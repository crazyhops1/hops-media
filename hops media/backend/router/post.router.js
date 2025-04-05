import express from 'express';
import { upload } from '../image-uploader/cloudinary.js';
import { 
  createPost, 
  findPostById, 
  likePost, 
  timeline, 
  unLikedPost, 
  getAllPostById, 
  getAllPostProfile, 
  addComment
} from '../controller/post.controller.js';
import { tokenVerify } from '../verify/token.js';

const postRouter = express.Router();

// Route to create a post
postRouter.post('/create-post', tokenVerify, upload.single('postImage'), createPost);

// Route to like a post
postRouter.get('/like-post/:postId', tokenVerify, likePost);

// Route to unlike a post
postRouter.delete('/unlike-post/:postId', tokenVerify, unLikedPost);

// Route to find a post by ID
postRouter.get('/find-post-id/:id', tokenVerify, findPostById);

// Route to get all posts by user ID
postRouter.get('/all-post-user/:id', tokenVerify, getAllPostById);

// Route to get all posts of the user's profile
postRouter.get('/all-post-profile', tokenVerify, getAllPostProfile);

// Route to get timeline posts (user's posts and posts from followed users)
postRouter.get('/timeline', tokenVerify, timeline);
// comment  on post 
postRouter.post('/comment/:id',tokenVerify,addComment)

export default postRouter;
