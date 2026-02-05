import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./TeamPage.css";
import Loader from "./components/Loader.jsx";

gsap.registerPlugin(ScrollTrigger);

function TeamPage() {
  const cursorPackRef = useRef(null);
  const defaultCursorRef = useRef(null);
  const linkCursorRef = useRef(null);
  const [cursorType, setCursorType] = useState("default");
  const [isCursorInitialized, setIsCursorInitialized] = useState(false);
  const cursorInitializedRef = useRef(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Custom Cursor Logic
  useEffect(() => {
    const cursorPack = cursorPackRef.current;
    const defaultCursor = defaultCursorRef.current;
    const linkCursor = linkCursorRef.current;

    if (!cursorPack || !defaultCursor || !linkCursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const dragCursor = cursorPack.querySelector(".drag-cursor");
    const resizeCursor = cursorPack.querySelector(".resize-cursor");
    const videoCursor = cursorPack.querySelector(".video-cursor");
    const dragHelper = cursorPack.querySelector(".drag-helper");
    const teamDrag = cursorPack.querySelector(".team-drag");

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!cursorInitializedRef.current) {
        cursorInitializedRef.current = true;
        setIsCursorInitialized(true);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    const animateCursor = () => {
      const speed = 0.15;
      cursorX += (mouseX - cursorX) * speed;
      cursorY += (mouseY - cursorY) * speed;

      if (defaultCursor) {
        defaultCursor.style.left = `${cursorX}px`;
        defaultCursor.style.top = `${cursorY}px`;
      }
      if (linkCursor) {
        linkCursor.style.left = `${cursorX}px`;
        linkCursor.style.top = `${cursorY}px`;
      }

      requestAnimationFrame(animateCursor);
    };

    const animationFrame = requestAnimationFrame(animateCursor);

    const addContactBannerCursor = () => {
      if (defaultCursor) defaultCursor.classList.add("contact-banner-cursor");
      if (linkCursor) linkCursor.classList.add("contact-banner-cursor");
      if (dragCursor) dragCursor.classList.add("contact-banner-cursor");
      if (resizeCursor) resizeCursor.classList.add("contact-banner-cursor");
      if (videoCursor) videoCursor.classList.add("contact-banner-cursor");
      if (dragHelper) dragHelper.classList.add("contact-banner-cursor");
      if (teamDrag) teamDrag.classList.add("contact-banner-cursor");
    };

    const removeContactBannerCursor = () => {
      if (defaultCursor)
        defaultCursor.classList.remove("contact-banner-cursor");
      if (linkCursor) linkCursor.classList.remove("contact-banner-cursor");
      if (dragCursor) dragCursor.classList.remove("contact-banner-cursor");
      if (resizeCursor) resizeCursor.classList.remove("contact-banner-cursor");
      if (videoCursor) videoCursor.classList.remove("contact-banner-cursor");
      if (dragHelper) dragHelper.classList.remove("contact-banner-cursor");
      if (teamDrag) teamDrag.classList.remove("contact-banner-cursor");
    };

    const handleLinkHover = (e) => {
      if (!e.target || typeof e.target.closest !== "function") return;
      const target = e.target.closest(
        "a, button, .link, .project-card, .contact-banner",
      );
      if (target) {
        setCursorType("link");
      }
      const contactBanner = e.target.closest(".contact-banner");
      if (contactBanner) {
        addContactBannerCursor();
      }
    };

    const handleLinkLeave = (e) => {
      if (!e.target || typeof e.target.closest !== "function") return;
      const target = e.target.closest(
        "a, button, .link, .project-card, .contact-banner",
      );
      if (target) {
        setCursorType("default");
      }
      const relatedTarget = e.relatedTarget;
      const leavingContactBanner =
        !relatedTarget || !relatedTarget.closest(".contact-banner");
      if (leavingContactBanner) {
        removeContactBannerCursor();
      }
    };

    document.addEventListener("mouseover", handleLinkHover);
    document.addEventListener("mouseout", handleLinkLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrame);
      document.removeEventListener("mouseover", handleLinkHover);
      document.removeEventListener("mouseout", handleLinkLeave);
    };
  }, []);

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
    <div className="app-container">
      <Loader />

      {/* Navbar - Matching IndexPage Structure */}
      <div className="navbar">
        <div className="navbar-main-wrp">
          <div className="navbar-logo-wrp">
            <a
              data-wf-native-id-path="db3a588f-3827-e854-563a-f0ecb0988341:695dd12c-82a5-a52d-8f5b-486dd64e909b"
              data-wf-ao-click-engagement-tracking="true"
              data-wf-element-id="695dd12c-82a5-a52d-8f5b-486dd64e909b"
              data-wf-component-context="%5B%7B%22componentId%22%3A%22695dd12c-82a5-a52d-8f5b-486dd64e909a%22%2C%22instanceId%22%3A%22db3a588f-3827-e854-563a-f0ecb0988341%22%7D%5D"
              href="/"
              className="logo link w-inline-block"
              style={{
                backgroundImage: 'url("/assets/logo.png")',
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            ></a>
          </div>
          <div
            id="w-node-f189272f-6638-5b12-d5b7-2dd5adebb21e-d64e909a"
            className="navbar-dt-wrp"
          >
            <div className="navbar-link-wrp">
              <Link
                data-wf-native-id-path="db3a588f-3827-e854-563a-f0ecb0988341:777dc168-b433-7e41-f8ce-a97e84182cc6:7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de3"
                data-wf-ao-click-engagement-tracking="true"
                data-wf-element-id="7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de3"
                data-wf-component-context="%5B%7B%22componentId%22%3A%22695dd12c-82a5-a52d-8f5b-486dd64e909a%22%2C%22instanceId%22%3A%22db3a588f-3827-e854-563a-f0ecb0988341%22%7D%2C%7B%22componentId%22%3A%227f4a4cfd-1a02-f6e0-fe12-3c21a7a73de2%22%2C%22instanceId%22%3A%22777dc168-b433-7e41-f8ce-a97e84182cc6%22%7D%5D"
                to="/project-index"
                className="link navbar-link"
              >
                Index
              </Link>
              <a
                data-w-id="7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de5"
                data-wf-native-id-path="db3a588f-3827-e854-563a-f0ecb0988341:777dc168-b433-7e41-f8ce-a97e84182cc6:7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de5"
                data-wf-ao-click-engagement-tracking="true"
                data-wf-element-id="7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de5"
                data-wf-component-context="%5B%7B%22componentId%22%3A%22695dd12c-82a5-a52d-8f5b-486dd64e909a%22%2C%22instanceId%22%3A%22db3a588f-3827-e854-563a-f0ecb0988341%22%7D%2C%7B%22componentId%22%3A%227f4a4cfd-1a02-f6e0-fe12-3c21a7a73de2%22%2C%22instanceId%22%3A%22777dc168-b433-7e41-f8ce-a97e84182cc6%22%7D%5D"
                href="#/research"
                className="link navbar-link"
              >
                Research
              </a>
              <a
                data-wf-native-id-path="db3a588f-3827-e854-563a-f0ecb0988341:777dc168-b433-7e41-f8ce-a97e84182cc6:7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de7"
                data-wf-ao-click-engagement-tracking="true"
                data-wf-element-id="7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de7"
                data-wf-component-context="%5B%7B%22componentId%22%3A%22695dd12c-82a5-a52d-8f5b-486dd64e909a%22%2C%22instanceId%22%3A%22db3a588f-3827-e854-563a-f0ecb0988341%22%7D%2C%7B%22componentId%22%3A%227f4a4cfd-1a02-f6e0-fe12-3c21a7a73de2%22%2C%22instanceId%22%3A%22777dc168-b433-7e41-f8ce-a97e84182cc6%22%7D%5D"
                href="#/team"
                className="link navbar-link w--current"
                aria-current="page"
              >
                Team
              </a>
              <a
                data-w-id="7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de9"
                data-wf-native-id-path="db3a588f-3827-e854-563a-f0ecb0988341:777dc168-b433-7e41-f8ce-a97e84182cc6:7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de9"
                data-wf-ao-click-engagement-tracking="true"
                data-wf-element-id="7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de9"
                data-wf-component-context="%5B%7B%22componentId%22%3A%22695dd12c-82a5-a52d-8f5b-486dd64e909a%22%2C%22instanceId%22%3A%22db3a588f-3827-e854-563a-f0ecb0988341%22%7D%2C%7B%22componentId%22%3A%227f4a4cfd-1a02-f6e0-fe12-3c21a7a73de2%22%2C%22instanceId%22%3A%22777dc168-b433-7e41-f8ce-a97e84182cc6%22%7D%5D"
                href="#"
                className="link navbar-link"
                onClick={(e) => {
                  e.preventDefault();
                  setIsContactOpen(!isContactOpen);
                }}
              >
                Contact
              </a>
            </div>
          </div>
          <div
            id="w-node-_695dd12c-82a5-a52d-8f5b-486dd64e909c-d64e909a"
            data-w-id="695dd12c-82a5-a52d-8f5b-486dd64e909c"
            className="menu-icon"
          >
            <div
              data-w-id="695dd12c-82a5-a52d-8f5b-486dd64e909d"
              className="menu-icon-line"
            ></div>
            <div
              data-w-id="695dd12c-82a5-a52d-8f5b-486dd64e909e"
              className="menu-icon-line mi-2"
            ></div>
          </div>
        </div>
        <div className="navbar-mob-wrp">
          <div className="navbar-link-wrp">
            <Link
              data-wf-native-id-path="db3a588f-3827-e854-563a-f0ecb0988341:43979cbf-fab0-480b-4b9a-2c363aa41cfd:7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de3"
              data-wf-ao-click-engagement-tracking="true"
              data-wf-element-id="7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de3"
              data-wf-component-context="%5B%7B%22componentId%22%3A%22695dd12c-82a5-a52d-8f5b-486dd64e909a%22%2C%22instanceId%22%3A%22db3a588f-3827-e854-563a-f0ecb0988341%22%7D%2C%7B%22componentId%22%3A%227f4a4cfd-1a02-f6e0-fe12-3c21a7a73de2%22%2C%22instanceId%22%3A%2243979cbf-fab0-480b-4b9a-2c363aa41cfd%22%7D%5D"
              to="/project-index"
              className="link navbar-link"
            >
              Index
            </Link>
            <a
              data-w-id="7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de5"
              data-wf-native-id-path="db3a588f-3827-e854-563a-f0ecb0988341:43979cbf-fab0-480b-4b9a-2c363aa41cfd:7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de5"
              data-wf-ao-click-engagement-tracking="true"
              data-wf-element-id="7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de5"
              data-wf-component-context="%5B%7B%22componentId%22%3A%22695dd12c-82a5-a52d-8f5b-486dd64e909a%22%2C%22instanceId%22%3A%22db3a588f-3827-e854-563a-f0ecb0988341%22%7D%2C%7B%22componentId%22%3A%227f4a4cfd-1a02-f6e0-fe12-3c21a7a73de2%22%2C%22instanceId%22%3A%2243979cbf-fab0-480b-4b9a-2c363aa41cfd%22%7D%5D"
              href="#/research"
              className="link navbar-link"
            >
              Research
            </a>
            <a
              data-wf-native-id-path="db3a588f-3827-e854-563a-f0ecb0988341:43979cbf-fab0-480b-4b9a-2c363aa41cfd:7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de7"
              data-wf-ao-click-engagement-tracking="true"
              data-wf-element-id="7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de7"
              data-wf-component-context="%5B%7B%22componentId%22%3A%22695dd12c-82a5-a52d-8f5b-486dd64e909a%22%2C%22instanceId%22%3A%22db3a588f-3827-e854-563a-f0ecb0988341%22%7D%2C%7B%22componentId%22%3A%227f4a4cfd-1a02-f6e0-fe12-3c21a7a73de2%22%2C%22instanceId%22%3A%2243979cbf-fab0-480b-4b9a-2c363aa41cfd%22%7D%5D"
              href="#/team"
              className="link navbar-link w--current"
              aria-current="page"
            >
              Team
            </a>
            <a
              data-w-id="7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de9"
              data-wf-native-id-path="db3a588f-3827-e854-563a-f0ecb0988341:43979cbf-fab0-480b-4b9a-2c363aa41cfd:7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de9"
              data-wf-ao-click-engagement-tracking="true"
              data-wf-element-id="7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de9"
              data-wf-component-context="%5B%7B%22componentId%22%3A%22695dd12c-82a5-a52d-8f5b-486dd64e909a%22%2C%22instanceId%22%3A%22db3a588f-3827-e854-563a-f0ecb0988341%22%7D%2C%7B%22componentId%22%3A%227f4a4cfd-1a02-f6e0-fe12-3c21a7a73de2%22%2C%22instanceId%22%3A%2243979cbf-fab0-480b-4b9a-2c363aa41cfd%22%7D%5D"
              href="#"
              className="link navbar-link"
              onClick={(e) => {
                e.preventDefault();
                setIsContactOpen(!isContactOpen);
              }}
            >
              Contact
            </a>
          </div>
        </div>
      </div>

      {/* Cursor Pack */}
      <div id="cursor-pack" className="cursor-pack" ref={cursorPackRef}>
        <div
          className={`default-cursor ${cursorType === "link" || !isCursorInitialized ? "hidden" : ""}`}
          ref={defaultCursorRef}
        >
          <div className="def-cursor-hor"></div>
          <div className="def-cursor-ver"></div>
        </div>
        <div
          className={`link-cursor ${cursorType === "link" ? "visible" : ""}`}
          ref={linkCursorRef}
        >
          <div className="link-cursor-hor"></div>
          <div className="link-cursor-ver"></div>
        </div>
        <div className="drag-cursor"></div>
        <div className="resize-cursor"></div>
        <div className="arrow-cursor"></div>
        <div id="video-cursor" className="video-cursor">
          <div id="video-loader" className="video-loader"></div>
          <div id="videocontrol-play-btn" className="videocontrol-play-btn">
            Play
          </div>
        </div>
        <div className="drag-helper">Drag</div>
        <div className="team-drag">Drag</div>
      </div>

      {/* Cookie Pack */}
      <div className="cookie-pack">
        <div fs-cc="banner" className="fs-cc-banner">
          <div className="fs-cc-banner2_container">
            <div className="fs-cc-manager2_button w-embed">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 8L9 8.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 15L16 15.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 17L10 17.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11 13L11 13.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 12L6 12.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 21C16.9706 21 21 16.9706 21 12C21 11.4402 20.9489 10.8924 20.8511 10.361C20.3413 10.7613 19.6985 11 19 11C18.4536 11 17.9413 10.8539 17.5 10.5987C17.0587 10.8539 16.5464 11 16 11C14.3431 11 13 9.65685 13 8C13 7.60975 13.0745 7.23691 13.2101 6.89492C11.9365 6.54821 11 5.38347 11 4C11 3.66387 11.0553 3.34065 11.1572 3.03894C6.58185 3.46383 3 7.31362 3 12C3 16.9706 7.02944 21 12 21Z"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="fs-cc-banner2_text">
              By clicking "Accept", you agree to the storing of cookies on your
              device to enhance site navigation, analyze site usage, and assist
              in our marketing efforts. View our{" "}
              <a
                href="#"
                data-wf-native-id-path="add0c45d-d02e-cb36-c4ab-5b762e766396:f650a7ea-2f52-1ece-a861-43a90418f594"
                data-wf-ao-click-engagement-tracking="true"
                data-wf-element-id="f650a7ea-2f52-1ece-a861-43a90418f594"
                data-wf-component-context="%5B%7B%22componentId%22%3A%22f650a7ea-2f52-1ece-a861-43a90418f58f%22%2C%22instanceId%22%3A%22add0c45d-d02e-cb36-c4ab-5b762e766396%22%7D%5D"
                className="fs-cc-banner2_text-link"
              >
                Privacy Policy
              </a>{" "}
              for more information.
            </div>
            <div className="fs-cc-banner2_buttons-wrapper">
              <a
                fs-cc="allow"
                data-wf-native-id-path="add0c45d-d02e-cb36-c4ab-5b762e766396:f650a7ea-2f52-1ece-a861-43a90418f59a"
                data-wf-ao-click-engagement-tracking="true"
                data-wf-element-id="f650a7ea-2f52-1ece-a861-43a90418f59a"
                data-wf-component-context="%5B%7B%22componentId%22%3A%22f650a7ea-2f52-1ece-a861-43a90418f58f%22%2C%22instanceId%22%3A%22add0c45d-d02e-cb36-c4ab-5b762e766396%22%7D%5D"
                href="#"
                className="link fs-cc-banner2_button w-button"
              >
                Accept
              </a>
              <a
                fs-cc="deny"
                data-wf-native-id-path="add0c45d-d02e-cb36-c4ab-5b762e766396:b9b97dc1-bd65-6b38-9381-74408befedf9"
                data-wf-ao-click-engagement-tracking="true"
                data-wf-element-id="b9b97dc1-bd65-6b38-9381-74408befedf9"
                data-wf-component-context="%5B%7B%22componentId%22%3A%22f650a7ea-2f52-1ece-a861-43a90418f58f%22%2C%22instanceId%22%3A%22add0c45d-d02e-cb36-c4ab-5b762e766396%22%7D%5D"
                href="#"
                className="link fs-cc-banner2_button fs-cc-button-alt w-button"
              >
                Deny
              </a>
              <div fs-cc="open-preferences" className="link fs-cc-manager">
                Preferences
              </div>
            </div>
          </div>
        </div>
        <div fs-cc-scroll="disable" fs-cc="preferences" className="fs-cc-prefs">
          <form
            id="cookie-preferences"
            name="wf-form-Cookie-Preferences"
            data-name="Cookie Preferences"
            method="get"
            className="fs-cc-prefs2_form"
            data-wf-page-id="66c3a685de0fd85a256fe678"
            data-wf-element-id="f650a7ea-2f52-1ece-a861-43a90418f5a0"
            data-turnstile-sitekey="0x4AAAAAAAQTptj2So4dx43e"
          >
            <div fs-cc="close" className="fs-cc-prefs2_close">
              <div className="fs-cc-preferences2_close-icon w-embed">
                <svg
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                  viewBox="0 0 16 16"
                >
                  <path d="M9.414 8l4.293-4.293-1.414-1.414L8 6.586 3.707 2.293 2.293 3.707 6.586 8l-4.293 4.293 1.414 1.414L8 9.414l4.293 4.293 1.414-1.414L9.414 8z"></path>
                </svg>
              </div>
            </div>
            <div className="fs-cc-prefs2_content">
              <div className="fs-cc-prefs2_space-small">
                <div className="fs-cc-prefs2_title">Privacy Preferences</div>
              </div>
              <div className="fs-cc-prefs2_option">
                <div className="fs-cc-prefs2_toggle-wrapper">
                  <div className="fs-cc-prefs2_label">Essential cookies</div>
                  <div>Required</div>
                </div>
              </div>
              <div className="fs-cc-prefs2_option">
                <div className="fs-cc-prefs2_toggle-wrapper">
                  <div className="fs-cc-prefs2_label">Marketing cookies</div>
                  <label
                    data-wf-native-id-path="add0c45d-d02e-cb36-c4ab-5b762e766396:f650a7ea-2f52-1ece-a861-43a90418f5b1"
                    data-wf-ao-click-engagement-tracking="true"
                    data-wf-element-id="f650a7ea-2f52-1ece-a861-43a90418f5b1"
                    data-wf-component-context="%5B%7B%22componentId%22%3A%22f650a7ea-2f52-1ece-a861-43a90418f58f%22%2C%22instanceId%22%3A%22add0c45d-d02e-cb36-c4ab-5b762e766396%22%7D%5D"
                    className="w-checkbox fs-cc-prefs2_checkbox-field"
                  >
                    <div className="w-checkbox-input w-checkbox-input--inputType-custom fs-cc-prefs2_checkbox"></div>
                    <input
                      type="checkbox"
                      name="marketing-2"
                      id="marketing-2"
                      data-name="Marketing 2"
                      fs-cc-checkbox="marketing"
                      style={{
                        opacity: 0,
                        position: "absolute",
                        zIndex: -1,
                      }}
                    />
                    <span
                      htmlFor="marketing-2"
                      className="fs-cc-prefs2_checkbox-label w-form-label"
                    >
                      Essential
                    </span>
                  </label>
                </div>
              </div>
              <div className="fs-cc-prefs2_option">
                <div className="fs-cc-prefs2_toggle-wrapper">
                  <div className="fs-cc-prefs2_label">
                    Personalization cookies
                  </div>
                  <label
                    data-wf-native-id-path="add0c45d-d02e-cb36-c4ab-5b762e766396:f650a7ea-2f52-1ece-a861-43a90418f5b9"
                    data-wf-ao-click-engagement-tracking="true"
                    data-wf-element-id="f650a7ea-2f52-1ece-a861-43a90418f5b9"
                    data-wf-component-context="%5B%7B%22componentId%22%3A%22f650a7ea-2f52-1ece-a861-43a90418f58f%22%2C%22instanceId%22%3A%22add0c45d-d02e-cb36-c4ab-5b762e766396%22%7D%5D"
                    className="w-checkbox fs-cc-prefs2_checkbox-field"
                  >
                    <div className="w-checkbox-input w-checkbox-input--inputType-custom fs-cc-prefs2_checkbox"></div>
                    <input
                      type="checkbox"
                      name="personalization-2"
                      id="personalization-2"
                      data-name="Personalization 2"
                      fs-cc-checkbox="personalization"
                      style={{
                        opacity: 0,
                        position: "absolute",
                        zIndex: -1,
                      }}
                    />
                    <span
                      htmlFor="personalization-2"
                      className="fs-cc-prefs2_checkbox-label w-form-label"
                    >
                      Essential
                    </span>
                  </label>
                </div>
              </div>
              <div className="fs-cc-prefs2_option">
                <div className="fs-cc-prefs2_toggle-wrapper">
                  <div className="fs-cc-prefs2_label">Analytics cookies</div>
                  <label
                    data-wf-native-id-path="add0c45d-d02e-cb36-c4ab-5b762e766396:f650a7ea-2f52-1ece-a861-43a90418f5c1"
                    data-wf-ao-click-engagement-tracking="true"
                    data-wf-element-id="f650a7ea-2f52-1ece-a861-43a90418f5c1"
                    data-wf-component-context="%5B%7B%22componentId%22%3A%22f650a7ea-2f52-1ece-a861-43a90418f58f%22%2C%22instanceId%22%3A%22add0c45d-d02e-cb36-c4ab-5b762e766396%22%7D%5D"
                    className="w-checkbox fs-cc-prefs2_checkbox-field"
                  >
                    <div className="w-checkbox-input w-checkbox-input--inputType-custom fs-cc-prefs2_checkbox"></div>
                    <input
                      type="checkbox"
                      name="analytics-2"
                      id="analytics-2"
                      data-name="Analytics 2"
                      fs-cc-checkbox="analytics"
                      style={{
                        opacity: 0,
                        position: "absolute",
                        zIndex: -1,
                      }}
                    />
                    <span
                      htmlFor="analytics-2"
                      className="fs-cc-prefs2_checkbox-label w-form-label"
                    >
                      Essential
                    </span>
                  </label>
                </div>
              </div>
              <div className="fs-cc-prefs2_buttons-wrapper">
                <a
                  fs-cc="deny"
                  data-wf-native-id-path="add0c45d-d02e-cb36-c4ab-5b762e766396:f650a7ea-2f52-1ece-a861-43a90418f5c6"
                  data-wf-ao-click-engagement-tracking="true"
                  data-wf-element-id="f650a7ea-2f52-1ece-a861-43a90418f5c6"
                  data-wf-component-context="%5B%7B%22componentId%22%3A%22f650a7ea-2f52-1ece-a861-43a90418f58f%22%2C%22instanceId%22%3A%22add0c45d-d02e-cb36-c4ab-5b762e766396%22%7D%5D"
                  href="#"
                  className="link fs-cc-prefs2_button fs-cc-button-alt w-button"
                >
                  Reject all cookies
                </a>
                <a
                  fs-cc="allow"
                  data-wf-native-id-path="add0c45d-d02e-cb36-c4ab-5b762e766396:f650a7ea-2f52-1ece-a861-43a90418f5c8"
                  data-wf-ao-click-engagement-tracking="true"
                  data-wf-element-id="f650a7ea-2f52-1ece-a861-43a90418f5c8"
                  data-wf-component-context="%5B%7B%22componentId%22%3A%22f650a7ea-2f52-1ece-a861-43a90418f58f%22%2C%22instanceId%22%3A%22add0c45d-d02e-cb36-c4ab-5b762e766396%22%7D%5D"
                  href="#"
                  className="link fs-cc-prefs2_button w-button"
                >
                  Allow all cookies
                </a>
                <a
                  fs-cc="submit"
                  data-wf-native-id-path="add0c45d-d02e-cb36-c4ab-5b762e766396:f650a7ea-2f52-1ece-a861-43a90418f5ca"
                  data-wf-ao-click-engagement-tracking="true"
                  data-wf-element-id="f650a7ea-2f52-1ece-a861-43a90418f5ca"
                  data-wf-component-context="%5B%7B%22componentId%22%3A%22f650a7ea-2f52-1ece-a861-43a90418f58f%22%2C%22instanceId%22%3A%22add0c45d-d02e-cb36-c4ab-5b762e766396%22%7D%5D"
                  href="#"
                  className="link fs-cc-prefs2_submit w-button"
                >
                  Save preferences
                </a>
              </div>
            </div>
          </form>
          <div className="w-form-done"></div>
          <div className="w-form-fail"></div>
          <div fs-cc="close" className="fs-cc-prefs2_overlay"></div>
        </div>
      </div>

      <div
        data-w-id="d5f92b82-978f-a770-3f25-8224578da03a"
        className={`contact-banner ${isContactOpen ? "open" : "closed"}`}
      >
        <div
          data-w-id="d5f92b82-978f-a770-3f25-8224578da03b"
          className="link t-large t-right bottom-auto"
          onClick={() => setIsContactOpen(false)}
          style={{ cursor: "pointer" }}
        >
          ✕
        </div>
        <div>
          <div className="t-large t-white">
            <a
              href="tel:+496994946890"
              data-w-id="3e6c7f76-b278-6f4b-e9b1-42e06638d930"
              data-wf-native-id-path="20f5aab3-bb9e-bf4b-b6b2-65f1575cf856:3e6c7f76-b278-6f4b-e9b1-42e06638d930"
              data-wf-ao-click-engagement-tracking="true"
              data-wf-element-id="3e6c7f76-b278-6f4b-e9b1-42e06638d930"
              data-wf-component-context="%5B%7B%22componentId%22%3A%22d5f92b82-978f-a770-3f25-8224578da03a%22%2C%22instanceId%22%3A%2220f5aab3-bb9e-bf4b-b6b2-65f1575cf856%22%7D%5D"
            >
              +92 312 517 5041
            </a>
            <br />
          </div>
          <div className="t-large t-white">
            <a
              href="#"
              data-wf-native-id-path="20f5aab3-bb9e-bf4b-b6b2-65f1575cf856:6d153c17-ca5a-0644-979f-a1a5d83c9835"
              data-wf-ao-click-engagement-tracking="true"
              data-wf-element-id="6d153c17-ca5a-0644-979f-a1a5d83c9835"
              data-wf-component-context="%5B%7B%22componentId%22%3A%22d5f92b82-978f-a770-3f25-8224578da03a%22%2C%22instanceId%22%3A%2220f5aab3-bb9e-bf4b-b6b2-65f1575cf856%22%7D%5D"
              className="link"
            >
              info@startsay.com
            </a>
            <br />
          </div>
        </div>
        <div className="t-large t-white">
          Office Number 2207 <br />
          National Science & Technology Park (NSTP)
          <br />
          NUST H-12, Islamabad
        </div>
        <a
          data-wf-native-id-path="20f5aab3-bb9e-bf4b-b6b2-65f1575cf856:d5f92b82-978f-a770-3f25-8224578da048"
          data-wf-ao-click-engagement-tracking="true"
          data-wf-element-id="d5f92b82-978f-a770-3f25-8224578da048"
          data-wf-component-context="%5B%7B%22componentId%22%3A%22d5f92b82-978f-a770-3f25-8224578da03a%22%2C%22instanceId%22%3A%2220f5aab3-bb9e-bf4b-b6b2-65f1575cf856%22%7D%5D"
          href="https://www.google.com/maps/place/National+Science+%26+Technology+Park+(NSTP)/@33.6457175,72.9972339,18z/data=!4m14!1m7!3m6!1s0x38df9573aecd2f93:0x1c7fdc5084512ca2!2sNational+Science+%26+Technology+Park+(NSTP)!8m2!3d33.6456729!4d72.9985536!16s%2Fg%2F11h7fm4qtk!3m5!1s0x38df9573aecd2f93:0x1c7fdc5084512ca2!8m2!3d33.6456729!4d72.9985536!16s%2Fg%2F11h7fm4qtk?entry=ttu&g_ep=EgoyMDI2MDEyNS4wIKXMDSoASAFQAw%3D%3D"
          target="_blank"
          className="link t-white-50"
        >
          Map ↗
        </a>
        <div className="link-wrp">
          <a
            data-wf-native-id-path="20f5aab3-bb9e-bf4b-b6b2-65f1575cf856:d5f92b82-978f-a770-3f25-8224578da04b"
            data-wf-ao-click-engagement-tracking="true"
            data-wf-element-id="d5f92b82-978f-a770-3f25-8224578da04b"
            data-wf-component-context="%5B%7B%22componentId%22%3A%22d5f92b82-978f-a770-3f25-8224578da03a%22%2C%22instanceId%22%3A%2220f5aab3-bb9e-bf4b-b6b2-65f1575cf856%22%7D%5D"
            href="https://www.instagram.com/startsay.official/"
            target="_blank"
            className="link t-large"
          >
            ↗ Instagram
          </a>
          <a
            data-wf-native-id-path="20f5aab3-bb9e-bf4b-b6b2-65f1575cf856:d5f92b82-978f-a770-3f25-8224578da04d"
            data-wf-ao-click-engagement-tracking="true"
            data-wf-element-id="d5f92b82-978f-a770-3f25-8224578da04d"
            data-wf-component-context="%5B%7B%22componentId%22%3A%22d5f92b82-978f-a770-3f25-8224578da03a%22%2C%22instanceId%22%3A%2220f5aab3-bb9e-bf4b-b6b2-65f1575cf856%22%7D%5D"
            href="https://www.linkedin.com/company/startsayofficial"
            target="_blank"
            className="link t-large"
          >
            ↗ LinkedIn
          </a>
          <a
            data-wf-native-id-path="20f5aab3-bb9e-bf4b-b6b2-65f1575cf856:d5f92b82-978f-a770-3f25-8224578da04f"
            data-wf-ao-click-engagement-tracking="true"
            data-wf-element-id="d5f92b82-978f-a770-3f25-8224578da04f"
            data-wf-component-context="%5B%7B%22componentId%22%3A%22d5f92b82-978f-a770-3f25-8224578da03a%22%2C%22instanceId%22%3A%2220f5aab3-bb9e-bf4b-b6b2-65f1575cf856%22%7D%5D"
            href="https://www.behance.net/thisissyedbadshah"
            target="_blank"
            className="link t-large"
          >
            ↗ Behance
          </a>
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

      <div data-w-id="d636055f-4a21-6155-01a4-3396fc0d09e3" className="footer">
        <div className="container">
          <div
            id="w-node-d636055f-4a21-6155-01a4-3396fc0d09e5-fc0d09e3"
            className="footer-column"
          >
            <div className="t-small">© Startsay</div>
          </div>
          <div
            id="w-node-d636055f-4a21-6155-01a4-3396fc0d09e8-fc0d09e3"
            className="footer-column"
          >
            <a
              data-wf-native-id-path="25bbb818-505b-4eef-f059-e84f2ae1b087:d636055f-4a21-6155-01a4-3396fc0d09e9"
              data-wf-ao-click-engagement-tracking="true"
              data-wf-element-id="d636055f-4a21-6155-01a4-3396fc0d09e9"
              data-wf-component-context="%5B%7B%22componentId%22%3A%22d636055f-4a21-6155-01a4-3396fc0d09e3%22%2C%22instanceId%22%3A%2225bbb818-505b-4eef-f059-e84f2ae1b087%22%7D%5D"
              href="https://www.instagram.com/startsay.official/"
              target="_blank"
              className="link footer-link right-up-arrow"
            >
              Instagram
            </a>
            <a
              data-wf-native-id-path="25bbb818-505b-4eef-f059-e84f2ae1b087:d636055f-4a21-6155-01a4-3396fc0d09eb"
              data-wf-ao-click-engagement-tracking="true"
              data-wf-element-id="d636055f-4a21-6155-01a4-3396fc0d09eb"
              data-wf-component-context="%5B%7B%22componentId%22%3A%22d636055f-4a21-6155-01a4-3396fc0d09e3%22%2C%22instanceId%22%3A%2225bbb818-505b-4eef-f059-e84f2ae1b087%22%7D%5D"
              href="https://www.linkedin.com/company/startsayofficial"
              target="_blank"
              className="link footer-link right-up-arrow"
            >
              LinkedIn
            </a>
            <a
              data-wf-native-id-path="25bbb818-505b-4eef-f059-e84f2ae1b087:d636055f-4a21-6155-01a4-3396fc0d09eb"
              data-wf-ao-click-engagement-tracking="true"
              data-wf-element-id="d636055f-4a21-6155-01a4-3396fc0d09eb"
              data-wf-component-context="%5B%7B%22componentId%22%3A%22d636055f-4a21-6155-01a4-3396fc0d09e3%22%2C%22instanceId%22%3A%2225bbb818-505b-4eef-f059-e84f2ae1b087%22%7D%5D"
              href="https://www.facebook.com/profile.php?id=61572256355814"
              target="_blank"
              className="link footer-link right-up-arrow"
            >
              Facebook
            </a>
            <a
              data-wf-native-id-path="25bbb818-505b-4eef-f059-e84f2ae1b087:d636055f-4a21-6155-01a4-3396fc0d09ed"
              data-wf-ao-click-engagement-tracking="true"
              data-wf-element-id="d636055f-4a21-6155-01a4-3396fc0d09ed"
              data-wf-component-context="%5B%7B%22componentId%22%3A%22d636055f-4a21-6155-01a4-3396fc0d09e3%22%2C%22instanceId%22%3A%2225bbb818-505b-4eef-f059-e84f2ae1b087%22%7D%5D"
              href="https://www.behance.net/thisissyedbadshah"
              target="_blank"
              className="link footer-link right-up-arrow"
            >
              Behance
            </a>
          </div>

          <div
            id="w-node-d636055f-4a21-6155-01a4-3396fc0d09f4-fc0d09e3"
            className="footer-column"
          >
            <a
              data-wf-native-id-path="25bbb818-505b-4eef-f059-e84f2ae1b087:d636055f-4a21-6155-01a4-3396fc0d09f5"
              data-wf-ao-click-engagement-tracking="true"
              data-wf-element-id="d636055f-4a21-6155-01a4-3396fc0d09f5"
              data-wf-component-context="%5B%7B%22componentId%22%3A%22d636055f-4a21-6155-01a4-3396fc0d09e3%22%2C%22instanceId%22%3A%2225bbb818-505b-4eef-f059-e84f2ae1b087%22%7D%5D"
              href="#/project-index"
              className="link footer-link right-arrow"
            >
              Index
            </a>
            <a
              data-wf-native-id-path="25bbb818-505b-4eef-f059-e84f2ae1b087:d636055f-4a21-6155-01a4-3396fc0d09f7"
              data-wf-ao-click-engagement-tracking="true"
              data-wf-element-id="d636055f-4a21-6155-01a4-3396fc0d09f7"
              data-wf-component-context="%5B%7B%22componentId%22%3A%22d636055f-4a21-6155-01a4-3396fc0d09e3%22%2C%22instanceId%22%3A%2225bbb818-505b-4eef-f059-e84f2ae1b087%22%7D%5D"
              href="#/research"
              className="link footer-link right-arrow"
            >
              Research
            </a>
            <a
              data-wf-native-id-path="25bbb818-505b-4eef-f059-e84f2ae1b087:d636055f-4a21-6155-01a4-3396fc0d09f9"
              data-wf-ao-click-engagement-tracking="true"
              data-wf-element-id="d636055f-4a21-6155-01a4-3396fc0d09f9"
              data-wf-component-context="%5B%7B%22componentId%22%3A%22d636055f-4a21-6155-01a4-3396fc0d09e3%22%2C%22instanceId%22%3A%2225bbb818-505b-4eef-f059-e84f2ae1b087%22%7D%5D"
              href="#/team"
              className="link footer-link right-arrow"
            >
              Team
            </a>
            <div
              data-w-id="d636055f-4a21-6155-01a4-3396fc0d09fb"
              className="link footer-link"
            >
              Contact
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamPage;
