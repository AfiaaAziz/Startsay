import React from 'react';

const Footer = ({ isContactOpen, setIsContactOpen }) => {
  return (
    <div data-w-id="d636055f-4a21-6155-01a4-3396fc0d09e3" className="footer">
      <div className="container footer-grid">
        <div className="footer-column branding-col">
          <div className="t-small">© Startsay</div>
        </div>
        <div className="footer-column social-col">
          <a
            href="https://www.instagram.com/startsay.official/"
            target="_blank"
            className="link footer-link right-up-arrow"
          >
            Instagram
          </a>
          <a
            href="https://www.linkedin.com/company/startsayofficial"
            target="_blank"
            className="link footer-link right-up-arrow"
          >
            LinkedIn
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61572256355814"
            target="_blank"
            className="link footer-link right-up-arrow"
          >
            Facebook
          </a>
          <a
            href="https://www.behance.net/thisissyedbadshah"
            target="_blank"
            className="link footer-link right-up-arrow"
          >
            Behance
          </a>
        </div>

        <div className="footer-column nav-col">
          <a href="#/project-index" className="link footer-link right-arrow">
            Index
          </a>
          
          <a href="#/team" className="link footer-link right-arrow">
            Team
          </a>
          <a
            href="#"
            className="link footer-link"
            onClick={(e) => {
              e.preventDefault();
              if (setIsContactOpen) {
                setIsContactOpen(!isContactOpen);
              }
            }}
          >
            Contact
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
