// Webinars.js
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { WebinarContext } from '../Components/WebinarContext';
import { useLocation } from 'react-router-dom';
import './Webinars.css';

function Webinars() {
  const { webinars, loading, fetchAllWebinars } = useContext(WebinarContext);
  const location = useLocation();
  const [filteredWebinars, setFilteredWebinars] = React.useState([]);

  // Extract search query from the URL
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search') || '';

  // Filter and sort webinars based on the search query
  React.useEffect(() => {
    let sorted = [...webinars];
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      sorted = sorted.filter(webinar => 
        webinar.title.toLowerCase().includes(lowercaseQuery) ||
        webinar.description.toLowerCase().includes(lowercaseQuery)
      );
    }
    sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    setFilteredWebinars(sorted);
  }, [searchQuery, webinars]);

  // Refresh webinars when component mounts
  React.useEffect(() => {
    fetchAllWebinars();
  }, [fetchAllWebinars]);

  if (loading) {
    return <p>Loading webinars...</p>;
  }

  // Animation variants for initial load
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="webinars-container">
      <h2>Upcoming Webinars</h2>
      {searchQuery && (
        <p>Showing results for: "{searchQuery}"</p>
      )}
      <motion.div
        className="webinars-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredWebinars.length > 0 ? (
          filteredWebinars.map((webinar) => (
            <motion.div
              key={webinar._id}
              className="webinar-card"
              variants={cardVariants}
              whileHover={{ scale: 1.05, boxShadow: '0px 10px 20px rgba(0,0,0,0.2)' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="webinar-image-container">
                {webinar.pictureUrl ? (
                  <img src={webinar.pictureUrl} alt={webinar.title} className="webinar-image" />
                ) : (
                  <div className="webinar-placeholder">No Image Available</div>
                )}
              </div>
              <div className="webinar-content">
                <h3>{webinar.title}</h3>
                <p className="webinar-date">
                  <strong>Date:</strong> {new Date(webinar.date).toLocaleDateString()}
                </p>
                <p className="webinar-time">
                  <strong>Time:</strong> {webinar.time}
                </p>
                <p className="webinar-description">{webinar.description}</p>
                <p className="webinar-organizer">
                  <strong>Organized By:</strong> {webinar.organizedBy}
                </p>
                <a 
                  href={webinar.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="registration-link"
                >
                  Register Now
                </a>
              </div>
            </motion.div>
          ))
        ) : (
          <p>No webinars found{searchQuery ? ` for "${searchQuery}"` : ''}.</p>
        )}
      </motion.div>
    </div>
  );
}

export default Webinars;
