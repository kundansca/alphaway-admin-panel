import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span>© {new Date().getFullYear()} Alphaway - Admin Panel</span>
        <div className="footer-links">
          <a href="https://alpha-way.com/privacy-policy" target="_blank">Privacy Policy</a>
          <a href="https://alpha-way.com/terms-condition" target="_blank">Terms of Service</a>
          <a href="https://alpha-way.com/contact-us" target="_blank">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
