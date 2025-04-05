import React, { useEffect, useState } from 'react';
import profile from '../../assets/default-image.jpg';
import { Grid, Button, Stack, Card, CardContent, Typography,  } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Navbar from '../../comp/navbar/Navbar';
import axios from 'axios';
import Createpost from '../../comp/post/Createpost';
import Badge from '@mui/material/Badge';
import { url } from '../../App';


const Profile = () => {
  const [data, setData] = useState('');
  const [posts, setPosts] = useState([]);
  const [newProfile, setNewProfile] = useState(null);
  const user = localStorage.getItem('ul')

  // Add the selected profile picture file to the state
  const addProfile = (e) => {
    const file = e.target.files[0]; // Get the first file selected
    if (file) {
      setNewProfile(file); // Set the selected file in state
    }
  };

  // Handle profile image change by uploading the new image to the server
  const changeImage = async (e) => {
    addProfile(e); // Call addProfile to save the file in state

    if (newProfile) {
      try {
        // Create a FormData instance to send the image as multipart/form-data
        const formData = new FormData();
        formData.append('image', newProfile); // Attach the selected file
      
        // Send the image to the server
        const response = await axios.put(`${url}/user/update-profile`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Ensure that the server knows this is a file upload
          },
          withCredentials:true
        });
        // Handle success (e.g., update user profile with the new image URL)
        setData((prevData) => ({ ...prevData, userProfile: response.data.userProfile }));

      } catch (error) {
     
      }
    }
  };

  // Fetch user data and posts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${url}/user/get-user-profile`,{
withCredentials:true
        });
     
        setData(response.data.data)


      } catch (error) {
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${url}/post/all-post-profile`,{withCredentials:true});
        setPosts(response.data.posts.reverse());
      } catch (error) {
      }
    };

    fetchPosts();
    fetchData();
  }, []);

  // Icon and button for profile actions
  function IconLabelButtons() {
    return (
      <Stack style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }} direction="row" spacing={2}>
        <Button variant="outlined"><Createpost useridPost={user._id} /></Button>
        <Button variant="outlined" endIcon={<SendIcon />}>Share Profile</Button>
      </Stack>
    );
  }

  // Image grid layout for displaying posts (Instagram style)
  function PostGrid() {
    return (
      <Grid container spacing={2} justifyContent="center" style={{ marginTop: '20px',flexWrap:'wrap', flexGrow:1 }}>
        {posts &&  posts.length > 0 ? (
          posts.map((post) => (
            <Grid item key={post._id} xs={12} sm={6} md={4} lg={3}>
              <Card style={{ width: '100%' }}>
                <img
                  src={post.postImage}
                  alt={post.title}
                  style={{
                    width: '100%',
                    height: '250px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                  }}
                />
                <CardContent>
                  <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px' }}>
                    {post.description || 'No caption'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Createpost useridPost={user._id} />
        )}
      </Grid>
    );
  }

  return (
    <div >
      <Navbar />
      <div className=" mb-3"  style={{ marginTop:"5.5%"  }}>
        <div className="row g-0">
          <div className="col-md-4">
            {/* Profile Image */}
         

            <label htmlFor="image-update" onChange={changeImage}>
            <img
              src={data?.userProfile || profile}
              style={{
              
                maxWidth: '200px',
                width: '100%',
            
                aspectRatio: '5/5',
                objectFit: 'contain',
                backgroundColor:'#FAF9F6 ',
                borderRadius: '50%',
                margin: '30px',
                position: 'relative',
              }}
              className="img-fluid"
              alt="Profile"
            />
             
            </label>
            <input
              style={{ visibility: 'hidden' }}
              type="file"
              name="image-update"
              id="image-update"
              onChange={changeImage}
            />
          </div>

          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">{data?.userName || 'User'}</h5>
            </div>
          </div>

          <div className="card-body" style={{ width: '100%',  display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
            {/* Profile Stats */}
            <div className="profile-about">
              <div><b>{posts.length}</b></div>
              <div>Posts</div>
            </div>
            <div className="profile-about">
              <div><b>{data?.followers?.length || 0}</b></div>
              <div>Followers</div>
            </div>
            <div className="profile-about">
              <div><b>{data?.following?.length || 0}</b></div>
              <div>Following</div>
            </div>
          </div>

          <div className="card-body">
            <IconLabelButtons />
          </div>
        </div>
      </div>

      <div className="row">
        {/* Image Gallery for posts */}
        <PostGrid />
      </div>
    </div>
  );
};

export default Profile;
