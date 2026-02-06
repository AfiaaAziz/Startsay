import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./TeamPage.css";
import Footer from "./components/Footer.jsx";

// Register ScrollTrigger plugin

function TeamPage({ isContactOpen, setIsContactOpen }) {
  useEffect(() => {
    // Initialize all animations and carousel after component mounts
    const initializeAnimations = () => {
      // Logo carousel animation
      const carousels = document.querySelectorAll(".collection-list-logo-anim");
      carousels.forEach((carousel) => {
        const slides = Array.from(carousel.children);
        let idx = -1;
        slides.forEach((slide) => (slide.style.display = "none"));
        function rotate() {
          if (idx >= 0) {
            slides[idx].style.display = "none";
          }
          idx = (idx + 1) % slides.length;
          slides[idx].style.display = "block";
          setTimeout(rotate, 83.333333);
        }
        rotate();
      });
    };

    // Wait a bit for DOM to settle
    const timer = setTimeout(initializeAnimations, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {}, []);

  const teamMembers = [
    {
      name: "Robin",
      title: "Founder & CEO",
      img: "68ee35284412b64fabb6a434_SF_Portraits_Robin_Final_Blur.avif",
    },
    {
      name: "Tim",
      title: "3D Designer",
      img: "68ee35013dd7d3f72fcabcd1_SF_Portraits_Tim_Final_Blur.avif",
    },
    {
      name: "Leon",
      title: "Art Director",
      img: "68ee354d777ee4ff4b6c96ab_SF_Portraits_Leon_Final_Blur.avif",
    },
    {
      name: "Susanne",
      title: "Digital Artist",
      img: "68f0ffe81feb96d1aab1818c_SF_Portraits_Susanne_Final_Blur_v2.avif",
    },
    {
      name: "Lorenzo",
      title: "Producer",
      img: "68ee35368c68ed7d1a4c30aa_SF_Portraits_Lorenzo_Final_Blur.avif",
    },
    {
      name: "Denys",
      title: "3D Designer",
      img: "68ee353d562ff2e2a5f4adf8_SF_Portraits_Denys_Final_Blur.avif",
    },
    {
      name: "Shirley",
      title: "Producer",
      img: "68ee352248913abd5ae9598d_SF_Portraits_Shirley_Final_Blur.avif",
    },
    {
      name: "Colin",
      title: "Director & Editor",
      img: "68ee35566f7ab6229138a2b4_SF_Portraits_Colin_Final_Blur.avif",
    },
    {
      name: "Lukas",
      title: "3D Designer",
      img: "68ee352e562ff2e2a5f4aa40_SF_Portraits_Lukas_Final_Blur.avif",
    },
    {
      name: "Andre",
      title: "3D Designer / TD",
      img: "68ee355e74d0eff38a24440a_SF_Portraits_Andre_Final_Blur.avif",
    },
    {
      name: "Victor",
      title: "3D Designer",
      img: "68ee354313087b95211028b8_SF_Portraits_Victor_Final_Blur.avif",
    },
    {
      name: "Janic",
      title: "3D Designer",
      img: "68ee350e62d9c1fccfde9981_SF_Portraits_Jannic_Final_Blur.avif",
    },
  ];

  return (
    <>
      {/* Team Section */}
      <div className="section team-title-wrp">
        <h2 className="team-heading">Team</h2>
      </div>
      <div className="section studio-team">
        <div className="cms-list-wrp-team w-dyn-list">
          <div role="list" className="cms-list-team w-dyn-items">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                item={member.name.toLowerCase()}
                role="listitem"
                className="cms-item-team w-dyn-item"
              >
                <div className="team-name">{member.name}</div>
                <div className="team-title">{member.title}</div>
                <div
                  style={{
                    backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/${member.img}")`,
                  }}
                  className="team-photo"
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clients/Partners Section */}
      <div className="section clients-section">
        <div className="clients-container">
          <div className="clients-header">
            <div className="clients-subtitle">OUR PARTNERS</div>
            <h2 className="clients-heading">We work with the best partners</h2>
          </div>
          <div className="clients-grid">
            <div className="client-card">
              <img
                src="assets/clientlogos/logo1.png"
                alt="Client1"
                className="client-logo"
              />
            </div>
            <div className="client-card">
              <img
                src="assets/clientlogos/logo2.png"
                alt="Client2"
                className="client-logo"
              />
            </div>
            <div className="client-card">
              <img
                src="assets/clientlogos/logo3.png"
                alt="Client3"
                className="client-logo"
              />
            </div>
            <div className="client-card">
              <img
                src="assets/clientlogos/logo4.png"
                alt="Client4"
                className="client-logo"
              />
            </div>
            <div className="client-card">
              <img
                src="assets/clientlogos/logo5.png"
                alt="Client5"
                className="client-logo"
              />
            </div>
            <div className="client-card">
              <img
                src="assets/clientlogos/logo6.png"
                alt="Client6"
                className="client-logo"
              />
            </div>
            <div className="client-card">
              <img
                src="assets/clientlogos/logo7.png"
                alt="Client7"
                className="client-logo"
              />
            </div>
            <div className="client-card">
              <img
                src="assets/clientlogos/logo8.png"
                alt="Client8"
                className="client-logo"
              />
            </div>
            <div className="client-card">
              <img
                src="assets/clientlogos/logo9.png"
                alt="Client9"
                className="client-logo"
              />
            </div>
            <div className="client-card">
              <img
                src="assets/clientlogos/logo10.png"
                alt="Client10"
                className="client-logo"
              />
            </div>
            <div className="client-card">
              <img
                src="assets/clientlogos/logo11.png"
                alt="Client11"
                className="client-logo"
              />
            </div>
            <div className="client-card">
              <img
                src="assets/clientlogos/logo12.png"
                alt="Client12"
                className="client-logo"
              />
            </div>
            <div className="client-card">
              <img
                src="assets/clientlogos/logo13.png"
                alt="Client13"
                className="client-logo"
              />
            </div>
            <div className="client-card">
              <img
                src="assets/clientlogos/logo14.png"
                alt="Client14"
                className="client-logo"
              />
            </div>
            <div className="client-card">
              <img
                src="assets/clientlogos/logo15.png"
                alt="Client15"
                className="client-logo"
              />
            </div>
            <div className="client-card">
              <img
                src="assets/clientlogos/logo16.png"
                alt="Client16"
                className="client-logo"
              />
            </div>
            <div className="client-card">
              <img
                src="assets/clientlogos/logo17.png"
                alt="Client17"
                className="client-logo"
              />
            </div>
            <div className="client-card">
              <img
                src="assets/clientlogos/logo18.png"
                alt="Client18"
                className="client-logo"
              />
            </div>
            <div className="client-card">
              <img
                src="assets/clientlogos/logo19.png"
                alt="Client19"
                className="client-logo"
              />
            </div>
            <div className="client-card">
              <img
                src="assets/clientlogos/logo20.png"
                alt="Client20"
                className="client-logo"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}

      <Footer
        isContactOpen={isContactOpen}
        setIsContactOpen={setIsContactOpen}
      />
    </>
  );
}

export default TeamPage;
