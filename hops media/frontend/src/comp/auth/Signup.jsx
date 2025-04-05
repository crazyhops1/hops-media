import React, { useState } from 'react';
import './auth.css';
import signUpImage from '../../assets/sign-up.jpg';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';  // Import ToastContainer and toast
import { AnimatePresence, motion } from 'framer-motion'; // Import AnimatePresence and motion
import 'react-toastify/dist/ReactToastify.css';  // Make sure to include the Toastify CSS
import { Link, useNavigate } from 'react-router-dom';
import { url } from '../../App';

const Signup = () => {
  const [data, setData] = useState({
    userName: '',
    email: '',
    password: ''
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
const navigate=useNavigate()
  // Handle form submission
  const submit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Basic validation check
    if (!data.userName || !data.email || !data.password) {
      toast.error('Please fill in all fields.');  // Show error toast if fields are missing
      return;
    }

    try {
      const response = await axios.post(`${url}/auth/create-account`, data);
      if (response.status === 201) {
        toast.success('Account created successfully!');  // Show success toast

        setData({
          userName:'',
          email:'',
          password:''
        })
         return navigate('/login')

      }
    } catch (error) {
     
      toast.error(error.response.data.message);  // Show error toast if something goes wrong
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bgcolor" style={{ height: '100vh', width: '100%' }}>
      <AnimatePresence>
        <motion.div
          className="card mb-3 shadow-lg p-4 authCard"
          style={{ width: '90%' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 1 }}  
        >
          <div className="row g-0">
            {/* Image Section */}
            <div className="col-md-6 d-none d-md-block">
              <motion.img
                src={signUpImage}
                className="img-fluid loginImage"
                alt="Sign-up Illustration"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 1 }}  
              />
            </div>

            {/* Sign-up Form Section */}
            <div className="col-md-6">
              <motion.form
                className="card-body"
                onSubmit={submit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}  
              >
                <h4 className="text-center mb-4">Sign Up</h4>

                {/* User Name Input */}
                <motion.div
                  className="mb-3"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 1 }} 
                >
                  <label htmlFor="userName" className="form-label">User Name</label>
                  <input
                    name="userName"
                    value={data.userName}
                    onChange={handleChange}
                    className="form-control loginInput"
                    id="userName"
                    type="text"
                    placeholder="Enter your user name"
                  />
                </motion.div>

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
                  <button type="submit" className="btn btn-primary btn-lg">Sign Up</button>
                </motion.div>

                <motion.div
                  className="text-center mt-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}  
                >
                  <Link to="/login" className="text-muted"> have an account?</Link>
                </motion.div>
              </motion.form>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ToastContainer to display notifications */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick />
    </div>
  );
};

export default Signup;
