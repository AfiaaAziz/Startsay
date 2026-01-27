import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { projects, getAdjacentProjects } from "../data/projects";
import { useVideoPlayer } from "../hooks/useVideoPlayer";
import "./ProjectPage.css";

gsap.registerPlugin(ScrollTrigger);

function ProjectPage() {
  const { projectSlug } = useParams();
  const project = projects[projectSlug];

  const cursorPackRef = useRef(null);
  const defaultCursorRef = useRef(null);
  const linkCursorRef = useRef(null);
  const [cursorType, setCursorType] = useState("default");
  const [isContactOpen, setIsContactOpen] = useState(false);

  const { previous, next } = getAdjacentProjects(projectSlug);

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

    const handleLinkHover = () => setCursorType("link");
    const handleLinkLeave = () => setCursorType("default");

    const links = document.querySelectorAll("a, button, .link, .project-card");
    links.forEach((link) => {
      link.addEventListener("mouseenter", handleLinkHover);
      link.addEventListener("mouseleave", handleLinkLeave);
    });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrame);
      links.forEach((link) => {
        link.removeEventListener("mouseenter", handleLinkHover);
        link.removeEventListener("mouseleave", handleLinkLeave);
      });
    };
  }, []);

  useEffect(() => {
    const init = () => {
      new SplitType("[text-split]", {
        types: "words, chars",
        tagName: "span",
      });
      const $$ = (sel) => Array.from(document.querySelectorAll(sel));
      const create = (el, tl) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          onLeaveBack: () => {
            tl.progress(0);
            tl.pause();
          },
        });
        ScrollTrigger.create({
          trigger: el,
          start: "top 80%",
          onEnter: () => tl.play(),
        });
      };
      $$("[words-slide-up]").forEach((el) => {
        let tl = gsap.timeline({ paused: true });
        tl.from(el.querySelectorAll(".word"), {
          opacity: 0,
          yPercent: 100,
          duration: 0.5,
          ease: "power2.out(2)",
          stagger: { amount: 0.5 },
        });
        create(el, tl);
      });
      gsap.set("[text-split]", { opacity: 1 });
    };
    const t = setTimeout(init, 300);
    return () => clearTimeout(t);
  }, []);

  // Handle contact banner cursor color
  useEffect(() => {
    const cursorPack = cursorPackRef.current;
    if (!cursorPack) return;

    const defaultCursor = cursorPack.querySelector(".default-cursor");
    const linkCursor = cursorPack.querySelector(".link-cursor");
    const dragCursor = cursorPack.querySelector(".drag-cursor");
    const resizeCursor = cursorPack.querySelector(".resize-cursor");
    const videoCursor = cursorPack.querySelector(".video-cursor");
    const dragHelper = cursorPack.querySelector(".drag-helper");
    const teamDrag = cursorPack.querySelector(".team-drag");

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

    const handleContactHover = (e) => {
      if (e.target.closest(".contact-banner")) {
        addContactBannerCursor();
      }
    };

    const handleContactLeave = (e) => {
      if (!e.relatedTarget || !e.relatedTarget.closest(".contact-banner")) {
        removeContactBannerCursor();
      }
    };

    document.addEventListener("mouseover", handleContactHover);
    document.addEventListener("mouseout", handleContactLeave);

    return () => {
      document.removeEventListener("mouseover", handleContactHover);
      document.removeEventListener("mouseout", handleContactLeave);
    };
  }, []);

  // 404 check
  if (!project) {
    return (
      <div className="app-container">
        <div
          className="section"
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>
            <h1 className="t-large">Project Not Found</h1>
            <Link to="/" className="link">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="loader">
        <div
          data-w-id="b8bdbb27-d710-8937-fa2d-e2ff10981e1c"
          className="loader-logo-cont"
        >
          <div className="footer-logo-wrp">
            <div className="footer-logo-frame">
              <div className="logo-frame-wrp">
                <div className="collection-list-wrp-logo-anim w-dyn-list">
                  <div
                    role="list"
                    className="collection-list-logo-anim w-dyn-items"
                  >
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42f32e179658fc220ff71_20.avif")`,
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

      <div className="navbar">
        <div className="navbar-main-wrp">
          <div className="navbar-logo-wrp">
            <Link to="/" className="logo link w-inline-block"></Link>
          </div>
          <div className="navbar-dt-wrp">
            <div className="navbar-link-wrp">
              <Link to="/project-index" className="link navbar-link">
                Index
              </Link>
              <Link to="/research" className="link navbar-link">
                Research
              </Link>
              <Link to="/studio" className="link navbar-link">
                Studio
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
      </div>

      <div
        id="cursor-pack"
        data-w-id="ffc94e13-05f2-5027-2033-6946e0d01232"
        className="cursor-pack"
        ref={cursorPackRef}
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

      {/* Project Hero Section */}
      <div className="section project-hero">
        {project.heroVideo ? (
          <div className="project-hero-video">
            <video
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              className="project-hero-video-el"
            >
              <source src={project.heroVideo} type="video/mp4" />
            </video>
            <div className="project-hero-overlay"></div>
          </div>
        ) : (
          <div
            className="project-hero-image"
            style={{ backgroundImage: `url("${project.heroImage}")` }}
          >
            <div className="project-hero-overlay"></div>
          </div>
        )}
        <div className="project-hero-content">
          <div className="container">
            <div
              words-slide-up=""
              text-split=""
              style={{ display: "inline-block" }}
            >
              <div className="t-small t-gray">Year</div>
              <div className="gap-40"></div>
              <div className="t-large">{project.year}</div>
            </div>
            <div className="gap-40"></div>
            <div
              words-slide-up=""
              text-split=""
              style={{ display: "inline-block" }}
            >
              <div className="t-small t-gray">Client</div>
              <div className="gap-40"></div>
              <div className="t-large">{project.client}</div>
            </div>
            <h1 className="project-title">{project.title}</h1>
            {project.category && (
              <p className="project-category">{project.category}</p>
            )}
          </div>
        </div>
      </div>

      {/* Project Description */}
      <div className="section">
        <div className="container">
          <div className="project-description-wrp">
            <div className="project-description">
              <p className="t-large">{project.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Gallery */}
      <div className="section">
        <div className="container">
          <div className="project-gallery w-dyn-list">
            <div role="list" className="project-gallery-grid w-dyn-items">
              {project.gallery.map((image, index) => (
                <div
                  key={index}
                  role="listitem"
                  className="project-gallery-item w-dyn-item"
                >
                  <div
                    className="project-gallery-image"
                    style={{
                      backgroundImage: `url("${image}")`,
                    }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="section project-nav">
        <div className="container">
          <div className="project-nav-wrp">
            {previous && (
              <Link
                to={`/project/${previous.slug}`}
                className="link project-nav-item prev"
              >
                <span className="project-nav-label">Previous</span>
                <span className="project-nav-title">{previous.title}</span>
              </Link>
            )}
            {next && (
              <Link
                to={`/project/${next.slug}`}
                className="link project-nav-item next"
              >
                <span className="project-nav-label">Next</span>
                <span className="project-nav-title">{next.title}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Back to Index */}
      <div className="section">
        <div className="container" style={{ textAlign: "center" }}>
          <Link to="/project-index" className="link l-large right-arrow">
            View All Projects
          </Link>
        </div>
      </div>

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
              <a href="#" className="fs-cc-banner2_text-link">
                Privacy Policy
              </a>{" "}
              for more information.
            </div>
            <div className="fs-cc-banner2_buttons-wrapper">
              <a
                fs-cc="allow"
                href="#"
                className="link fs-cc-banner2_button w-button"
              >
                Accept
              </a>
              <a
                fs-cc="deny"
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
      </div>

      {/* Contact Banner */}
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
        </div>
      </div>

      <div data-w-id="d636055f-4a21-6155-01a4-3396fc0d09e3" className="footer">
        <div className="container">
          <div
            id="w-node-d636055f-4a21-6155-01a4-3396fc0d09e5-fc0d09e3"
            className="footer-column"
          >
            <div className="t-small">© Styleframe</div>
          </div>
          <div
            id="w-node-d636055f-4a21-6155-01a4-3396fc0d09e8-fc0d09e3"
            className="footer-column"
          >
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
          </div>
          <div
            id="w-node-d636055f-4a21-6155-01a4-3396fc0d09ef-fc0d09e3"
            className="footer-column"
          >
            <a
              href="/legal/privacy-policy"
              className="link footer-link fl-small"
            >
              Privacy Policy
            </a>
            <a href="/legal/imprint" className="link footer-link fl-small">
              Imprint
            </a>
          </div>
          <div
            id="w-node-d636055f-4a21-6155-01a4-3396fc0d09f4-fc0d09e3"
            className="footer-column"
          >
            <a href="/project-index" className="link footer-link right-arrow">
              Index
            </a>
            <a href="/research" className="link footer-link right-arrow">
              Research
            </a>
            <a href="/studio" className="link footer-link right-arrow">
              Studio
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

export default ProjectPage;
