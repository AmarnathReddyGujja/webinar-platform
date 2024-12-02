import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { WebinarContext } from './WebinarContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { fetchUserWebinars, deleteWebinar } = useContext(WebinarContext);
  const navigate = useNavigate();
  const [userWebinars, setUserWebinars] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadUserWebinars = async () => {
      if (user) {
        const webinars = await fetchUserWebinars();
        setUserWebinars(webinars);
      }
    };
    loadUserWebinars();
  }, [user, fetchUserWebinars]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleAddWebinar = () => {
    navigate('/AddWebinar');
  };

  const handleDelete = async (webinarId) => {
    try {
      setDeletingId(webinarId);
      await deleteWebinar(webinarId);
      setMessage('Webinar deleted successfully!');
      setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
    } catch (error) {
      console.error('Error deleting webinar:', error);
      setMessage('Error deleting webinar. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <motion.div 
      className="dashboard-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="dashboard-content">
        <h2>Welcome, {user.name}!</h2>
        
        {message && (
          <motion.div 
            className={`message ${message.includes('successfully') ? 'success' : 'error'}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {message}
          </motion.div>
        )}

        <div className="user-info">
          <p><strong>Email:</strong> {user.email}</p>
        </div>
        
        <motion.button 
          className="add-webinar-button"
          onClick={handleAddWebinar}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add a Webinar
        </motion.button>

        <div className="user-webinars">
          <h3>Your Webinars</h3>
          <AnimatePresence>
            {userWebinars.length > 0 ? (
              userWebinars.map((webinar) => (
                <motion.div 
                  key={webinar._id} 
                  className="webinar-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  layout
                >
                  <div className="webinar-image">
                    {webinar.pictureUrl ? (
                      <img src={webinar.pictureUrl} alt={webinar.title} />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </div>
                  <div className="webinar-details">
                    <h4>{webinar.title}</h4>
                    <p>Date: {new Date(webinar.date).toLocaleDateString()}</p>
                    <p>Time: {webinar.time}</p>
                    <p>Organized by: {webinar.organizedBy}</p>
                    <a 
                      href={webinar.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="registration-link"
                    >
                      Registration Link
                    </a>
                    <motion.button
                      className="delete-button"
                      onClick={() => handleDelete(webinar._id)}
                      disabled={deletingId === webinar._id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {deletingId === webinar._id ? 'Deleting...' : 'Delete Webinar'}
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              <p>You haven't added any webinars yet.</p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
