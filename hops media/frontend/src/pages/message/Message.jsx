import React, { useEffect, useState } from 'react';
import userDefault from '../../assets/default-image.jpg';
import './message.css';
import Navbar from '../../comp/navbar/Navbar';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { url } from '../../App';



const Message = ({onlineUsers}) => {
  const [userChatHistory, setUserChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get the logged-in user's id from localStorage
  const loggedInUserId = localStorage.getItem('ul'); // Assuming 'ul' is the user ID stored in localStorage

  // Get connected users from Redux (to track online users)


  useEffect(() => {
    const fetchUserHistory = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${url}/message/get-user-history`, { withCredentials: true });
        setUserChatHistory(response.data.data); // Set the chat history
      } catch (error) {
        setError('Failed to fetch chat history. Please try again later.');
        
      } finally {
        setLoading(false);
      }
    };

    fetchUserHistory();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while data is being fetched
  }

  if (error) {
    return <div>{error}</div>; // Show error message if there's an error
  }

  // Check if there are online users
  const onlineFriend = onlineUsers.flatMap((user) => user.onlineUsers);
  

  
  return (
    <div style={{marginTop:0,padding:0,boxSizing:'border-box',height:'100vh'}}>
      <Navbar />

      <div className="message-container " style={{ display: 'flex', alignItems: 'center',  flexDirection: 'column', }}>

        {/* Contacts Sidebar */}
        <div className="contact-container k  ">
         
          <ul className="contact-list list-unstyled"  >
            {/* Check if there are users, and map through them */}
            {userChatHistory.length > 0 ? (
              userChatHistory.map((conversation) => (
                conversation.participants
                  .filter((user) => user._id !== loggedInUserId) // Exclude the logged-in user
                  .map((user) => (
                    <Link
                      to={`/chat/${user._id}/${user.userName}/${encodeURIComponent(user.userProfile || userDefault)}`}
                      key={user._id}
                      className="contact-user d-flex align-items-center mb-3"
                    >
                      <span className="contact-list-user-profile-img">
                        <img
                          src={user.userProfile || userDefault}
                          alt={user.userName || 'Unknown'}
                          className="rounded-circle"
                          width="40"
                          height="40"
                        />
                        {/* Check if the user is online */}
                        {onlineFriend.some((onlineUser) => onlineUser.userid === user._id) && (
                          <span className="activeuser"></span>
                        )}
                      </span>
                      <span className="contact-list-user-profile-username ms-3">
                        <h5 className="username mb-0">{user.userName || 'Unknown'}</h5>
                      </span>
                    </Link>
                  ))
              ))
            ) : (
              <li>No users found</li> // Fallback if no users are found
            )}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Message;
