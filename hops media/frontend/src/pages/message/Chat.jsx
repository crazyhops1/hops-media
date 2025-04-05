import React, { useEffect, useState, useRef } from 'react';
import userDefault from '../../assets/default-image.jpg';
import { ArrowBack, Call, Send, VideoCall } from '@mui/icons-material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSocketConnection } from '../../redux/features/OnlineUser';
import { useSelector } from 'react-redux';
import { url } from '../../App';

const Chat = () => {
  const { id, profile, name } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const chatContainerRef = useRef(null);

  // Get the socket data from Redux (new incoming messages)
  const socketData = useSelector((state) => state.socket.message);

  // Initialize socket connection
  useSocketConnection();

  // Fetch chat history from server when component mounts or ID changes
  useEffect(() => {
    const fetchMessageHistory = async () => {
      try {
        const response = await axios.get(`${url}/message/get-message/${id}`, { withCredentials: true });
        setMessages(response.data.message);
      } catch (error) {

      }
    };

    fetchMessageHistory();
  }, [id]);
  useEffect(() => {
    if (socketData && Array.isArray(socketData)) {
      // Process each new message
      socketData.forEach((newMessage) => {
        // Avoid duplicate messages by checking if the message already exists
        setMessages((prevMessages) => {
          if (!prevMessages.some((msg) => msg._id === newMessage._id)) {
            return [...prevMessages, newMessage]; // Add the new message if it doesn't exist
          }
          return prevMessages; // Return previous messages if it's a duplicate
        });
      });
    }
  }, [socketData]); 

  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (messageInput.trim() === '') return; // Avoid sending empty messages

    try {
      const response = await axios.post(
        `${url}/message/send-message/${id}`,
        { message: messageInput },
        { withCredentials: true }
      );

      // Immediately update the UI with the sent message
      setMessages((prevMessages) => [...prevMessages, response.data.newMessage]);
      setMessageInput(''); // Clear the input field
    } catch (error) {

    }
  };

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <div className="chat-top-user-name">
        <ul className="contact-list">
          <li className="contact-user" style={{ display: 'flex' }}>
            <Link onClick={() => navigate(-1)} className="chat-back-arrow">
              <ArrowBack />
            </Link>
            <Link to={`/user/${id}`} className="contact-list-user-profile-img">
              <img  src={profile || userDefault} alt="Profile" />
               
            </Link>
            <span className="contact-list-user-profile-username">
              <h4 className="username">{name}</h4>
            </span>
            <span className="chat-icon">
              <span className="icon" style={{ margin: '15px' }}>
                <VideoCall />
              </span>
              <span className="icon">
                <Call />
              </span>
            </span>
          </li>
        </ul>
      </div>

      {/* Chat History */}
      <div className="chat-history" ref={chatContainerRef}>
        {/* Iterate over the messages */}
        {messages.map((message) => (
          <div key={message._id} className={message.sender === id ? 'friend-chat' : 'my-chat'}>
            <p>{message.message}</p>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="chat-send-bar">
        <div className="contact-search-bar chat-send">
          <input
            className="searchbar"
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
          />
          <Send
            style={{ marginLeft: '12px', cursor: 'pointer' }}
            onClick={handleSendMessage}
            disabled={messageInput.trim() === ''} // Disable send button when input is empty
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
