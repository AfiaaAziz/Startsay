import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import "./TeamPage.css";
import Footer from "./components/Footer.jsx";
import DragCursor from "./components/DragCursor.jsx";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function TeamPage({ isContactOpen, setIsContactOpen }) {
  useEffect(() => {
    // Initialize all animations and carousel after component mounts
    const initializeAnimations = () => {
      // Text animations with GSAP (Copied from App.jsx)
      if (typeof window !== "undefined") {
        // Split text into spans
        new SplitType("[text-split]", {
          types: "words, chars",
          tagName: "span",
        });

        // Link timelines to scroll position
        function createScrollTriggerAnimation(triggerElement, timeline) {
          ScrollTrigger.create({
            trigger: triggerElement,
            start: "top bottom",
            onLeaveBack: () => {
              timeline.progress(0);
              timeline.pause();
            },
          });
          ScrollTrigger.create({
            trigger: triggerElement,
            start: "top 80%",
            onEnter: () => timeline.play(),
          });
        }

        const $$ = (sel) => Array.from(document.querySelectorAll(sel));

        // Words slide up animation
        $$("[words-slide-up]").forEach((element) => {
          let tl = gsap.timeline({ paused: true });
          tl.from(element.querySelectorAll(".word"), {
            opacity: 0,
            yPercent: 100,
            duration: 0.5,
            ease: "power2.out(2)",
            stagger: { amount: 0.5 },
          });
          createScrollTriggerAnimation(element, tl);
        });

        // Words rotate in animation
        $$("[words-rotate-in]").forEach((element) => {
          let tl = gsap.timeline({ paused: true });
          tl.set(element.querySelectorAll(".word"), {
            transformPerspective: 1000,
          });
          tl.from(element.querySelectorAll(".word"), {
            rotationX: -90,
            duration: 0.6,
            ease: "power2.out",
            stagger: { amount: 0.6 },
          });
          createScrollTriggerAnimation(element, tl);
        });

        // Set text as visible
        gsap.set("[text-split]", { opacity: 1 });
      }

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

  const teamMembers = [
    {
      name: "Syed Mesum Raza",
      title: "Founder",
      img: "/assets/team/Syed Mesum Raza.webp",
    },
    {
      name: "Rameel Malik",
      title: "Chief Product Officer ",
      img: "/assets/team/Rameel.webp",
    },
    {
      name: "Fataina Nadwa",
      title: "Project Manager",
      img: "/assets/team/Fataina.webp",
    },
    {
      name: "Muhammad Zain UL Abedeen ",
      title: "Business Analyst Intern",
      img: "/assets/team/Zain.webp",
    },
    {
      name: "Afia Aziz",
      title: "Full-Stack Developer",
      img: "/assets/team/Afia.webp",
    },
     {
      name: "Hoor Ain",
      title: "Graphic Designer",
      img: "/assets/team/Hoor.webp",
    },
    {
      name: "Bilal Tahir",
      title: "Graphic Design Intern",
      img: "/assets/team/Bilal.webp",
    },
     {
      name: "Maria Riaz",
      title: "Business Development Intern",
      img: "/assets/team/mariaRiaz.png",
    },
    {
      name: "Sana Saeed",
      title: "UI/UX Designer",
      img: "/assets/team/Sana.webp",
    },
    {
      name: "Maria Ilyas Malik",
      title: "Business Developer & Social Media Manager",
      img: "/assets/team/Maria.webp",
    },
    
  ];

  return (
    <>
      <div className="section pad-2">
        <div className="container _2-grid">
          <div>
            <div words-slide-up="" text-split="" className="t-large">
              StartSay is more than an advertising agency it is a movement
              against mediocrity. Born in 2018 and rebranded for the AI era,
              we exist to help businesses break free from outdated
              marketing and step into identities that truly represent who
              they are.
              <br />
              <br />
              From startups looking to make a
              bold entrance to established
              businesses aiming for a refresh,
              our work spans a diverse range
              of industries and styles.
            </div>
          </div>
          <div>
            <div words-slide-up="" text-split="" className="t-large">
              Our team of creative professionals brings together strategy,
              design, content and technology to build campaigns that leave
              a lasting impression. From startups finding their voice to
              established companies redefining their presence StartSay is
              the partner that makes it happen. 1,200+ projects. 80+
              companies. 7 countries. One mission: to set a new standard
              for advertising
            </div>
          </div>
        </div>

        <div className="container _2-grid">
          <div>
            <div className="gap-40"></div>
            <div words-slide-up="" text-split="" className="list-title">
              <strong>Services</strong>
            </div>
            <div className="gap-20"></div>
            <div className="w-dyn-list">
              <div role="list" className="service-list w-dyn-items">
                <div role="listitem" className="service-item w-dyn-item">
                  <div>Ad Creative</div>
                </div>
                <div role="listitem" className="service-item w-dyn-item">
                  <div>UI/UX</div>
                </div>
                <div role="listitem" className="service-item w-dyn-item">
                  <div>Concept Creation</div>
                </div>
                <div role="listitem" className="service-item w-dyn-item">
                  <div>OOH &amp; Outdoor Advertising</div>
                </div>
                <div role="listitem" className="service-item w-dyn-item">
                  <div>Design Systems</div>
                </div>
                <div role="listitem" className="service-item w-dyn-item">
                  <div>Campaign Strategy</div>
                </div>
                <div role="listitem" className="service-item w-dyn-item">
                  <div>Animation</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="gap-40"></div>
            <div words-slide-up="" text-split="" className="list-title">
              <strong>Selected Clients</strong>
            </div>
            <div className="gap-20"></div>
            <div className="w-dyn-list">
              <div role="list" className="client-list w-dyn-items">
                <div
                  words-slide-up=""
                  text-split=""
                  role="listitem"
                  className="w-dyn-item"
                >
                  <div>USAID</div>
                </div>
                <div
                  words-slide-up=""
                  text-split=""
                  role="listitem"
                  className="w-dyn-item"
                >
                  <div>DIFC</div>
                </div>
                <div
                  words-slide-up=""
                  text-split=""
                  role="listitem"
                  className="w-dyn-item"
                >
                  <div>UNODC</div>
                </div>
                <div
                  words-slide-up=""
                  text-split=""
                  role="listitem"
                  className="w-dyn-item"
                >
                  <div>Marriott </div>
                </div>
                <div
                  words-slide-up=""
                  text-split=""
                  role="listitem"
                  className="w-dyn-item"
                >
                  <div>NUST</div>
                </div>
                <div
                  words-slide-up=""
                  text-split=""
                  role="listitem"
                  className="w-dyn-item"
                >
                  <div>Trivelles</div>

                </div>
                <div
                  words-slide-up=""
                  text-split=""
                  role="listitem"
                  className="w-dyn-item"
                >
                  <div>Avtive</div>

                </div>
                <div
                  words-slide-up=""
                  text-split=""
                  role="listitem"
                  className="w-dyn-item"
                >
                  <div>POF</div>
                </div>
                <div
                  words-slide-up=""
                  text-split=""
                  role="listitem"
                  className="w-dyn-item"
                >
                <div>Zonergy</div>

                </div>
                <div
                  words-slide-up=""
                  text-split=""
                  role="listitem"
                  className="w-dyn-item"
                >
                  <div>Footology</div>

                </div>
                <div
                  words-slide-up=""
                  text-split=""
                  role="listitem"
                  className="w-dyn-item"
                >
                  <div>Neuro</div>
                </div>
                <div
                  words-slide-up=""
                  text-split=""
                  role="listitem"
                  className="w-dyn-item"
                >
                <div>ONYX Tower</div>

                </div>
                <div
                  words-slide-up=""
                  text-split=""
                  role="listitem"
                  className="w-dyn-item"
                >
                  <div>QONEXA</div>

                </div>
                <div
                  words-slide-up=""
                  text-split=""
                  role="listitem"
                  className="w-dyn-item"
                >
                  <div>Flamex </div>


                </div>
                <div
                  words-slide-up=""
                  text-split=""
                  role="listitem"
                  className="w-dyn-item"
                >
                  <div>PCB</div>
                </div>
                <div
                  words-slide-up=""
                  text-split=""
                  role="listitem"
                  className="w-dyn-item"
                >
                  <div>Intercity Hotel</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                    backgroundImage: member.img.startsWith("/")
                      ? `url("${member.img}")`
                      : `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/${member.img}")`,
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
      <DragCursor />
    </>
  );
}

export default TeamPage;
