import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { WebinarContext } from './WebinarContext';
import { AuthContext } from './AuthContext';
import { Navigate } from 'react-router-dom';
import './AddWebinar.css';

function AddWebinar() {
  const { addWebinar } = useContext(WebinarContext);
  const { user } = useContext(AuthContext);
  const [webinarData, setWebinarData] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    organizedBy: '',
    registrationLink: '',
    picture: null,
  });
  const [message, setMessage] = useState('');

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWebinarData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setWebinarData((prevData) => ({
      ...prevData,
      picture: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        const formData = new FormData();
        formData.append('title', webinarData.title);
        formData.append('date', webinarData.date);
        formData.append('time', webinarData.time);
        formData.append('description', webinarData.description);
        formData.append('organizedBy', webinarData.organizedBy);
        formData.append('registrationLink', webinarData.registrationLink);
        
        if (webinarData.picture) {
            formData.append('picture', webinarData.picture);
        }

        await addWebinar(formData);
        setMessage('Webinar added successfully!');
        
        // Reset form
        setWebinarData({
            title: '',
            date: '',
            time: '',
            description: '',
            organizedBy: '',
            registrationLink: '',
            picture: null,
        });
        
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.value = '';
        }
    } catch (error) {
        console.error('Error:', error);
        setMessage('Error adding webinar. Please try again.');
    }
  };

  return (
    <div className="add-webinar-container">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Add a Webinar
      </motion.h2>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="webinar-form"
      >
        <motion.div className="form-group" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
          <label>Webinar Title:</label>
          <input
            type="text"
            name="title"
            value={webinarData.title}
            onChange={handleChange}
            required
            placeholder="Enter webinar title"
          />
        </motion.div>

        <motion.div className="form-group" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={webinarData.date}
            onChange={handleChange}
            required
          />
        </motion.div>

        <motion.div className="form-group" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
          <label>Time:</label>
          <input
            type="time"
            name="time"
            value={webinarData.time}
            onChange={handleChange}
            required
          />
        </motion.div>

        <motion.div className="form-group" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
          <label>Description:</label>
          <textarea
            name="description"
            value={webinarData.description}
            onChange={handleChange}
            required
            placeholder="Enter webinar description"
          />
        </motion.div>

        <motion.div className="form-group" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
          <label>Organized By:</label>
          <input
            type="text"
            name="organizedBy"
            value={webinarData.organizedBy}
            onChange={handleChange}
            required
            placeholder="Enter organizer's name"
          />
        </motion.div>

        <motion.div className="form-group" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
          <label>Registration Link:</label>
          <input
            type="url"
            name="registrationLink"
            value={webinarData.registrationLink}
            onChange={handleChange}
            required
            placeholder="Enter registration link"
          />
        </motion.div>

        <motion.div className="form-group" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
          <label>Webinar Picture:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </motion.div>

        <div className="submit-section">
          {message && (
            <motion.p 
              className={`message ${message.includes('successfully') ? 'success' : ''}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {message}
            </motion.p>
          )}
          <motion.button
            type="submit"
            className="submit-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Add Webinar
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}

export default AddWebinar;
