import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { useVideoPlayer } from "../hooks/useVideoPlayer";

gsap.registerPlugin(ScrollTrigger);

export default function MarsPage() {
  const cursorPackRef = useRef(null);
  const defaultCursorRef = useRef(null);
  const linkCursorRef = useRef(null);
  const [cursorType, setCursorType] = useState("default");
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Initialize video player
  useVideoPlayer();

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
        "a, button, .link, .project-card, .contact-banner"
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
        "a, button, .link, .project-card, .contact-banner"
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

  // Text animations
  useEffect(() => {
    const initializeAnimations = () => {
      let typeSplit = new SplitType("[text-split]", {
        types: "words, chars",
        tagName: "span",
      });

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

      gsap.set("[text-split]", { opacity: 1 });
    };

    const timer = setTimeout(initializeAnimations, 500);
    return () => clearTimeout(timer);
  }, []);

  // Section items fade in animation
  useEffect(() => {
    const items = Array.from(document.querySelectorAll(".section-item"));
    items.forEach((item) => {
      gsap.set(item, { opacity: 0 });
      ScrollTrigger.create({
        trigger: item,
        start: "top 85%",
        onEnter: () => {
          gsap.to(item, { opacity: 1, duration: 0.6, ease: "power2.out" });
        },
      });
    });
  }, []);

  return (
    <div className="app-container">
      {/* Navbar */}
      <div className="navbar" style={{ willChange: "transform", transform: "translate3d(0px, 0%, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", transformStyle: "preserve-3d" }}>
        <div className="navbar-main-wrp">
          <div className="navbar-logo-wrp">
            <Link
              to="/"
              className="logo link w-inline-block"
            ></Link>
          </div>
          <div id="w-node-f189272f-6638-5b12-d5b7-2dd5adebb21e-d64e909a" className="navbar-dt-wrp">
            <div className="navbar-link-wrp">
              <Link to="/project-index" className="link navbar-link">
                Index
              </Link>
              <Link to="/research" className="link navbar-link">
                Research
              </Link>
              <Link to="/team" className="link navbar-link">
                Team
              </Link>
              <a
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
              style={{ transform: "translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", transformStyle: "preserve-3d" }}
            ></div>
            <div
              data-w-id="695dd12c-82a5-a52d-8f5b-486dd64e909e"
              className="menu-icon-line mi-2"
              style={{ transform: "translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", transformStyle: "preserve-3d" }}
            ></div>
          </div>
        </div>
        <div className="navbar-mob-wrp">
          <div className="navbar-link-wrp">
            <Link to="/project-index" className="link navbar-link">
              Index
            </Link>
            <Link to="/research" className="link navbar-link">
              Research
            </Link>
            <Link to="/team" className="link navbar-link">
              Team
            </Link>
            <a
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
      <div
        id="cursor-pack"
        data-w-id="ffc94e13-05f2-5027-2033-6946e0d01232"
        className="cursor-pack"
        ref={cursorPackRef}
        style={{ willChange: "transform", transform: "translate3d(50vw, 50vh, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", transformStyle: "preserve-3d" }}
      >
        <div
          data-w-id="ffc94e13-05f2-5027-2033-6946e0d01237"
          className={`default-cursor ${cursorType === "link" ? "hidden" : ""}`}
          ref={defaultCursorRef}
        >
          <div className="def-cursor-hor"></div>
          <div className="def-cursor-ver"></div>
        </div>
        <div
          data-w-id="ffc94e13-05f2-5027-2033-6946e0d01234"
          className={`link-cursor ${cursorType === "link" ? "visible" : ""}`}
          ref={linkCursorRef}
        >
          <div className="link-cursor-hor"></div>
          <div className="link-cursor-ver"></div>
        </div>
        <div
          data-w-id="218bd18c-b09b-fd1f-8919-239f1d31cae1"
          className="drag-cursor"
        ></div>
        <div className="resize-cursor"></div>
        <div className="arrow-cursor"></div>
        <div id="video-cursor" className="video-cursor" style={{ opacity: 1 }}>
          <div id="video-loader" className="video-loader" aria-hidden="true" style={{ display: "none", opacity: 0 }}></div>
          <div id="videocontrol-play-btn" className="videocontrol-play-btn" aria-hidden="true" tabIndex="-1" style={{ pointerEvents: "none" }}>
            Play
          </div>
        </div>
        <div className="drag-helper">Drag</div>
        <div className="team-drag">Drag</div>
      </div>

      {/* Cookie Pack */}
      <div className="cookie-pack">
        <div fs-cc="banner" className="fs-cc-banner" style={{ display: "flex", opacity: 1 }}>
          <div className="fs-cc-banner2_container">
            <div className="fs-cc-manager2_button w-embed">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 8L9 8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M16 15L16 15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M10 17L10 17.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M11 13L11 13.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M6 12L6 12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M12 21C16.9706 21 21 16.9706 21 12C21 11.4402 20.9489 10.8924 20.8511 10.361C20.3413 10.7613 19.6985 11 19 11C18.4536 11 17.9413 10.8539 17.5 10.5987C17.0587 10.8539 16.5464 11 16 11C14.3431 11 13 9.65685 13 8C13 7.60975 13.0745 7.23691 13.2101 6.89492C11.9365 6.54821 11 5.38347 11 4C11 3.66387 11.0553 3.34065 11.1572 3.03894C6.58185 3.46383 3 7.31362 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
            <div className="fs-cc-banner2_text">
              By clicking "Accept", you agree to the storing of cookies on your device to enhance site navigation, analyze site usage, and assist in our marketing efforts. View our{" "}
              <a href="#" className="fs-cc-banner2_text-link">
                Privacy Policy
              </a>{" "}
              for more information.
            </div>
            <div className="fs-cc-banner2_buttons-wrapper">
              <a fs-cc="allow" href="#" className="link fs-cc-banner2_button w-button" role="button" tabIndex="0">
                Accept
              </a>
              <a fs-cc="deny" href="#" className="link fs-cc-banner2_button fs-cc-button-alt w-button" role="button" tabIndex="0">
                Deny
              </a>
              <div fs-cc="open-preferences" className="link fs-cc-manager" role="button" tabIndex="0">
                <div>Preferences</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Banner */}
      <div
        data-w-id="d5f92b82-978f-a770-3f25-8224578da03a"
        className="contact-banner"
        style={{ transform: `translate3d(${isContactOpen ? "0" : "100"}%, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)`, transformStyle: "preserve-3d" }}
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
            <a href="tel:+496994946890">+49 69 9494 689-0</a>
            <br />
          </div>
          <div className="t-large t-white">
            <a href="#" className="link">
              info@styleframe.de
            </a>
            <br />
          </div>
        </div>
        <div className="t-large t-white">
          Hanauer Landstr. 287
          <br />
          60314 Frankfurt am
          <br />
          Main, Germany
        </div>
        <a
          href="https://maps.app.goo.gl/iqJ7Bt22FuPA7EKA7"
          target="_blank"
          className="link t-white-50"
        >
          Map ↗
        </a>
        <div className="link-wrp">
          <a
            href="https://www.instagram.com/styleframe.studio/"
            target="_blank"
            className="link t-large"
          >
            ↗ Instagram
          </a>
          <a
            href="https://www.linkedin.com/company/styleframe"
            target="_blank"
            className="link t-large"
          >
            ↗ LinkedIn
          </a>
          <a
            href="https://www.behance.net/styleframe"
            target="_blank"
            className="link t-large"
          >
            ↗ Behance
          </a>
          <a
            href="https://vimeo.com/styleframe"
            target="_blank"
            className="link t-large"
          >
            ↗ Vimeo
          </a>
          <a
            href="https://www.instagram.com/echologic.lab/"
            target="_blank"
            className="link t-large"
          >
            ↗ AI Lab
          </a>
        </div>
      </div>

      {/* Up Arrow */}
      <a
        data-w-id="14381865-62c7-47ee-67e2-7f40e4733502"
        href="#top"
        className="up-arrow"
        style={{ willChange: "transform, opacity", transform: "translate3d(0px, 100%, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", transformStyle: "preserve-3d", opacity: 0 }}
      >
        ↑
      </a>

      {/* Main Content */}
      <div className="section">
        <div className="gap-120"></div>
        <div className="container">
          <h1 words-slide-up="" text-split="" id="w-node-_78ba933a-a78e-f877-f420-ecea77870969-256fe6a4" style={{ opacity: 1 }}>
            MUZM Mars
          </h1>
        </div>

        {/* Hero Video */}
        <div
          data-w-id="932de7c3-cbe3-b0db-943e-c0e63a54128b"
          style={{ opacity: 1, transform: "translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", transformStyle: "preserve-3d" }}
          className="container no-pad"
        >
          <div
            id="videocontainer"
            className="video-container w-node-e05988ce-6958-9991-9b6c-cb5b44175a30-256fe6a4"
          >
            <div id="videocontrol" className="videocontrol" style={{ opacity: 1 }}>
              <div id="videocontrol-play-area" data-w-id="d3ded114-7ade-dc4e-a958-948ffa3070fc" className="videocontrol-play-area">
                <div className="video-cursor-mobile-wrp">
                  <div className="video-cursor mobile-cursor" style={{ opacity: 1 }}>
                    <div className="video-loader" aria-hidden="true" style={{ display: "none", opacity: 0 }}></div>
                    <div className="videocontrol-play-btn" aria-hidden="true" tabIndex="-1" style={{ pointerEvents: "none" }}>
                      Play
                    </div>
                  </div>
                </div>
              </div>
              <div className="videocontrol-sub-wrp">
                <div id="videocontrol-track" className="videocontrol-track">
                  <div id="videocontrol-bar" className="videocontrol-bar" style={{ width: "0%" }}></div>
                </div>
                <div id="videocontrol-sound" className="videocontrol-sound" tabIndex="0" aria-pressed="false"></div>
                <div id="videocontrol-screensize" className="videocontrol-screensize" tabIndex="0"></div>
              </div>
            </div>
            <div className="project-hero-video w-embed">
              <video
                id="video"
                playsInline
                webkitPlaysinline=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                poster="https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68fb8277d242196cfc68802d_Mars_Glasses_Hero_Portait_v003_web.avif"
              >
                <source src="https://cdn.styleframe.de/oakley-mars/OAKLEY_MARS_CAMPAIGN_FILM_DirectorsCut_16x9_25SEK_klein.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>

        {/* Project Info */}
        <div className="container">
          <div words-slide-up="" text-split="" style={{ opacity: 1 }}>
            <div className="t-small t-gray" style={{ display: "inline-block", position: "relative" }}>
              Year
            </div>
            <div className="gap-40"></div>
            <div className="t-large" style={{ display: "inline-block", position: "relative" }}>
              2022
            </div>
          </div>
          <div words-slide-up="" text-split="" style={{ opacity: 1 }}>
            <div className="t-small t-gray" style={{ display: "inline-block", position: "relative" }}>
              Client
            </div>
            <div className="gap-40"></div>
            <div className="t-large" style={{ display: "inline-block", position: "relative" }}>
              Oakley
            </div>
          </div>
          <div words-slide-up="" text-split="" id="w-node-_31f82efd-f2e5-3af9-d080-b497ba184cc2-256fe6a4" style={{ opacity: 1 }}>
            <div className="t-small t-gray" style={{ display: "inline-block", position: "relative" }}>
              Project Details
            </div>
            <div className="gap-40"></div>
            <div className="t-large t-normal w-richtext" style={{ display: "inline-block", position: "relative" }}>
              <p style={{ display: "inline-block", position: "relative" }}>
                The Mars campaign transports the legendary eyewear into a bold new dimension, set against a forged-in-red, Martian surface, our CGI film reimagines the terrain, the rover and the glasses as one unified vehicle of performance and design.
              </p>
            </div>
          </div>
          <div words-slide-up="" text-split="" style={{ opacity: 1 }}>
            <div className="t-small t-gray" style={{ display: "inline-block", position: "relative" }}>
              Type
            </div>
            <div className="gap-40"></div>
            <div className="t-large" style={{ display: "inline-block", position: "relative" }}>
              Campaign
            </div>
          </div>
        </div>
        <div className="gap-120"></div>
      </div>

      {/* Gallery Section */}
      <div className="section">
        <div className="container">
          <div id="w-node-_4bfd1412-00ec-d53d-c832-8775a6512fe6-256fe6a4" className="section-list-wrp w-dyn-list">
            <div role="list" className="section-list w-dyn-items">
              {/* Section Item 1 */}
              <div
                data-w-id="4bfd1412-00ec-d53d-c832-8775a6512fe8"
                style={{ opacity: 0 }}
                role="listitem"
                className="section-item w-dyn-item"
              >
                <div className="section-visuals-wrp">
                  <img
                    src="https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68fb83d10b4fcd7cd3aa90df_Oakley_MARS_CAMPAIGN_FILM_FINAL_1x1_00154_web.avif"
                    loading="lazy"
                    width="Auto"
                    alt=""
                    className="section-img"
                  />
                  <img
                    src="https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f0e52c4d8fbc95d05cfa37_13.2.avif"
                    loading="lazy"
                    width="Auto"
                    alt=""
                    sizes="100vw"
                    srcSet="https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f0e52c4d8fbc95d05cfa37_13.2-p-500.avif 500w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f0e52c4d8fbc95d05cfa37_13.2-p-800.avif 800w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f0e52c4d8fbc95d05cfa37_13.2.avif 1277w"
                    className="section-img"
                  />
                </div>
              </div>

              {/* Section Item 2 */}
              <div
                data-w-id="4bfd1412-00ec-d53d-c832-8775a6512fe8"
                style={{ opacity: 0 }}
                role="listitem"
                className="section-item w-dyn-item"
              >
                <div className="section-visuals-wrp">
                  <img
                    src="https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68fb84fab4ef70a362aa7532_Mars_Stills_Static_Background_Rover_web.avif"
                    loading="lazy"
                    width="Auto"
                    alt=""
                    className="section-img"
                  />
                </div>
              </div>

              {/* Section Item 3 */}
              <div
                data-w-id="4bfd1412-00ec-d53d-c832-8775a6512fe8"
                style={{ opacity: 0 }}
                role="listitem"
                className="section-item w-dyn-item"
              >
                <div className="section-visuals-wrp">
                  <img
                    src="https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f0e0dcf8c00dfb4a224bd6_2.2.avif"
                    loading="lazy"
                    width="Auto"
                    alt=""
                    className="section-img"
                  />
                  <img
                    src="https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f0e0e3b587f63e8c69536f_3.2.avif"
                    loading="lazy"
                    width="Auto"
                    alt=""
                    sizes="100vw"
                    srcSet="https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f0e0e3b587f63e8c69536f_3.2-p-500.avif 500w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f0e0e3b587f63e8c69536f_3.2.avif 1238w"
                    className="section-img"
                  />
                </div>
              </div>

              {/* Section Item 4 */}
              <div
                data-w-id="4bfd1412-00ec-d53d-c832-8775a6512fe8"
                style={{ opacity: 0 }}
                role="listitem"
                className="section-item w-dyn-item"
              >
                <div className="section-visuals-wrp">
                  <img
                    src="https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68fb85b340c73a78b2c9744f_Mars_Stills_Static_Background_Landscape_web.avif"
                    loading="lazy"
                    width="Auto"
                    alt=""
                    className="section-img"
                  />
                </div>
              </div>

              {/* Section Item 5 - Videos */}
              <div
                data-w-id="4bfd1412-00ec-d53d-c832-8775a6512fe8"
                style={{ opacity: 0 }}
                role="listitem"
                className="section-item w-dyn-item"
              >
                <div className="section-visuals-wrp">
                  <div className="section-video w-embed">
                    <div style={{ height: "100%" }}>
                      <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        disablePictureInPicture
                        disableRemotePlayback
                        x-webkit-airplay="deny"
                        style={{ height: "100%", width: "100%", objectFit: "cover" }}
                      >
                        <source src="https://cdn.styleframe.de/oakley-mars/Oswald_Snippet.mp4" type="video/mp4" />
                      </video>
                    </div>
                  </div>
                  <div className="section-video w-embed">
                    <div style={{ height: "100%" }}>
                      <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        disablePictureInPicture
                        disableRemotePlayback
                        x-webkit-airplay="deny"
                        style={{ height: "100%", width: "100%", objectFit: "cover" }}
                      >
                        <source src="https://cdn.styleframe.de/oakley-mars/Rover_Snippet.mp4" type="video/mp4" />
                      </video>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Item 6 */}
              <div
                data-w-id="4bfd1412-00ec-d53d-c832-8775a6512fe8"
                style={{ opacity: 0 }}
                role="listitem"
                className="section-item w-dyn-item"
              >
                <div className="section-visuals-wrp">
                  <img
                    src="https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68fb87121faccd95cf30ef7e_Oakley_MARS_CAMPAIGN_FILM_Planet_16x9_00009_web.avif"
                    loading="lazy"
                    width="Auto"
                    alt=""
                    className="section-img"
                  />
                </div>
              </div>

              {/* Section Item 7 */}
              <div
                data-w-id="4bfd1412-00ec-d53d-c832-8775a6512fe8"
                style={{ opacity: 0 }}
                role="listitem"
                className="section-item w-dyn-item"
              >
                <div className="section-visuals-wrp">
                  <img
                    src="https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f12bda46dd49e8b3545316_11.3.avif"
                    loading="lazy"
                    width="Auto"
                    alt=""
                    className="section-img"
                  />
                  <img
                    src="https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f0e2f6915ebf52992f1174_6.2.avif"
                    loading="lazy"
                    width="Auto"
                    alt=""
                    sizes="100vw"
                    srcSet="https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f0e2f6915ebf52992f1174_6.2-p-500.avif 500w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f0e2f6915ebf52992f1174_6.2-p-800.avif 800w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f0e2f6915ebf52992f1174_6.2.avif 1381w"
                    className="section-img"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credits Section */}
      <div className="section">
        <div className="gap-120"></div>
        <div className="container">
          <div id="w-node-dbacb399-4cbe-e265-cd6d-671956f93798-256fe6a4" className="w-richtext">
            <p>Oakley MUZM Mars - X Metal Leather with PRIZM 24K Lenses</p>
          </div>
          <div id="w-node-_98c4c2f8-303d-e9a5-2b47-4a6a46e7f61b-256fe6a4">
            <div className="t-small t-gray">Credits</div>
            <div className="gap-40"></div>
            <div className="credits-wrp">
              <div className="credits-column">
                <div>Client</div>
                <div className="t-bold">Oakley</div>
                <div className="gap-20"></div>
                <div>Services</div>
                <div className="w-dyn-list">
                  <div role="list" className="w-dyn-items">
                    <div role="listitem" className="w-dyn-item">
                      <div className="t-bold">Visual Effects</div>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <div className="t-bold">AI Direction &amp; Execution</div>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <div className="t-bold">CGI Still &amp; Animation Production</div>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <div className="t-bold">Creative, Art &amp; Animation Direction</div>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <div className="t-bold">Conception &amp; Design</div>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <div className="t-bold">3D Motion</div>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <div className="t-bold">Research &amp; Visual Development</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="gap-120"></div>
      </div>

      {/* Project Navigation */}
      <div id="current-project" current-title="MUZM Mars" className="section">
        <div className="container">
          <div id="w-node-_15a0e899-fa0b-561c-f0d1-fbda7825a78b-256fe6a4" data-w-id="15a0e899-fa0b-561c-f0d1-fbda7825a78b" className="proj-prev-trigger">
            <div className="w-dyn-list">
              <div id="listPrev" role="list" className="w-dyn-items">
                <div project-title="13.11" role="listitem" className="proj-item w-dyn-item" data-index="16" style={{}}>
                  <Link
                    to="/project/13-11"
                    className="proj-mover w-inline-block"
                  >
                    <div className="proj-mover-title-wrp">
                      <div className="t-large t-gray mov-prev">←</div>
                      <div className="t-large t-gray">Previous Project</div>
                    </div>
                    <div className="t-large">13.11</div>
                  </Link>
                  <div
                    className="index-hover"
                    style={{ willChange: "transform", transform: "translate3d(0vw, 0vh, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", transformStyle: "preserve-3d" }}
                  >
                    <div className="index-hover-vid w-embed">
                      <video
                        data-src="https://cdn.styleframe.de/OAKLEY_1311/OAKLEY_1311_WebsiteSnippet.mp4"
                        poster="https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6863fb29be7faa9be9331c2f_OAK23_CATALYST_13.11_Metaphor_16x6.jpg"
                        disablePictureInPicture
                        disableRemotePlayback
                        x-webkit-airplay="deny"
                        playsInline
                        muted
                        preload="none"
                        style={{ height: "100%", width: "100%", objectFit: "cover" }}
                        src="https://cdn.styleframe.de/OAKLEY_1311/OAKLEY_1311_WebsiteSnippet.mp4"
                        autoPlay
                      ></video>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="w-node-aa9e3a5a-b311-be9f-6c44-62316b4bc69c-256fe6a4" data-w-id="aa9e3a5a-b311-be9f-6c44-62316b4bc69c" className="proj-next-trigger">
            <div className="w-dyn-list">
              <div id="listNext" role="list" className="w-dyn-items">
                <div project-title="Galaxy Watch8 Series" role="listitem" className="proj-item w-dyn-item" data-index="0" style={{}}>
                  <Link
                    to="/project/samsung-wearables"
                    className="proj-mover w-inline-block"
                  >
                    <div className="proj-mover-title-wrp">
                      <div className="t-large t-gray">Next Project</div>
                      <div className="t-large t-gray mov-next">→</div>
                    </div>
                    <div className="t-large">Galaxy Watch8 Series</div>
                  </Link>
                  <div
                    className="index-hover"
                    style={{ willChange: "transform", transform: "translate3d(0vw, 0vh, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", transformStyle: "preserve-3d" }}
                  >
                    <div className="index-hover-vid w-embed">
                      <video
                        data-src="https://cdn.styleframe.de/Samsung_Wearables/SNIPPET_SAMSUNG_WEARABLES.mp4"
                        poster="https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/69023aab725e99851044f4b2_Samsung_Wearables_Watches_10s_PACKSHOT_WEB.avif"
                        disablePictureInPicture
                        disableRemotePlayback
                        x-webkit-airplay="deny"
                        playsInline
                        muted
                        preload="none"
                        style={{ height: "100%", width: "100%", objectFit: "cover" }}
                        src="https://cdn.styleframe.de/Samsung_Wearables/SNIPPET_SAMSUNG_WEARABLES.mp4"
                        autoPlay
                      ></video>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div data-w-id="d636055f-4a21-6155-01a4-3396fc0d09e3" className="footer">
        <div className="container">
          <div id="w-node-d636055f-4a21-6155-01a4-3396fc0d09e5-fc0d09e3" className="footer-column">
            <div className="t-small">© Styleframe</div>
          </div>
          <div id="w-node-d636055f-4a21-6155-01a4-3396fc0d09e8-fc0d09e3" className="footer-column">
            <a
              href="https://www.instagram.com/styleframe.studio/"
              target="_blank"
              className="link footer-link right-up-arrow"
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/company/styleframe"
              target="_blank"
              className="link footer-link right-up-arrow"
            >
              LinkedIn
            </a>
            <a
              href="https://www.behance.net/styleframe"
              target="_blank"
              className="link footer-link right-up-arrow"
            >
              Behance
            </a>
            <a
              href="https://vimeo.com/styleframe"
              target="_blank"
              className="link footer-link right-up-arrow"
            >
              Vimeo
            </a>
            <a
              href="https://www.instagram.com/echologic.lab/"
              target="_blank"
              className="link footer-link right-up-arrow"
            >
              AI Lab
            </a>
          </div>
          <div id="w-node-d636055f-4a21-6155-01a4-3396fc0d09ef-fc0d09e3" className="footer-column">
            <a href="/legal/privacy-policy" className="link footer-link fl-small">
              Privacy Policy
            </a>
            <a href="/legal/imprint" className="link footer-link fl-small">
              Imprint
            </a>
          </div>
          <div id="w-node-d636055f-4a21-6155-01a4-3396fc0d09f4-fc0d09e3" className="footer-column">
            <a href="/project-index" className="link footer-link right-arrow">
              Index
            </a>
            <a href="/research" className="link footer-link right-arrow">
              Research
            </a>
            <a href="/team" className="link footer-link right-arrow">
              Team
            </a>
            <div
              data-w-id="d636055f-4a21-6155-01a4-3396fc0d09fb"
              className="link footer-link"
              onClick={() => setIsContactOpen(true)}
            >
              Contact
            </div>
          </div>
        </div>
        <div className="footer-logo-cont">
          <div className="footer-logo-wrp">
            <div className="footer-logo-frame">
              <div className="logo-frame-wrp">
                <div className="collection-list-wrp-logo-anim w-dyn-list">
                  <div role="list" className="collection-list-logo-anim w-dyn-items">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42f32e179658fc220ff71_20.avif")`,
                          display: i === 19 ? "block" : "none",
                        }}
                        role="listitem"
                        className="collection-item-logo-anim w-dyn-item"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="footer-logo-s"></div>
            <div className="footer-logo-r"></div>
          </div>
        </div>
      </div>
    </div>
  );
}