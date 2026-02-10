import { useEffect, useRef, useState } from "react";
import "./admin/admin.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { useVideoPlayer } from "./hooks/useVideoPlayer";
import { Routes, Route, Link } from "react-router-dom";
import IndexPage from "./ClientPage.jsx";
import TeamPage from "./TeamPage";
import ResearchPage from "./ResearchPage";
import ProjectPage from "./pages/ProjectPage";
import MarsPage from "./pages/MarsPage";
import AdminRoutes from "./admin/AdminRoutes";
import Loader from "./components/Loader.jsx";
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function App() {
  const cursorPackRef = useRef(null);
  const defaultCursorRef = useRef(null);
  const linkCursorRef = useRef(null);
  const [cursorType, setCursorType] = useState("default");
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    // Get all cursor elements
    const dragCursor = cursorPack.querySelector(".drag-cursor");
    const resizeCursor = cursorPack.querySelector(".resize-cursor");
    const videoCursor = cursorPack.querySelector("#video-cursor");
    const dragHelper = cursorPack.querySelector(".drag-helper");
    const teamDrag = cursorPack.querySelector(".team-drag");

    // Track mouse position
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    document.addEventListener("mousemove", handleMouseMove);

    // Smooth cursor animation loop
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
      if (videoCursor) {
        videoCursor.style.left = `${cursorX}px`;
        videoCursor.style.top = `${cursorY}px`;
      }

      requestAnimationFrame(animateCursor);
    };

    // Start cursor animation
    const animationFrame = requestAnimationFrame(animateCursor);

    // Function to add white cursor class to all cursor elements
    const addContactBannerCursor = () => {
      const elements = [
        defaultCursor,
        linkCursor,
        dragCursor,
        resizeCursor,
        videoCursor,
        dragHelper,
        teamDrag,
      ];
      elements.forEach((el) => el && el.classList.add("contact-banner-cursor"));
    };

    // Function to remove white cursor class from all cursor elements
    const removeContactBannerCursor = () => {
      const elements = [
        defaultCursor,
        linkCursor,
        dragCursor,
        resizeCursor,
        videoCursor,
        dragHelper,
        teamDrag,
      ];
      elements.forEach(
        (el) => el && el.classList.remove("contact-banner-cursor"),
      );
    };

    // Handle hover states for links and interactive elements using event delegation
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

  return (
    <div className="app-container">
      <Loader />
      <Navbar
        isContactOpen={isContactOpen}
        setIsContactOpen={setIsContactOpen}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <div id="cursor-pack" className="cursor-pack" ref={cursorPackRef}>
        <div
          className={`default-cursor ${cursorType === "link" ? "hidden" : ""}`}
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
        <div className="contact-white-cursor">
          <div className="contact-white-hor"></div>
          <div className="contact-white-ver"></div>
        </div>
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              isContactOpen={isContactOpen}
              setIsContactOpen={setIsContactOpen}
            />
          }
        />
        <Route
          path="/project-index"
          element={
            <IndexPage
              isContactOpen={isContactOpen}
              setIsContactOpen={setIsContactOpen}
            />
          }
        />
        <Route
          path="/team"
          element={
            <TeamPage
              isContactOpen={isContactOpen}
              setIsContactOpen={setIsContactOpen}
            />
          }
        />
        <Route
          path="/research"
          element={
            <ResearchPage
              isContactOpen={isContactOpen}
              setIsContactOpen={setIsContactOpen}
            />
          }
        />
        <Route
          path="/project/mars"
          element={
            <MarsPage
              isContactOpen={isContactOpen}
              setIsContactOpen={setIsContactOpen}
            />
          }
        />
        <Route
          path="/project/:projectSlug"
          element={
            <ProjectPage
              isContactOpen={isContactOpen}
              setIsContactOpen={setIsContactOpen}
            />
          }
        />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>

      <div className={`contact-banner ${isContactOpen ? "open" : "closed"}`}>
        <div
          className="link t-large t-right bottom-auto"
          onClick={() => setIsContactOpen(false)}
          style={{ cursor: "pointer" }}
        >
          ✕
        </div>
        <div>
          <div className="t-large t-white">
            <a href="tel:+496994946890">+92 312 517 5041</a>
            <br />
          </div>
          <div className="t-large t-white">
            <a href="#" className="link">
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
          href="https://www.google.com/maps/place/National+Science+%26+Technology+Park+(NSTP)/@33.6457175,72.9972339,18z/data=!4m14!1m7!3m6!1s0x38df9573aecd2f93:0x1c7fdc5084512ca2!2sNational+Science+%26+Technology+Park+(NSTP)!8m2!3d33.6456729!4d72.9985536!16s%2Fg%2F11h7fm4qtk!3m5!1s0x38df9573aecd2f93:0x1c7fdc5084512ca2!8m2!3d33.6456729!4d72.9985536!16s%2Fg%2F11h7fm4qtk?entry=ttu&g_ep=EgoyMDI2MDEyNS4wIKXMDSoASAFQAw%3D%3D"
          target="_blank"
          className="link t-white-50"
        >
          Map ↗
        </a>
        <div className="link-wrp">
          <a
            href="https://www.instagram.com/startsay.official/"
            target="_blank"
            className="link t-large"
          >
            ↗ Instagram
          </a>
          <a
            href="https://www.linkedin.com/company/startsayofficial"
            target="_blank"
            className="link t-large"
          >
            ↗ LinkedIn
          </a>
          <a
            href="https://www.behance.net/thisissyedbadshah"
            target="_blank"
            className="link t-large"
          >
            ↗ Behance
          </a>
        </div>
      </div>
    </div>
  );
}

