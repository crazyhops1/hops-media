import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddAPhoto from '@mui/icons-material/AddAPhoto';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { url } from '../../App';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const Createpost = ({ useridPost }) => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // State to hold the selected image
  const [description, setDescription] = useState(''); // State to hold the description
  const [loading, setLoading] = useState(false); // Add loading state for the upload action

  // Handle dialog open/close
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null); // Reset selected image when closing dialog
    setDescription(''); // Reset description when closing dialog
  };

  // Handle file selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file); // Set the selected image file (not the object URL)
    }
  };

  // Handle description change
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value); // Update description state
  };

  const uploadPost = async () => {
    if (!selectedImage) {
      toast.error('Please select an image before submitting.');
      return;
    }
if(description.length<10){
  toast.error('decription should be 10 char')
}
    setLoading(true); // Start loading while the post is being uploaded
    

    // Prepare the form data
    const formData = new FormData();
    formData.append('postImage', selectedImage); // Add the image file to form data
    formData.append('description', description || ''); // Add the description if available

    try {
      // Make the POST request
      const response = await axios.post(`${url}/post/create-post`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Make sure to specify the content type
        },
        withCredentials:true
      });

if( response.status===201){
        // Handle response
        toast.success(response.data.message);
        handleClose(); // Close dialog after successful upload
}
else{
  toast.error(response.data.message);
 

}
    } catch (error) {
      // Improved error handling`
      toast.error('Error uploading post. Please try again.');
    } finally {
      setLoading(false); // Stop loading after the request
    }
  };

  return (
    <div>
      {/* Placeholder to create new post */}
      <div variant="outlined" onClick={handleClickOpen}>
        <AddAPhoto />
      </div>

      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">Create a New Post</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          {/* Implement Post creation/upload logic here */}
          <Typography gutterBottom>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload files
              <VisuallyHiddenInput
                type="file"
                onChange={handleImageChange}
                accept="image/*" // Only allow image files
              />
            </Button>

            {selectedImage && (
              <div style={{ marginTop: '20px' }}>
                <img
                  src={URL.createObjectURL(selectedImage)} // Use object URL to display selected image preview
                  alt="Selected Preview"
                  style={{ width: '100%', maxWidth: '450px', maxHeight: '450px', objectFit: 'contain' }}
                />
              </div>
            )}

            {/* Description Field */}
            <TextField
              style={{ marginTop: '12px' }}
              id="outlined-multiline-flexible"
              label="Description"
              multiline
              maxRows={4}
              value={description}
              onChange={handleDescriptionChange}
              fullWidth
            />
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={uploadPost} disabled={loading}>
            {loading ? 'Uploading...' : ' post uploaded'}
          </Button>
        </DialogActions>
      </BootstrapDialog>

      <ToastContainer />
    </div>
  );
};

export default Createpost;
