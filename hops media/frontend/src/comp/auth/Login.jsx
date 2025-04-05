import React, { useState, useEffect } from 'react';
import loginImage from '../../assets/login-image.jpg';
import './auth.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { AnimatePresence, motion } from 'framer-motion';
import { url } from '../../App';


const Login = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);


  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const submit = async (e) => {
    e.preventDefault();

    // Basic validation check
    if (!data.email || !data.password) {
      toast('Please fill in all fields!');
      return;
    }

    try {
      setLoading(true);  // Start loading

      // Make the POST request with withCredentials: true to send cookies
      const response = await axios.post(`${url}/auth/login`, data, { 
        withCredentials: true
      });

      if (response.status === 200) {
        // Store user information in localStorage
        localStorage.setItem('ul', response.data.data.id); // Store user ID or token

       

        // Redirect user to the homepage
        navigate('/');
      }
    } catch (error) {
      setLoading(false);
      if (error.response) {
        toast(error.response.data.message); // Show error message from server
      } else {
        toast('An error occurred. Please try again.');
      }
    }
  };



  return (
    <div className="d-flex justify-content-center align-items-center bgcolor" style={{ height: '100vh' }}>
      <ToastContainer />
      <div className="card mb-3 shadow-lg p-4 authCard" style={{ width: '90%', color: 'white' }}>
        <div className="row g-0">
          {/* Image Section */}
          <div className="col-md-6 d-none d-md-block">
            <motion.img
              src={loginImage}
              className="img-fluid loginImage"
              alt="Login Illustration"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 1 }}
            />
          </div>

          {/* Login Form Section */}
          <div className="col-md-6" style={{ color: 'white' }}>
            <AnimatePresence>
              <motion.form
                className="card-body"
                onSubmit={submit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                <h4 className="text-center mb-4">Login</h4>

                {/* Email Input */}
                <motion.div
                  className="mb-3"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 1 }}
                >
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    className="form-control loginInput"
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                  />
                </motion.div>

                {/* Password Input */}
                <motion.div
                  className="mb-3"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 1 }}
                >
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    className="form-control loginInput"
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  className="d-grid gap-2"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 1 }}
                >
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}  // Disable button while loading
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      'Login'
                    )}
                  </button>
                </motion.div>

                {/* Link to Signup */}
                <motion.div
                  className="text-center mt-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                >
                  <Link to="/signup" className="text-muted">Don't have an account?</Link>
                </motion.div>
              </motion.form>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
