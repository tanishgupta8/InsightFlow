import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import '../index.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="navbar"
    >
      <div className="navbar-brand">
        <Link to="/" className="logo">InsightFlow</Link>
      </div>
      <div className="navbar-links">
        {user ? (
          <>
            <motion.div whileHover={{ scale: 1.05 }}><Link to="/dashboard" className="nav-link">Dashboard</Link></motion.div>
            <motion.div whileHover={{ scale: 1.05 }}><Link to="/upload" className="nav-link">Upload</Link></motion.div>
            <motion.div whileHover={{ scale: 1.05 }}><Link to="/history" className="nav-link">History</Link></motion.div>
            <div className="user-menu">
              <span className="user-name">{user.name || user.email}</span>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout} className="btn-secondary">Logout</motion.button>
            </div>
          </>
        ) : (
          <>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Link to="/login" className="btn-secondary">Login</Link></motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Link to="/signup" className="btn-primary">Get Started</Link></motion.div>
          </>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
