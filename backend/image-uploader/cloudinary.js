import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);  // Unique filename
    },
  });
  
export const upload = multer({ storage: storage }); 
// Configure Cloudinary
const configureCloudinary = () => {
    cloudinary.config({
      cloud_name: process.env.CLOUDNAME,
      api_key: process.env.CLOUDAPI,
      api_secret: process.env.CLOUDAPIKEYSECRATE,
    });
  };

  // Function to upload an image to Cloudinary
const uploadImageToCloudinary = async (filePath) => {
    try {
      configureCloudinary(); // Ensure Cloudinary is configured
  
      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(filePath);
      
      // Return the secure URL of the uploaded image
      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Image upload to Cloudinary failed');
    }
  };
  
  export default uploadImageToCloudinary;