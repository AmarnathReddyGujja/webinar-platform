import React, { useContext } from 'react';
import SearchBar from '../Components/SearchBar';
import { WebinarContext } from '../Components/WebinarContext'; // Ensure WebinarContext is accessible
import { Link } from 'react-router-dom';
import './HomePage.css'; // Add a custom CSS file for additional styling

function HomePage() {
  const { webinars } = useContext(WebinarContext);
  const recentWebinars = webinars.slice(0, 3); // Get the most recent 3 webinars

  return (
    <>
      <div className="homepage-container">
        <SearchBar />
  
      </div>
      
    </>
  );
}

export default HomePage;
