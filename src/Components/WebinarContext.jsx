// WebinarContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
export const WebinarContext = createContext();

// Create a provider component
export const WebinarProvider = ({ children }) => {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all webinars regardless of auth status
  const fetchAllWebinars = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/webinars');
      setWebinars(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching webinars:', error);
      setLoading(false);
    }
  };

  const addWebinar = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Sending webinar data:', formData);
      
      const response = await axios.post('http://localhost:5000/api/webinars', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Webinar added successfully:', response.data);
      // Update the webinars list with the new webinar
      setWebinars(prevWebinars => [...prevWebinars, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error adding webinar:', error.response?.data || error.message);
      throw error;
    }
  };

  const deleteWebinar = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/webinars/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state after successful deletion
      setWebinars(prevWebinars => prevWebinars.filter(webinar => webinar._id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting webinar:', error);
      throw error;
    }
  };

  // Fetch user's webinars for dashboard
  const fetchUserWebinars = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/user/webinars', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // Return the data instead of setting it to state
    } catch (error) {
      console.error('Error fetching user webinars:', error);
      return [];
    }
  };

  // Fetch all webinars on mount and whenever a webinar is added or deleted
  useEffect(() => {
    fetchAllWebinars();
  }, []);

  return (
    <WebinarContext.Provider value={{ 
      webinars, 
      loading, 
      addWebinar, 
      deleteWebinar, 
      fetchUserWebinars,
      fetchAllWebinars 
    }}>
      {children}
    </WebinarContext.Provider>
  );
};
