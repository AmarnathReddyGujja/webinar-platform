import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './SearchBar.css';

function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Redirect to the Webinars page with the search query as a URL parameter
    navigate(`/Webinars?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="hero">
      <div className="heading">
        <h1>The&nbsp; Land&nbsp; of&nbsp; Webinars</h1>
        <h2>Discover, Host, and Connect: Building a Community for Developers, Learners, and Organizers</h2>
      </div>
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="e.g: Artificial Intelligence"
            value={query}
            onChange={handleInputChange}
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </div>
    </div>
  );
}

export default SearchBar;
