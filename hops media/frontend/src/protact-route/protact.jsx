import { Navigate, Outlet } from 'react-router-dom';

const Protect = () => {
  
  const user = localStorage.getItem('ul');    // The logged-in user data

  // Check if either the token or user is missing from localStorage
  if ( !user) {
    return <Navigate to="/login" />;  // Redirect to login if not authenticated
  }

  return <Outlet />;  // Render the nested routes if authenticated
};

export default Protect;
