import React from "react";

import "./Footer.component.css";

const Footer = () => {
  const d = new Date();
  return (
    <footer className="footer">
      <div className="info-container">
        <p>Leonardo Angelit - {d.getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;
