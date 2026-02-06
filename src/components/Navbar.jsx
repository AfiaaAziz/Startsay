import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ isContactOpen, setIsContactOpen, isMenuOpen, setIsMenuOpen }) => {
  const closeMenu = () => {
    if (setIsMenuOpen) setIsMenuOpen(false);
  };

  const toggleMenu = (e) => {
    e.preventDefault();
    if (setIsMenuOpen) setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="navbar">
      <div className="navbar-main-wrp">
        <div className="navbar-logo-wrp">
          <Link
            to="/"
            className="logo link w-inline-block"
            onClick={closeMenu}
            style={{
              backgroundImage: 'url("/assets/logo.png")',
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          ></Link>
        </div>
        <div className="navbar-dt-wrp">
          <div className="navbar-link-wrp">
            <Link to="/project-index" className="link navbar-link">
              Index
            </Link>
            <Link to="/team" className="link navbar-link">
              Team
            </Link>
            <a
              href="#"
              className="link navbar-link"
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
        <div 
          className={`menu-icon ${isMenuOpen ? "menu-open" : ""}`}
          onClick={toggleMenu}
        >
          <div className="menu-icon-line"></div>
          <div className="menu-icon-line mi-2"></div>
        </div>
      </div>
      <div className={`navbar-mob-wrp ${isMenuOpen ? "open" : ""}`}>
        <div className="navbar-link-wrp">
          <Link 
            to="/project-index" 
            className="link navbar-link"
            onClick={closeMenu}
          >
            Index
          </Link>
          <Link 
            to="/team" 
            className="link navbar-link"
            onClick={closeMenu}
          >
            Team
          </Link>
          <a
            href="#"
            className="link navbar-link"
            onClick={(e) => {
              e.preventDefault();
              closeMenu();
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

export default Navbar;
