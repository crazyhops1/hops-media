import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Navbar from '../navbar/Navbar';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { url } from '../../App';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  ...(props => ({
    transform: props.expand ? 'rotate(180deg)' : 'rotate(0deg)',
  })),
}));

export default function RecipeReviewCard() {
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState({});
  const [expanded, setExpanded] = useState({});


  

  const handleExpandClick = (postId) => {
    setExpanded(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleLikeClick = async (postId) => {
    const newLikeStatus = !likes[postId];
    setLikes((prevLikes) => ({
      ...prevLikes,
      [postId]: newLikeStatus,
    }));

    try {
      if (newLikeStatus) {
      await axios.get(`${url}/post/like-post/${postId}`,{withCredentials: true});

      } else {
        await axios.delete(`${url}}/post/unlike-post/${postId}`,{withCredentials: true});
      }
    } catch (error) {
      console.error('Error updating the like status:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {

      const self=localStorage.getItem('ul')
     

      try {
        const response = await axios.get(`${url}/post/timeline`,{
          withCredentials: true
        });
        setPosts(response.data.reverse());
        const initialLikes = {};

        response.data.forEach((post) => {
          initialLikes[post._id] = post.like?.includes(self);// it return ture or false
    
        });
        setLikes(initialLikes);
  
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchData();
  }, []); // Ensure this only runs when the user data is available

 const navigate= useNavigate()
  return (
    <div  >
      <Navbar />
      <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post._id} style={{ width: '90%', marginTop: '12px', borderRadius: '15px' }}>
            <Link style={{textDecoration:'none'}} to={`/user/${post.userId._id}`} >
            <CardHeader
                avatar={
                  <Avatar  sx={{ bgcolor: red[500] }} aria-label="recipe">
                    {post.userId.userName?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                }
                action={<IconButton aria-label="settings"><MoreVertIcon /></IconButton>}
                title={post.userId.userName || 'User'}
                subheader={post.createdAt || 'Date not available'}
              />
            </Link>
              <CardMedia
                component="img"
                style={{
                  maxWidth: '700px',
                  maxHeight:'450px',

                  width: '100%',
                  objectFit: 'contain',
                  borderRadius: '15px',
                  margin: '0 auto',
                }}
                image={post.postImage || '/static/images/cards/paella.jpg'}
                alt="Post image"
              />
              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary', paddingTop: '8px' }}>
                  {post.description || 'No description available'}
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton aria-label="add to favorites" onClick={() => handleLikeClick(post._id)}>
                  <FavoriteIcon color={likes[post._id] ? 'error' : 'default'} />
                </IconButton>
                <Typography variant="body2" sx={{ marginLeft: '5px', color: 'text.secondary' }}>
                  {post.like?.length || ''} 
                </Typography>
                <ExpandMore
                
                  onClick={() => handleExpandClick(post._id)}
                 
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
             
              </CardActions>
              <Collapse in={expanded[post._id]} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography sx={{ marginBottom: 2 }}>Comments:</Typography>
                  <Typography sx={{ marginBottom: 2 }}>
                    {post.comments?.map((comment, index) => (
                      <Typography key={index} variant="body2" sx={{ color: 'text.secondary' }}>
                        <strong>{comment.userName}</strong>: {comment.text}
                      </Typography>
                    )) || 'No comments yet'}
                  </Typography>
                </CardContent>
              </Collapse>
            </Card>
          ))
        ) : (
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            No posts available.
          </Typography>
        )}
      </div>
    </div>
  );
}
