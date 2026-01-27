import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export default function MarsPage() {
  const marsImages = [
    "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f0e52c4d8fbc95d05cfa37_13.2.avif",
    "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68fb84fab4ef70a362aa7532_Mars_Stills_Static_Background_Rover_web.avif",
    "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f0e0dcf8c00dfb4a224bd6_2.2.avif",
    "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f0e0e3b587f63e8c69536f_3.2.avif",
    "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68fb8277d242196cfc68802d_Mars_Glasses_Hero_Portait_v003_web.avif",
    "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/688682a866bb85d741dbe468_6862aa2bcc68d0ad5ce0ed3a_mars_cover.avif",
  ];
  const cursorPackRef = useRef(null);
  const defaultCursorRef = useRef(null);
  const linkCursorRef = useRef(null);
  const [cursorType, setCursorType] = useState("default");
  const [isContactOpen, setIsContactOpen] = useState(false);

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
      defaultCursor.style.left = `${cursorX}px`;
      defaultCursor.style.top = `${cursorY}px`;
      linkCursor.style.left = `${cursorX}px`;
      linkCursor.style.top = `${cursorY}px`;
      requestAnimationFrame(animateCursor);
    };
    const animationFrame = requestAnimationFrame(animateCursor);
    const handleLinkHover = () => setCursorType("link");
    const handleLinkLeave = () => setCursorType("default");
    const links = document.querySelectorAll("a, button, .link");
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
    new SplitType("[text-split]", { types: "words, chars", tagName: "span" });
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
  }, []);
  useEffect(() => {
    const items = Array.from(
      document.querySelectorAll(".section-item.w-dyn-item"),
    );
    items.forEach((el) => {
      gsap.set(el, { opacity: 0, y: 40 });
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        onEnter: () =>
          gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }),
        onLeaveBack: () => gsap.set(el, { opacity: 0, y: 40 }),
      });
    });
  }, []);

  return (
    <>
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
          <div className="menu-icon">
            <div className="menu-icon-line"></div>
            <div className="menu-icon-line mi-2"></div>
          </div>
        </div>
      </div>

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

      <div className="section project-hero">
        <div className="project-hero-video">
          <video
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            className="project-hero-video-el"
          >
            <source
              src="https://cdn.styleframe.de/oakley-mars/OAKLEY_MARS_CAMPAIGN_FILM_DirectorsCut_16x9_25SEK_klein.mp4"
              type="video/mp4"
            />
          </video>
          <div className="project-hero-overlay"></div>
        </div>
        <div className="project-hero-content">
          <div className="container">
            <div
              words-slide-up=""
              text-split=""
              style={{ display: "inline-block" }}
            >
              <div className="t-small t-gray">Year</div>
              <div className="gap-40"></div>
              <div className="t-large">2022</div>
            </div>
            <div className="gap-40"></div>
            <div
              words-slide-up=""
              text-split=""
              style={{ display: "inline-block" }}
            >
              <div className="t-small t-gray">Client</div>
              <div className="gap-40"></div>
              <div className="t-large">Oakley</div>
            </div>
            <h1 className="project-title">MUZM Mars</h1>
            <p className="project-category">Campaign Film</p>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="w-dyn-list">
            <div role="list" className="w-dyn-items">
              {marsImages.map((src, i) => (
                <div
                  key={i}
                  role="listitem"
                  className="section-item w-dyn-item"
                  style={{ opacity: 1 }}
                >
                  <div className="section-visuals-wrp">
                    <img
                      src={src}
                      loading="lazy"
                      alt=""
                      className="section-img"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ textAlign: "center" }}>
          <Link to="/project-index" className="link l-large right-arrow">
            View All Projects
          </Link>
        </div>
      </div>
    </>
  );
}
