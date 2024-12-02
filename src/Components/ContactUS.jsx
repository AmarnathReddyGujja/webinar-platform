// ContactForm.js
import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope } from 'react-icons/fa';
import './ContactForm.css';

function ContactUS() {
  return (
    <motion.div
      className="contact-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="contact-content">
        <motion.div
          className="quote-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2>Let's Connect</h2>
          <blockquote>
            "Education is not the filling of a pail, but the lighting of a fire."
            <footer>- William Butler Yeats</footer>
          </blockquote>
        </motion.div>

        <motion.div
          className="contact-info"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3>Contact Me</h3>
          <div className="email-container">
            <FaEnvelope className="email-icon" />
            <a href="mailto:your.email@example.com">thelandofwebinars@gmail.com</a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ContactUS;
