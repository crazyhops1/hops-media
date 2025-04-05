import React, { useEffect, useState } from 'react';
import Navbar from '../../comp/navbar/Navbar';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './Search.css'; // Make sure to import the CSS with the loader
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Link, useNavigate } from 'react-router-dom';
import { url } from '../../App';


const Search = () => {
  const value = useSelector((state) => state.search.value);
  const [data, setData] = useState(null); // Initialize as null since we're expecting a single object
  const [loading, setLoading] = useState(false); // To handle loading state
  const [error, setError] = useState(null); // To handle errors
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!value) return; // If no search value, don't fetch

      setLoading(true);  // Set loading to true while data is being fetched
      setError(null);  // Reset error state
      try {
        const response = await axios.post(`${url}/user/get-user-username`, { userName: value }, {
          withCredentials: true
        });
        
        if (response.status === 200 && response.data.data) {
          setData(response.data.data); // Set the response data
        } else {
          setData(null); // No data found, set to null
        }
      } catch (err) {
        setError('Something went wrong. Please try again later.');

      } finally {
        setLoading(false); // Stop loading once the request is complete
      }
    };

    // Delay the request for demonstration purposes
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 1500);

    return () => clearTimeout(timeoutId); // Cleanup the timeout on component unmount
  }, [value]); // Fetch data only when `value` changes

  return (
    <div>
      <Navbar />
      <div   style={{ marginTop:"5.5%", paddingTop:'12px' }}>
        {/* Show loading spinner if fetching */}
        {loading && (
          <div className="d-flex justify-content-center align-items-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* Show search result if data exists */}
        {data ? (
          <List sx={{ width: '100%', alignItems: "center", justifyContent: 'center', display: 'flex', flexDirection: "column", bgcolor: 'background.paper' }}>
            <Link
              to={`/user/${data._id}`}
              key={data._id} // Use _id as the unique key for the item
              style={{
                boxShadow: 'rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset',
                maxWidth: '600px', width: '100%', borderRadius: "5px", border: "0.5px solid skyBlue", marginTop: "12px"
              }}
              aria-label={`View profile of ${data.userName}`}
            >
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt={data.userName} src={data.userProfile || '/static/images/avatar/1.jpg'} />
                </ListItemAvatar>
                <ListItemText primary={data.userName} />
              </ListItem>
              <Divider component="li" />
            </Link>
          </List>
        ) : (
          // Display message if no result found
          value !== '' && <Typography variant="h6" color="textSecondary">No results found for "{value}"</Typography>
        )}

        {/* If the value is empty, show a prompt */}
        {value === '' && <Typography variant="h6">Please enter a username to search</Typography>}

        {/* Show error message if there was an error */}
        {error && <Typography variant="h6" color="error">{error}</Typography>}
      </div>
    </div>
  );
};

export default Search;
