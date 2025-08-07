import React from 'react';
import './common.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} DiceClone. All rights reserved.</p>
    </footer>
  );
};

export default Footer;