function HomePage({ isContactOpen, setIsContactOpen }) {
  useVideoPlayer();

  useEffect(() => {
    // Initialize all animations and carousel after component mounts
    const initializeAnimations = () => {
      // Text animations with GSAP
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
          setTimeout(rotate, 5000);
        }
        rotate();
      });
    };

    // Wait a bit for libraries to load and DOM to settle
    const timer = setTimeout(initializeAnimations, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {}, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (window.Webflow && window.Webflow.require) {
          window.Webflow.destroy();
          window.Webflow.ready();
          window.Webflow.require("ix2").init();
          document.dispatchEvent(new Event("readystatechange"));
          window.dispatchEvent(new Event("resize"));
        }
      } catch (e) {}
      try {
        ScrollTrigger.refresh();
      } catch (e) {}
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
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
              in our marketing efforts. View our
              <a
                href="#"
                data-wf-native-id-path="add0c45d-d02e-cb36-c4ab-5b762e766396:f650a7ea-2f52-1ece-a861-43a90418f594"
                data-wf-ao-click-engagement-tracking="true"
                data-wf-element-id="f650a7ea-2f52-1ece-a861-43a90418f594"
                data-wf-component-context="%5B%7B%22componentId%22%3A%22f650a7ea-2f52-1ece-a861-43a90418f58f%22%2C%22instanceId%22%3A%22add0c45d-d02e-cb36-c4ab-5b762e766396%22%7D%5D"
                className="fs-cc-banner2_text-link"
              >
                Privacy Policy
              </a>
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
                      style={{ opacity: 0, position: "absolute", zIndex: -1 }}
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
                      style={{ opacity: 0, position: "absolute", zIndex: -1 }}
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
                      style={{ opacity: 0, position: "absolute", zIndex: -1 }}
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
              href="tel:+923125175041"
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
      <div className="section hero">
        <a
          data-wf-native-id-path="a28d1b75-7034-a468-795d-8dac5dfca10b"
          data-wf-ao-click-engagement-tracking="true"
          data-wf-element-id="a28d1b75-7034-a468-795d-8dac5dfca10b"
          href="#scrollto"
          className="down-arrow"
        >
          ↓
        </a>
        <div
          data-w-id="36ef00c4-c0c4-67da-152a-af725a1c8d7f"
          className="project-list-wrp w-dyn-list"
        >
          <div
            data-w-id="36ef00c4-c0c4-67da-152a-af725a1c8d80"
            role="list"
            className="project-list w-dyn-items"
          >
            <div
              data-w-id="36ef00c4-c0c4-67da-152a-af725a1c8d81"
              role="listitem"
              className="project-item w-dyn-item"
            >
              <a
                data-w-id="ace78f01-d8e5-8629-9683-6b3790a435cd"
                data-wf-native-id-path="ace78f01-d8e5-8629-9683-6b3790a435cd_instance-0"
                data-wf-ao-click-engagement-tracking="true"
                data-wf-element-id="ace78f01-d8e5-8629-9683-6b3790a435cd"
                data-wf-cms-context="%5B%7B%22collectionId%22%3A%2266c3a685de0fd85a256fe686%22%2C%22itemId%22%3A%2266c3a685de0fd85a256fe733%22%7D%5D"
                style={{
                  backgroundImage: 'url("/assets/01_USAID.webp")',
                }}
                href="#/project/mars"
                className="link project-card w-inline-block"
              >
                <div
                  data-w-id="a6b1d65a-6253-497b-f5ad-8b354b24b4e3"
                  className="project-title"
                >
                  USAID
                </div>
                <div
                  data-w-id="45a76f3e-773c-ba96-27a9-12db3d2a4ce9"
                  className="solid"
                ></div>
              </a>
            </div>
            <div
              data-w-id="36ef00c4-c0c4-67da-152a-af725a1c8d81"
              role="listitem"
              className="project-item w-dyn-item"
            >
              <a
                data-w-id="ace78f01-d8e5-8629-9683-6b3790a435cd"
                data-wf-native-id-path="ace78f01-d8e5-8629-9683-6b3790a435cd_instance-1"
                data-wf-ao-click-engagement-tracking="true"
                data-wf-element-id="ace78f01-d8e5-8629-9683-6b3790a435cd"
                data-wf-cms-context="%5B%7B%22collectionId%22%3A%2266c3a685de0fd85a256fe686%22%2C%22itemId%22%3A%226866689c4654135be7a8ed19%22%7D%5D"
                style={{
                  backgroundImage: 'url("/assets/02_DIFC.webp")',
                }}
                href="#/project/teenage-engineering"
                className="link project-card w-inline-block"
              >
                <div
                  data-w-id="a6b1d65a-6253-497b-f5ad-8b354b24b4e3"
                  className="project-title"
                >
                  DIFC
                </div>
                <div
                  data-w-id="45a76f3e-773c-ba96-27a9-12db3d2a4ce9"
                  className="solid"
                ></div>
              </a>
            </div>
            <div
              data-w-id="36ef00c4-c0c4-67da-152a-af725a1c8d81"
              role="listitem"
              className="project-item w-dyn-item"
            >
              <a
                data-w-id="ace78f01-d8e5-8629-9683-6b3790a435cd"
                data-wf-native-id-path="ace78f01-d8e5-8629-9683-6b3790a435cd_instance-2"
                data-wf-ao-click-engagement-tracking="true"
                data-wf-element-id="ace78f01-d8e5-8629-9683-6b3790a435cd"
                data-wf-cms-context="%5B%7B%22collectionId%22%3A%2266c3a685de0fd85a256fe686%22%2C%22itemId%22%3A%2268f0ab5502c77430020dc19c%22%7D%5D"
                style={{
                  backgroundImage: 'url("/assets/03_HollyWood.webp")',
                }}
                href="#/project/innovation-lab"
                className="link project-card w-inline-block"
              >
                <div
                  data-w-id="a6b1d65a-6253-497b-f5ad-8b354b24b4e3"
                  className="project-title"
                >
                  HollyWood
                </div>
                <div
                  data-w-id="45a76f3e-773c-ba96-27a9-12db3d2a4ce9"
                  className="solid"
                ></div>
              </a>
            </div>
            <div
              data-w-id="36ef00c4-c0c4-67da-152a-af725a1c8d81"
              role="listitem"
              className="project-item w-dyn-item"
            >
              <a
                data-w-id="ace78f01-d8e5-8629-9683-6b3790a435cd"
                data-wf-native-id-path="ace78f01-d8e5-8629-9683-6b3790a435cd_instance-3"
                data-wf-ao-click-engagement-tracking="true"
                data-wf-element-id="ace78f01-d8e5-8629-9683-6b3790a435cd"
                data-wf-cms-context="%5B%7B%22collectionId%22%3A%2266c3a685de0fd85a256fe686%22%2C%22itemId%22%3A%2268f0b2efb2a92583f025a43b%22%7D%5D"
                style={{
                  backgroundImage: 'url("/assets/04_Avtive.webp")',
                }}
                href="#/project/beats-n-buckets"
                className="link project-card w-inline-block"
              >
                <div
                  data-w-id="a6b1d65a-6253-497b-f5ad-8b354b24b4e3"
                  className="project-title"
                >
                  Avtive
                </div>
                <div
                  data-w-id="45a76f3e-773c-ba96-27a9-12db3d2a4ce9"
                  className="solid"
                ></div>
              </a>
            </div>
            <div
              data-w-id="36ef00c4-c0c4-67da-152a-af725a1c8d81"
              role="listitem"
              className="project-item w-dyn-item"
            >
              <a
                data-w-id="ace78f01-d8e5-8629-9683-6b3790a435cd"
                data-wf-native-id-path="ace78f01-d8e5-8629-9683-6b3790a435cd_instance-4"
                data-wf-ao-click-engagement-tracking="true"
                data-wf-element-id="ace78f01-d8e5-8629-9683-6b3790a435cd"
                data-wf-cms-context="%5B%7B%22collectionId%22%3A%2266c3a685de0fd85a256fe686%22%2C%22itemId%22%3A%22686664600b8fabf98a30e68d%22%7D%5D"
                style={{
                  backgroundImage: 'url("/assets/05_ONYX TOWER.webp")',
                }}
                href="#/project/moncler-grenoble"
                className="link project-card w-inline-block"
              >
                <div
                  data-w-id="a6b1d65a-6253-497b-f5ad-8b354b24b4e3"
                  className="project-title"
                >
                  ONYX TOWER
                </div>
                <div
                  data-w-id="45a76f3e-773c-ba96-27a9-12db3d2a4ce9"
                  className="solid"
                ></div>
              </a>
            </div>
            <div
              data-w-id="36ef00c4-c0c4-67da-152a-af725a1c8d81"
              role="listitem"
              className="project-item w-dyn-item"
            >
              <a
                data-w-id="ace78f01-d8e5-8629-9683-6b3790a435cd"
                data-wf-native-id-path="ace78f01-d8e5-8629-9683-6b3790a435cd_instance-5"
                data-wf-ao-click-engagement-tracking="true"
                data-wf-element-id="ace78f01-d8e5-8629-9683-6b3790a435cd"
                data-wf-cms-context="%5B%7B%22collectionId%22%3A%2266c3a685de0fd85a256fe686%22%2C%22itemId%22%3A%226862af0ceb0cacf22273af63%22%7D%5D"
                style={{
                  backgroundImage: 'url("/assets/06_Intercity Hotel.webp")',
                }}
                href="#/project/13-11"
                className="link project-card w-inline-block"
              >
                <div
                  data-w-id="a6b1d65a-6253-497b-f5ad-8b354b24b4e3"
                  className="project-title"
                >
                  Intercity Hotel
                </div>
                <div
                  data-w-id="45a76f3e-773c-ba96-27a9-12db3d2a4ce9"
                  className="solid"
                ></div>
              </a>
            </div>
            <div
              data-w-id="36ef00c4-c0c4-67da-152a-af725a1c8d81"
              role="listitem"
              className="project-item w-dyn-item"
            >
              <a
                data-w-id="ace78f01-d8e5-8629-9683-6b3790a435cd"
                data-wf-native-id-path="ace78f01-d8e5-8629-9683-6b3790a435cd_instance-6"
                data-wf-ao-click-engagement-tracking="true"
                data-wf-element-id="ace78f01-d8e5-8629-9683-6b3790a435cd"
                data-wf-cms-context="%5B%7B%22collectionId%22%3A%2266c3a685de0fd85a256fe686%22%2C%22itemId%22%3A%2268666832c2ad48342e4da3a0%22%7D%5D"
                style={{
                  backgroundImage: 'url("/assets/07_Neuro.webp")',
                }}
                href="#/project/we-are-rewind"
                className="link project-card w-inline-block"
              >
                <div
                  data-w-id="a6b1d65a-6253-497b-f5ad-8b354b24b4e3"
                  className="project-title"
                >
                  Neuro
                </div>
                <div
                  data-w-id="45a76f3e-773c-ba96-27a9-12db3d2a4ce9"
                  className="solid"
                ></div>
              </a>
            </div>
            <div
              data-w-id="36ef00c4-c0c4-67da-152a-af725a1c8d81"
              role="listitem"
              className="project-item w-dyn-item"
            >
              <a
                data-w-id="ace78f01-d8e5-8629-9683-6b3790a435cd"
                data-wf-native-id-path="ace78f01-d8e5-8629-9683-6b3790a435cd_instance-7"
                data-wf-ao-click-engagement-tracking="true"
                data-wf-element-id="ace78f01-d8e5-8629-9683-6b3790a435cd"
                data-wf-cms-context="%5B%7B%22collectionId%22%3A%2266c3a685de0fd85a256fe686%22%2C%22itemId%22%3A%2268666408afab266dc2e2a003%22%7D%5D"
                style={{
                  backgroundImage: 'url("/assets/08_Social Media.webp")',
                }}
                href="#/project/hatton-labs-x-ap"
                className="link project-card w-inline-block"
              >
                <div
                  data-w-id="a6b1d65a-6253-497b-f5ad-8b354b24b4e3"
                  className="project-title"
                >
                  Social Media
                </div>
                <div
                  data-w-id="45a76f3e-773c-ba96-27a9-12db3d2a4ce9"
                  className="solid"
                ></div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="section">
        <div id="scrollto" className="gap-70"></div>
        <div className="container _5-grid">
          <div id="w-node-_868d1110-b12c-1f1a-6951-19194e763c46-256fe678">
            <div words-slide-up="" text-split="" className="about-heading">
              About
            </div>
          </div>

          <div id="w-node-_07ba283e-d6d6-55a6-8ecc-27cf9d894ec7-256fe678">
            <div
              data-w-id="7256aa37-c59c-faaf-e9fb-6a5ef41e1011"
              style={{ opacity: 1 }}
              className="motto"
            >
              Creative Sparks, Powerful Impact{" "}
            </div>
          </div>
        </div>

        <div className="gap-700"></div>
        <div id="showreel" className="container _5-grid">
          <div id="w-node-a83bf4c9-7318-1161-7fa0-1f567b3d4e71-256fe678">
            <div>HighLight</div>
          </div>
          <div id="w-node-a83bf4c9-7318-1161-7fa0-1f567b3d4e74-256fe678">
            <div
              id="videocontainer"
              className="video-container home-instance w-node-_41f6b6fa-a7cb-2ea7-ba37-7aa8483ca464-256fe678"
            >
              <div id="videocontrol" className="videocontrol">
                <div
                  id="videocontrol-play-area"
                  data-w-id="41f6b6fa-a7cb-2ea7-ba37-7aa8483ca466"
                  className="videocontrol-play-area"
                >
                  <div className="video-cursor-mobile-wrp">
                    <div className="video-cursor mobile-cursor">
                      <div className="video-loader"></div>
                      <div className="videocontrol-play-btn">Play</div>
                    </div>
                  </div>
                </div>
                <div className="videocontrol-sub-wrp">
                  <div id="videocontrol-track" className="videocontrol-track">
                    <div
                      id="videocontrol-bar"
                      className="videocontrol-bar"
                    ></div>
                  </div>
                  <div
                    id="videocontrol-sound"
                    className="videocontrol-sound"
                  ></div>
                  <div
                    id="videocontrol-screensize"
                    className="videocontrol-screensize"
                  ></div>
                </div>
              </div>
              <div className="project-hero-video w-embed">
                <video
                  id="video"
                  playsInline
                  muted
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  poster="https://cdn.prod.website-files.com/66c3a685de0fd85a256fe67c/6905062799c3b939ac1d235d_reel-cover-2.webp"
                >
                  <source src="assets/Highlight.mp4" type="video/mp4" />{" "}
                </video>
              </div>
            </div>
          </div>
        </div>
        <div className="gap-80"></div>
        <div words-slide-up="" text-split="" className="container">
          <div>
            <div>
              Startsay
              <br />
              Based in
              <br />
              Office Number 2207 National Science & Technology Park (NSTP) NUST
              H-12, Islamabad
            </div>
          </div>
          <div id="w-node-_2cb51c69-c4b8-8fd1-4c5c-0440af9c465c-256fe678">
            <div className="t-large">
              Startsay is an advertising and marketing agency driven by
              strategy, creativity, and clear brand vision. We craft every
              project with purpose, ensuring each detail delivers meaningful
              impact and real results.
            </div>
          </div>
          <div id="w-node-_2cb51c69-c4b8-8fd1-4c5c-0440af9c465f-256fe678">
            <div className="t-large">
              Working with international clients, we balance experimentation
              with refined execution.
            </div>
            <div className="gap-40"></div>
            <a
              data-wf-native-id-path="2cb51c69-c4b8-8fd1-4c5c-0440af9c4663"
              data-wf-ao-click-engagement-tracking="true"
              data-wf-element-id="2cb51c69-c4b8-8fd1-4c5c-0440af9c4663"
              href="#/team"
              className="link l-large right-arrow"
            >
              Read More
            </a>
          </div>
        </div>
        <div className="gap-100"></div>

        <div words-slide-up="" text-split="" className="container no-top-pad">
          <div>
            <div className="gap-15"></div>
            <div>Clients</div>
          </div>
          <div id="w-node-ae8e3923-2f96-1bde-69cd-fbf36d96061f-256fe678">
            <div className="carousel-wrp">
              <div className="carousel">
                <div className="overflow-hidden w-dyn-list">
                  <div role="list" className="scroll-list w-dyn-items">
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">USAID</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">DIFC</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">UNODC</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        FrontRow Entertainment
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Marriott</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Parkview City</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Intercity Hotel</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">NUST</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">POF</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        WAH Industries Limited
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        Millennium Aesthetic
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Neuro</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Zonergy</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        COCO Cotton Collection
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">ONYX Tower</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        Abraham & Agrimont Tractors
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Avtive</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Trivelles</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                  </div>
                </div>
                <div
                  data-w-id="f95d632f-46e9-13c6-2c2c-5236e3238c6e"
                  className="overflow-hidden w-dyn-list"
                >
                  <div
                    data-w-id="f95d632f-46e9-13c6-2c2c-5236e3238c6f"
                    role="list"
                    className="scroll-list w-dyn-items"
                  >
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">USAID</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">DIFC</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">UNODC</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        FrontRow Entertainment
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Marriott</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Parkview City</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Intercity Hotel</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">NUST</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">POF</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        WAH Industries Limited
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        Millennium Aesthetic
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Neuro</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Zonergy</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        COCO Cotton Collection
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">ONYX Tower</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        Abraham & Agrimont Tractors
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Avtive</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Trivelles</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden w-dyn-list">
                  <div role="list" className="scroll-list w-dyn-items">
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">USAID</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">DIFC</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">UNODC</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        FrontRow Entertainment
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Marriott</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>

                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Parkview City</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Intercity Hotel</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">NUST</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">POF</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        WAH Industries Limited
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        Millennium Aesthetic
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Neuro</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Zonergy</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        COCO Cotton Collection
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">ONYX Tower</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        Abraham & Agrimont Tractors
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Avtive</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Trivelles</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden w-dyn-list">
                  <div role="list" className="scroll-list w-dyn-items">
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">USAID</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">DIFC</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">UNODC</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        FrontRow Entertainment
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Marriott</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Parkview City</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Intercity Hotel</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">NUST</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">POF</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        WAH Industries Limited
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        Millennium Aesthetic
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Neuro</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Zonergy</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        COCO Cotton Collection
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">ONYX Tower</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        Abraham & Agrimont Tractors
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Avtive</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Trivelles</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="gap-40"></div>
            <a
              data-wf-native-id-path="9a73183d-b011-f786-83ad-31a4f71def03"
              data-wf-ao-click-engagement-tracking="true"
              data-wf-element-id="9a73183d-b011-f786-83ad-31a4f71def03"
              href="#/project-index"
              className="link l-large right-arrow"
            >
              All Projects
            </a>
          </div>
        </div>
        <div className="gap-80"></div>
      </div>
      <Footer
        isContactOpen={isContactOpen}
        setIsContactOpen={setIsContactOpen}
      />
    </>
  );
}

export default App;
