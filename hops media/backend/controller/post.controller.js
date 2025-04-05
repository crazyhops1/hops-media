import uploadImageToCloudinary from "../image-uploader/cloudinary.js";
import postModel from "../model/post.model.js";
import userModel from "../model/user.model.js";

// Create a new post


export const createPost = async (req, res) => {
  const  userId  = req.id;
  const { description } = req.body;
  
  // Validate inputs
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Image file is required' });
  }

  const { path: postImagePath } = req.file;



  try {
    // Upload image to Cloudinary
    const imageUrl = await uploadImageToCloudinary(postImagePath);

    if (!imageUrl) {
      return res.status(400).json({ message: 'Error uploading image to Cloudinary' });
    }

    // Create new post
    const newPost = new postModel({
      userId,
      postImage: imageUrl,
      description,
    });

    // Save the post
    await newPost.save();

    return res.status(201).json({ message: 'Post created successfully', post: newPost });

  } catch (error) {
    console.error(error);  // Log the error for debugging
    return res.status(500).json({ message: 'Internal server error' });
  }
};


// Like a post
export const likePost = async (req, res) => {
    const  userId  = req.id;  // This is the user ID who is liking the post.
    const { postId } = req.params;  // Post ID from the URL parameters

    try {
        // Find the post by its ID
        const findPost = await postModel.findById(postId);

        if (!findPost) {
            return res.status(400).json({ message: 'Post not found' });
        }

        // Check if the user already liked the post
        if (findPost.like.includes(userId)) {
            return res.status(400).json({ message: 'You already liked this post' });
        }

        // Add the user to the likes array
        const updatedPost = await postModel.findByIdAndUpdate(
            postId,
            { $push: { like: userId } },  // Make sure you're using 'likes' as the field name
            { new: true }  // Return the updated post
        );

        if (updatedPost) {
            return res.status(200).json({ message: 'Post liked successfully' });
        } else {
            return res.status(500).json({ message: 'Failed to like the post' });
        }

    } catch (error) {
        console.error(error);  // Log the error for debugging
        return res.status(500).json({ message: 'Internal server error' });
    }
};




// Unlike a post
export const unLikedPost = async (req, res) => {
    const  userId  = req.id;  // User who is unliking the post
    const { postId } = req.params; // Post ID from the URL parameter

    try {
        // Find the post by its ID
        const findPost = await postModel.findById(postId);

        if (!findPost) {
            return res.status(400).json({ message: 'Post not found' });
        }

        // Check if the user already liked the post
        if (!findPost.like.includes(userId)) {
            return res.status(400).json({ message: 'You have not liked this post yet' });
        }

        // Remove the userId from the likes array
        await postModel.findByIdAndUpdate(postId, { $pull: { like: userId } });

        return res.status(200).json({ message: 'Post unliked successfully' });

    } catch (error) {
        console.error(error);  // Log the error for debugging
        return res.status(500).json({ message: 'Internal server error' });
    }
};


// find post by userId
export const findPostById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Post ID is required' });
    }

    try {
        // Find the post by ID
        const findPost = await postModel.findById(id);
        if (!findPost) {
            return res.status(400).json({ message: 'Post not found' });
        }

        // Find the user who created the post
        const findUser = await userModel.findById(findPost.userId);
        if (!findUser) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Prepare user data
        const userData = {
            username: findUser.userName,
            image: findUser.userProfile,
            id: findUser._id,
        };

        // Return the post and user data
        return res.status(200).json({
            message: 'Post found',
            post: findPost,
            userData,
        });

    } catch (error) {
        console.error(error);  // Log the error for debugging
        return res.status(500).json({ message: 'Internal server error' });
    }
};
// get all post by user
export const getAllPostById = async (req, res) => {
    const  {id}  = req.params; 
    if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
    

        // Find the user who created the posts
        const findUser = await userModel.findById(id);

        if (!findUser) {
            return res.status(400).json({ message: 'User not found' });
        }

            // Find the posts by the user ID
        const findPosts = await postModel.find({ userId: id });

            if (findPosts.length === 0) {
                return res.status(400).json({ message: 'No posts found for this user' });
            }

        // Prepare user data
        const userData = {
            username: findUser.userName,
            image: findUser.userProfile,
            id: findUser._id,
        };

        // Return the posts and user data
        return res.status(200).json({
            message: 'Posts found',
            posts: findPosts,  // Return the posts array
            userData,
        });

    } catch (error) {
        console.error(error);  // Log the error for debugging
        return res.status(500).json({ message: 'Internal server error' });
    }
};
// get all post by user
export const getAllPostProfile = async (req, res) => {
    const  id  = req.id; 
    if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
    

        // Find the user who created the posts
        const findUser = await userModel.findById(id);

        if (!findUser) {
            return res.status(400).json({ message: 'User not found' });
        }

            // Find the posts by the user ID
        const findPosts = await postModel.find({ userId: id });

            if (findPosts.length === 0) {
                return res.status(400).json({ message: 'No posts found for this user' });
            }

        // Prepare user data
        const userData = {
            username: findUser.userName,
            image: findUser.userProfile,
            id: findUser._id,
        };

        // Return the posts and user data
        return res.status(200).json({
            message: 'Posts found',
            posts: findPosts,  // Return the posts array
            userData,
        });

    } catch (error) {
        console.error(error);  // Log the error for debugging
        return res.status(500).json({ message: 'Internal server error' });
    }
};
// timeline post
export const timeline = async (req, res) => {
    const  id  = req.id
    if (!id) {
        return res.status(400).json({ message: 'user id is required' })
    }

    try {
        // Get the current user
        const currentUser = await userModel.findById(id);

        // If user not found
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Get posts from the current user and populate the user details
        const userPost = await postModel.find({ userId: currentUser._id }).populate({
            path: 'userId',
            select: 'userName userProfile _id', // only the fields we need
        });

        // If no followings, return only the user's posts
        if (!currentUser.following || currentUser.following.length === 0) {
            return res.status(200).json(userPost);
        }

        // Get posts from the friends the current user follows and populate the user details
        const friendPosts = await postModel.find({
            userId: { $in: currentUser.following }
        }).populate({
            path: 'userId',
            select: 'userName userProfile _id', // only the fields we need
        });

        // Combine the user's posts with their friends' posts
        const allPosts = [...userPost, ...friendPosts];

        // Return the combined list of posts
        return res.status(200).json(allPosts);

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}
// add comment

export const addComment = async (req, res) => {
    const { id } = req.params;  // post id 
    const { comment } = req.body;
    const user= req.id

    // Check if id or comment is missing
    if (!id || !comment) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Update the user with the new comment
    const updatedUser = await postModel.findByIdAndUpdate(id,{$push:{comments:[{user,comment}]}} ,{ new: true });

        // Check if the user was found and updated
        if (!updatedUser) {
            return res.status(404).json({ message: 'post not found' });
        }

        // Send a successful response with the updated user
        return res.status(200).json({ message: 'Comment added successfully', updatedUser });
    } catch (error) {
        // Handle any errors that occur during the process
        return res.status(500).json({ message: 'An error occurred while adding the comment', error: error.message });
    }
};






