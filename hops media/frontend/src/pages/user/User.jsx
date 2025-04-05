import React, { useEffect, useState } from 'react';
import profile from '../../assets/default-image.jpg';
import { Card, CardContent, Typography, Grid, Button, Stack, CircularProgress } from '@mui/material';
import {  Message, PersonAdd } from '@mui/icons-material';
import Navbar from '../../comp/navbar/Navbar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { url } from '../../App';


const User = () => {
  const { id } = useParams(); 
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]); // Store the user's posts
  const [checkFollow, setCheckFollow] = useState('follow');
  const navigate = useNavigate();



  const handleFollowToggle = async () => {
    

    if (checkFollow === 'follow') {
      try {
        // Make a POST request to follow the user
        await axios.get(
          `${url}/user/follow-user/${id}`,
{ withCredentials: true } // Correctly pass the withCredentials flag in config
        );
        setCheckFollow('unfollow'); // Update the state to 'unfollow' after a successful follow
      } catch (error) {
      
      }
    } else {
      try {
        // Make a POST request to unfollow the user
        await axios.get(
          `${url}/user/unfollow-user/${id}`,
   
          { withCredentials: true }
        );
        setCheckFollow('follow'); // Update the state to 'follow' after a successful unfollow
      } catch (error) {

      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("Please provide a valid user ID.");
        return;
      }

      const self = localStorage.getItem('ul')

      // If the user is trying to view their own profile, redirect to their profile page
      if (self === id) {
        return navigate('/profile');
      }

      try {
        // Fetching user data
        const userResponse = await axios.get(`${url}/user/get-user-id/${id}`,{withCredentials:true});
        setData(userResponse.data.data);
       

        // Check if the current user follows this user
        const followers	 = userResponse.data.data.followers;
       
        if (followers.includes(self)) {
          setCheckFollow('unfollow'); // Set to 'unfollow' if the user is already following
         
         
        } else {
          setCheckFollow('follow'); // Set to 'follow' if the user is not following
        }
      } catch (error) {
        setError("Error fetching user data.");
      } 
    };

  
    fetchData();
  }, [id,checkFollow]);

  useEffect(()=>{
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${url}/post/all-post-user/${id}`, { withCredentials: true });
        setPosts(response.data.posts); // Set posts data correctly
      } catch (error) {
        setError("Error fetching posts.");

      }
    };

    fetchPosts();
  },[id])



 
  function IconLabelButtons() {
    return (
      <Stack style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }} direction="row" spacing={2}>
        <Button variant="outlined" startIcon={<PersonAdd />} onClick={handleFollowToggle}>
          {checkFollow === 'follow' ? 'follow' : 'unfollow'}
        </Button>
        
       <Button onClick={()=>{
        navigate(`/chat/${data._id}/${data.userName}/${encodeURIComponent(data.userProfile||profile)}`)
       }} variant="outlined" startIcon={<Message/>} >
       message
       </Button>
      
      </Stack>
    );
  }

  
  function PostGrid() {
    return (
      <Grid container spacing={2} justifyContent="center" style={{ marginTop: '20px', flexWrap: 'wrap' ,flexGrow:1}}>
        {posts && posts.length > 0 ? (
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
          <Typography variant="h6" color="textSecondary">No posts available.</Typography>
        )}
      </Grid>
    );
  }


  return (
    <div style={{margin:0,padding:0,boxSizing:'border-box',height:'100%'}}>
      <Navbar />
      <div className=" mb-3"  >
        <div className="row g-0">
          <div className="col-md-4">
            <img
              src={data?.userProfile || profile} // Use default image if profile is not available
              style={{
                height: '200px',
                width: '200px',
                objectFit: 'cover',
                borderRadius: '50%',
                margin: '30px',
              }}
              className="img-fluid"
              alt="Profile"
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">{data?.userName}</h5>
            </div>
          </div>

          <div className="card-body" style={{ width: '100%', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
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

      {/* Image Gallery for posts */}
      <PostGrid />
    </div>
  );
};

export default User;
