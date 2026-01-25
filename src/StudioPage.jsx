import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

function StudioPage() {
  const cursorPackRef = useRef(null);
  const defaultCursorRef = useRef(null);
  const linkCursorRef = useRef(null);
  const [cursorType, setCursorType] = useState("default");
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

  // GSAP Text Animations
  useEffect(() => {
    const initializeAnimations = () => {
      if (typeof window !== "undefined") {
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
      }

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

    const timer = setTimeout(initializeAnimations, 500);
    return () => clearTimeout(timer);
  }, []);

  // Team drag functionality
  useEffect(() => {
    const scroller = document.querySelector(".cms-list-team");
    if (!scroller) return;

    const IS_DESKTOP = window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;

    if (!IS_DESKTOP) return;

    const SPEED = 1;
    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;
    let activePointerId = null;

    function onPointerDown(e) {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      isDragging = true;
      activePointerId = e.pointerId;
      startX = e.clientX;
      startScrollLeft = scroller.scrollLeft;
      scroller.setPointerCapture?.(activePointerId);
    }

    function onPointerMove(e) {
      if (!isDragging || e.pointerId !== activePointerId) return;
      if (e.cancelable) e.preventDefault();
      const dx = (e.clientX - startX) * SPEED;
      scroller.scrollLeft = startScrollLeft - dx;
    }

    function endDrag(e) {
      if (!isDragging || (e && e.pointerId !== activePointerId)) return;
      isDragging = false;
      try {
        scroller.releasePointerCapture?.(activePointerId);
      } catch {}
      activePointerId = null;
    }

    scroller.addEventListener("pointerdown", onPointerDown, { passive: true });
    scroller.addEventListener("pointermove", onPointerMove, { passive: false });
    scroller.addEventListener("pointerup", endDrag, { passive: true });
    scroller.addEventListener("pointercancel", endDrag, { passive: true });
    scroller.addEventListener("pointerleave", (e) => {
      if (!scroller.hasPointerCapture?.(activePointerId)) endDrag(e);
    }, { passive: true });

    window.addEventListener("blur", () => endDrag({ pointerId: activePointerId }), { passive: true });

    return () => {
      scroller.removeEventListener("pointerdown", onPointerDown);
      scroller.removeEventListener("pointermove", onPointerMove);
      scroller.removeEventListener("pointerup", endDrag);
      scroller.removeEventListener("pointercancel", endDrag);
    };
  }, []);

  return (
    <>
      <div className="navbar">
        <div className="navbar-main-wrp">
          <div className="navbar-logo-wrp">
            <Link to="/" className="logo link w-inline-block"></Link>
          </div>
          <div id="w-node-f189272f-6638-5b12-d5b7-2dd5adebb21e-d64e909a" className="navbar-dt-wrp">
            <div className="navbar-link-wrp">
              <Link to="/project-index" className="link navbar-link">Index</Link>
              <Link to="/research" className="link navbar-link">Research</Link>
              <Link to="/studio" className="link navbar-link w--current" aria-current="page">Studio</Link>
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
          <div id="w-node-_695dd12c-82a5-a52d-8f5b-486dd64e909c-d64e909a" className="menu-icon">
            <div className="menu-icon-line"></div>
            <div className="menu-icon-line mi-2"></div>
          </div>
        </div>
        <div className="navbar-mob-wrp">
          <div className="navbar-link-wrp">
            <Link to="/project-index" className="link navbar-link">Index</Link>
            <Link to="/research" className="link navbar-link">Research</Link>
            <Link to="/studio" className="link navbar-link w--current" aria-current="page">Studio</Link>
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
          <div id="videocontrol-play-btn" className="videocontrol-play-btn">Play</div>
        </div>
        <div className="drag-helper">Drag</div>
        <div className="team-drag">Drag</div>
      </div>

      <div className="section hero-studio">
        <div data-w-id="41581821-281b-5340-029b-f2cb43f3ec89" className="studio-heading-wrp">
          <h1 id="w-node-_3b410aeb-a2d0-349a-44a3-4d43b6c0bed9-256fe6c8" className="studio-heading">
            Shaping<br />thoughts
          </h1>
        </div>
        <div data-w-id="bac6ccc3-b1b3-4b34-bec7-e9322b305e2a" className="studio-heading-wrp">
          <div
            words-slide-up=""
            text-split=""
            id="w-node-_531d84bb-34db-2cf5-f00c-83ae8951effc-256fe6c8"
            className="studio-heading t-primary"
          >
            into iconic<br />visuals.
          </div>
        </div>
        <div className="collection-list-wrp-stud w-dyn-list">
          <div role="list" className="collection-list-stud w-dyn-items">
            <div
              style={{
                backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68ee6ddf3fc3885121b907ee_Studio_Edit_Selection_Web_v001_0010.avif")`,
              }}
              role="listitem"
              className="collection-item-stud w-dyn-item"
            >
              <div className="studio-hero-img"></div>
            </div>
            <div
              style={{
                backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/690a2b03914f559250f8572a_Studio_Edit_Selection_Web_v002_0000_0000_SF_Studio_Edit_v2-52.avif")`,
              }}
              role="listitem"
              className="collection-item-stud w-dyn-item"
            >
              <div className="studio-hero-img"></div>
            </div>
            <div
              style={{
                backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/690509e32cb72754ae848f6a_SF_Studio_Edit_v2-53%20(1).avif")`,
              }}
              role="listitem"
              className="collection-item-stud w-dyn-item"
            >
              <div className="studio-hero-img"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="section pad-5">
        <div className="container _2-grid">
          <div id="w-node-a015b895-5327-9b52-18a8-86eb25046afe-256fe6c8">
            <div words-slide-up="" text-split="" className="t-large">
              The studio's process is rooted in careful listening, clear planning,
              and meticulous execution. Each project begins with a shared
              understanding of objectives, developing into visuals that are both
              impactful and enduring.<br /><br />Styleframe offers expertise
              across visual effects, post-production, creative direction,
              animation direction, and CGI production. Each service is tailored to
              the needs of the project, ensuring flexibility while maintaining
              uncompromising standards.
            </div>
          </div>
          <div id="w-node-_34137bb5-6e30-fef7-98ba-ce3c58c7b13e-256fe6c8">
            <div words-slide-up="" text-split="" className="t-large">
              Dedicated research and look development keep the studio at the
              forefront of technology and aesthetics. Every commission is an
              opportunity to refine methods, push boundaries, and deliver visuals
              that resonate.
            </div>
          </div>
        </div>
        <div className="container _2-grid">
          <div id="w-node-f93ddf6f-87e1-b663-a6c1-6b9a31b54410-256fe6c8">
            <div className="gap-40"></div>
            <div words-slide-up="" text-split="" className="list-title">
              <strong>Services</strong>
            </div>
            <div className="gap-20"></div>
            <div className="w-dyn-list">
              <div role="list" className="service-list w-dyn-items">
                <div role="listitem" className="service-item w-dyn-item">
                  <div>3D Motion</div>
                </div>
                <div role="listitem" className="service-item w-dyn-item">
                  <div>Conception &amp; Design</div>
                </div>
                <div role="listitem" className="service-item w-dyn-item">
                  <div>Research &amp; Visual Development</div>
                </div>
                <div role="listitem" className="service-item w-dyn-item">
                  <div>Creative, Art &amp; Animation Direction</div>
                </div>
                <div role="listitem" className="service-item w-dyn-item">
                  <div>CGI Still &amp; Animation Production</div>
                </div>
                <div role="listitem" className="service-item w-dyn-item">
                  <div>AI Direction &amp; Execution</div>
                </div>
                <div role="listitem" className="service-item w-dyn-item">
                  <div>Visual Effects</div>
                </div>
              </div>
            </div>
          </div>
          <div id="w-node-f93ddf6f-87e1-b663-a6c1-6b9a31b5441e-256fe6c8">
            <div className="gap-40"></div>
            <div words-slide-up="" text-split="" className="list-title">
              <strong>Selected Clients</strong>
            </div>
            <div className="gap-20"></div>
            <div className="w-dyn-list">
              <div role="list" className="client-list w-dyn-items">
                <div words-slide-up="" text-split="" role="listitem" className="w-dyn-item">
                  <div>Audi</div>
                </div>
                <div words-slide-up="" text-split="" role="listitem" className="w-dyn-item">
                  <div>Bose</div>
                </div>
                <div words-slide-up="" text-split="" role="listitem" className="w-dyn-item">
                  <div>Deutsche Bank</div>
                </div>
                <div words-slide-up="" text-split="" role="listitem" className="w-dyn-item">
                  <div>Ferrero</div>
                </div>
                <div words-slide-up="" text-split="" role="listitem" className="w-dyn-item">
                  <div>Hatton Labs</div>
                </div>
                <div words-slide-up="" text-split="" role="listitem" className="w-dyn-item">
                  <div>Lionsgate</div>
                </div>
                <div words-slide-up="" text-split="" role="listitem" className="w-dyn-item">
                  <div>Michelin</div>
                </div>
                <div words-slide-up="" text-split="" role="listitem" className="w-dyn-item">
                  <div>Microsoft</div>
                </div>
                <div words-slide-up="" text-split="" role="listitem" className="w-dyn-item">
                  <div>Moncler</div>
                </div>
                <div words-slide-up="" text-split="" role="listitem" className="w-dyn-item">
                  <div>Nickelodeon</div>
                </div>
                <div words-slide-up="" text-split="" role="listitem" className="w-dyn-item">
                  <div>Oakley</div>
                </div>
                <div words-slide-up="" text-split="" role="listitem" className="w-dyn-item">
                  <div>Opel</div>
                </div>
                <div words-slide-up="" text-split="" role="listitem" className="w-dyn-item">
                  <div>Ray-Ban</div>
                </div>
                <div words-slide-up="" text-split="" role="listitem" className="w-dyn-item">
                  <div>Samsung</div>
                </div>
                <div words-slide-up="" text-split="" role="listitem" className="w-dyn-item">
                  <div>Sonra</div>
                </div>
                <div words-slide-up="" text-split="" role="listitem" className="w-dyn-item">
                  <div>rabbit</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="gap-80"></div>
        <div className="gap-80"></div>
      </div>

      <div className="section studio-interior">
        <div className="w-dyn-list">
          <div fs-cmsslider-element="list" role="list" className="w-dyn-items">
            <div
              style={{
                backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/690a2b20cddfb71d5949e555_Studio_Edit_Selection_Web_v002_0000_0013_SF_Studio_Edit_v2-39.avif")`,
              }}
              role="listitem"
              className="slider-item w-dyn-item"
            ></div>
            <div
              style={{
                backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/690a2b03914f559250f8572a_Studio_Edit_Selection_Web_v002_0000_0000_SF_Studio_Edit_v2-52.avif")`,
              }}
              role="listitem"
              className="slider-item w-dyn-item"
            ></div>
            <div
              style={{
                backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/690509e32cb72754ae848f6a_SF_Studio_Edit_v2-53%20(1).avif")`,
              }}
              role="listitem"
              className="slider-item w-dyn-item"
            ></div>
            <div
              style={{
                backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f9f883cf09f60d16bd7e90_Studio_Edit_Selection_Web_v002_0000_0024_SF_Studio_Edit_v2-28.avif")`,
              }}
              role="listitem"
              className="slider-item w-dyn-item"
            ></div>
            <div
              style={{
                backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f9f7c9448e01ee222c4792_Studio_Edit_Selection_Web_v002_0000_0043_SF_Studio_Edit_v2-9.avif")`,
              }}
              role="listitem"
              className="slider-item w-dyn-item"
            ></div>
            <div
              style={{
                backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f9f7d13ea4e2beff5d1cf7_Studio_Edit_Selection_Web_v002_0000_0014_SF_Studio_Edit_v2-38.avif")`,
              }}
              role="listitem"
              className="slider-item w-dyn-item"
            ></div>
            <div
              style={{
                backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f9f7d948381a19e7aa0f31_Studio_Edit_Selection_Web_v002_0000_0027_SF_Studio_Edit_v2-25b.avif")`,
              }}
              role="listitem"
              className="slider-item w-dyn-item"
            ></div>
            <div
              style={{
                backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f9f7e44691e0454e399c1d_Studio_Edit_Selection_Web_v002_0000_0010_SF_Studio_Edit_v2-42.avif")`,
              }}
              role="listitem"
              className="slider-item w-dyn-item"
            ></div>
            <div
              style={{
                backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f9f80438b622db140ec8e1_Studio_Edit_Selection_Web_v002_0000_0034_SF_Studio_Edit_v2-19.avif")`,
              }}
              role="listitem"
              className="slider-item w-dyn-item"
            ></div>
            <div
              style={{
                backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f9f80c89799113b8c98300_Studio_Edit_Selection_Web_v002_0000_0041_SF_Studio_Edit_v2-11.avif")`,
              }}
              role="listitem"
              className="slider-item w-dyn-item"
            ></div>
            <div
              style={{
                backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f9f814483fcea9103d2b49_Studio_Edit_Selection_Web_v002_0000_0004_SF_Studio_Edit_v2-48.avif")`,
              }}
              role="listitem"
              className="slider-item w-dyn-item"
            ></div>
            <div
              style={{
                backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f9f821e8dbfe6ba3373af5_Studio_Edit_Selection_Web_v002_0000_0035_SF_Studio_Edit_v2-18.avif")`,
              }}
              role="listitem"
              className="slider-item w-dyn-item"
            ></div>
            <div
              style={{
                backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f9f828873523313595236c_Studio_Edit_Selection_Web_v002_0000_0001_SF_Studio_Edit_v2-51.avif")`,
              }}
              role="listitem"
              className="slider-item w-dyn-item"
            ></div>
            <div
              style={{
                backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68ee6ddf3fc3885121b907ee_Studio_Edit_Selection_Web_v001_0010.avif")`,
              }}
              role="listitem"
              className="slider-item w-dyn-item"
            ></div>
            <div
              style={{
                backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f9f831e3f913223df5df33_Studio_Edit_Selection_Web_v002_0000_0011_SF_Studio_Edit_v2-41.avif")`,
              }}
              role="listitem"
              className="slider-item w-dyn-item"
            ></div>
          </div>
        </div>
        <div
          data-delay="3000"
          data-animation="fade"
          className="slider w-slider"
          data-autoplay="true"
          data-easing="ease"
          data-hide-arrows="false"
          data-disable-swipe="true"
          data-autoplay-limit="0"
          data-nav-spacing="3"
          data-duration="500"
          data-infinite="true"
          fs-cmsslider-element="slider"
          fs-cmsslider-resetix="true"
        >
          <div className="w-slider-mask">
            <div className="w-slide"></div>
          </div>
        </div>
      </div>

      <div className="section team-title-wrp">
        <h2 className="team-heading">Team</h2>
      </div>

      <div className="section studio-team">
        <div className="cms-list-wrp-team w-dyn-list">
          <div role="list" className="cms-list-team w-dyn-items">
            <div item="robin" role="listitem" className="cms-item-team w-dyn-item">
              <div className="team-name">Robin</div>
              <div className="team-title">Founder &amp; CEO</div>
              <div
                style={{
                  backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68ee35284412b64fabb6a434_SF_Portraits_Robin_Final_Blur.avif")`,
                }}
                className="team-photo"
              ></div>
            </div>
            <div item="tim" role="listitem" className="cms-item-team w-dyn-item">
              <div className="team-name">Tim</div>
              <div className="team-title">3D Designer</div>
              <div
                style={{
                  backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68ee35013dd7d3f72fcabcd1_SF_Portraits_Tim_Final_Blur.avif")`,
                }}
                className="team-photo"
              ></div>
            </div>
            <div item="leon" role="listitem" className="cms-item-team w-dyn-item">
              <div className="team-name">Leon</div>
              <div className="team-title">Art Director</div>
              <div
                style={{
                  backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68ee354d777ee4ff4b6c96ab_SF_Portraits_Leon_Final_Blur.avif")`,
                }}
                className="team-photo"
              ></div>
            </div>
            <div item="susanne" role="listitem" className="cms-item-team w-dyn-item">
              <div className="team-name">Susanne</div>
              <div className="team-title">Digital Artist</div>
              <div
                style={{
                  backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f0ffe81feb96d1aab1818c_SF_Portraits_Susanne_Final_Blur_v2.avif")`,
                }}
                className="team-photo"
              ></div>
            </div>
            <div item="lorenzo" role="listitem" className="cms-item-team w-dyn-item">
              <div className="team-name">Lorenzo</div>
              <div className="team-title">Producer</div>
              <div
                style={{
                  backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68ee35368c68ed7d1a4c30aa_SF_Portraits_Lorenzo_Final_Blur.avif")`,
                }}
                className="team-photo"
              ></div>
            </div>
            <div item="denys" role="listitem" className="cms-item-team w-dyn-item">
              <div className="team-name">Denys</div>
              <div className="team-title">3D Designer</div>
              <div
                style={{
                  backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68ee353d562ff2e2a5f4adf8_SF_Portraits_Denys_Final_Blur.avif")`,
                }}
                className="team-photo"
              ></div>
            </div>
            <div item="shirley" role="listitem" className="cms-item-team w-dyn-item">
              <div className="team-name">Shirley</div>
              <div className="team-title">Producer</div>
              <div
                style={{
                  backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68ee352248913abd5ae9598d_SF_Portraits_Shirley_Final_Blur.avif")`,
                }}
                className="team-photo"
              ></div>
            </div>
            <div item="colin" role="listitem" className="cms-item-team w-dyn-item">
              <div className="team-name">Colin</div>
              <div className="team-title">Director &amp; Editor</div>
              <div
                style={{
                  backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68ee35566f7ab6229138a2b4_SF_Portraits_Colin_Final_Blur.avif")`,
                }}
                className="team-photo"
              ></div>
            </div>
            <div item="lukas" role="listitem" className="cms-item-team w-dyn-item">
              <div className="team-name">Lukas</div>
              <div className="team-title">3D Designer</div>
              <div
                style={{
                  backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68ee352e562ff2e2a5f4aa40_SF_Portraits_Lukas_Final_Blur.avif")`,
                }}
                className="team-photo"
              ></div>
            </div>
            <div item="andre" role="listitem" className="cms-item-team w-dyn-item">
              <div className="team-name">Andre</div>
              <div className="team-title">3D Designer / TD</div>
              <div
                style={{
                  backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68ee355e74d0eff38a24440a_SF_Portraits_Andre_Final_Blur.avif")`,
                }}
                className="team-photo"
              ></div>
            </div>
            <div item="victor" role="listitem" className="cms-item-team w-dyn-item">
              <div className="team-name">Victor</div>
              <div className="team-title">3D Designer</div>
              <div
                style={{
                  backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68ee354313087b95211028b8_SF_Portraits_Victor_Final_Blur.avif")`,
                }}
                className="team-photo"
              ></div>
            </div>
            <div item="janic" role="listitem" className="cms-item-team w-dyn-item">
              <div className="team-name">Janic</div>
              <div className="team-title">3D Designer</div>
              <div
                style={{
                  backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68ee350e62d9c1fccfde9981_SF_Portraits_Jannic_Final_Blur.avif")`,
                }}
                className="team-photo"
              ></div>
            </div>
          </div>
        </div>
      </div>

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
            <a href="tel:+496994946890">+49 69 9494 689-0</a>
            <br />
          </div>
          <div className="t-large t-white">
            <a href="mailto:info@styleframe.de" className="link">info@styleframe.de</a>
            <br />
          </div>
        </div>
        <div className="t-large t-white">
          Hanauer Landstr. 287<br />60314 Frankfurt am<br />Main, Germany
        </div>
        <a
          href="https://maps.app.goo.gl/iqJ7Bt22FuPA7EKA7"
          target="_blank"
          rel="noopener noreferrer"
          className="link t-white-50"
        >
          Map ↗
        </a>
        <div className="link-wrp">
          <a href="https://www.instagram.com/styleframe.studio/" target="_blank" rel="noopener noreferrer" className="link t-large">
            ↗ Instagram
          </a>
          <a href="https://www.linkedin.com/company/styleframe" target="_blank" rel="noopener noreferrer" className="link t-large">
            ↗ LinkedIn
          </a>
          <a href="https://www.behance.net/styleframe" target="_blank" rel="noopener noreferrer" className="link t-large">
            ↗ Behance
          </a>
          <a href="https://vimeo.com/styleframe" target="_blank" rel="noopener noreferrer" className="link t-large">
            ↗ Vimeo
          </a>
          <a href="https://www.instagram.com/echologic.lab/" target="_blank" rel="noopener noreferrer" className="link t-large">
            ↗ AI Lab
          </a>
        </div>
      </div>

      <div className="footer">
        <div className="container">
          <div id="w-node-d636055f-4a21-6155-01a4-3396fc0d09e5-fc0d09e3" className="footer-column">
            <div className="t-small">© Styleframe</div>
          </div>
          <div id="w-node-d636055f-4a21-6155-01a4-3396fc0d09e8-fc0d09e3" className="footer-column">
            <a href="https://www.instagram.com/styleframe.studio/" target="_blank" rel="noopener noreferrer" className="link footer-link right-up-arrow">
              Instagram
            </a>
            <a href="https://www.linkedin.com/company/styleframe" target="_blank" rel="noopener noreferrer" className="link footer-link right-up-arrow">
              LinkedIn
            </a>
            <a href="https://www.behance.net/styleframe" target="_blank" rel="noopener noreferrer" className="link footer-link right-up-arrow">
              Behance
            </a>
            <a href="https://vimeo.com/styleframe" target="_blank" rel="noopener noreferrer" className="link footer-link right-up-arrow">
              Vimeo
            </a>
            <a href="https://www.instagram.com/echologic.lab/" target="_blank" rel="noopener noreferrer" className="link footer-link right-up-arrow">
              AI Lab
            </a>
          </div>
          <div id="w-node-d636055f-4a21-6155-01a4-3396fc0d09ef-fc0d09e3" className="footer-column">
            <Link to="/legal/privacy-policy" className="link footer-link fl-small">Privacy Policy</Link>
            <Link to="/legal/imprint" className="link footer-link fl-small">Imprint</Link>
          </div>
          <div id="w-node-d636055f-4a21-6155-01a4-3396fc0d09f4-fc0d09e3" className="footer-column">
            <Link to="/project-index" className="link footer-link right-arrow">Index</Link>
            <Link to="/research" className="link footer-link right-arrow">Research</Link>
            <Link to="/studio" className="link footer-link right-arrow w--current" aria-current="page">Studio</Link>
            <div
              className="link footer-link"
              onClick={() => setIsContactOpen(true)}
              style={{ cursor: "pointer" }}
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
                    <div style={{ backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42f32e179658fc220ff71_20.avif")` }} role="listitem" className="collection-item-logo-anim w-dyn-item"></div>
                    <div style={{ backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42f2a1bc30a29cc9dde23_19.avif")` }} role="listitem" className="collection-item-logo-anim w-dyn-item"></div>
                    <div style={{ backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42ea7b8caf2e461da972d_18.avif")` }} role="listitem" className="collection-item-logo-anim w-dyn-item"></div>
                    <div style={{ backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42e9dab059fd303cb59bb_17.avif")` }} role="listitem" className="collection-item-logo-anim w-dyn-item"></div>
                    <div style={{ backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42e8c9b02ae0d1681b7b8_16.avif")` }} role="listitem" className="collection-item-logo-anim w-dyn-item"></div>
                    <div style={{ backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42cb457683fdcaecf34aa_15.avif")` }} role="listitem" className="collection-item-logo-anim w-dyn-item"></div>
                    <div style={{ backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42cabbf94893911f30b8d_14.avif")` }} role="listitem" className="collection-item-logo-anim w-dyn-item"></div>
                    <div style={{ backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42ca28d03c1d72159ab26_13.avif")` }} role="listitem" className="collection-item-logo-anim w-dyn-item"></div>
                    <div style={{ backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42c954de027a2c9aa384c_12.avif")` }} role="listitem" className="collection-item-logo-anim w-dyn-item"></div>
                    <div style={{ backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42c84894ff1d8f915df24_11.avif")` }} role="listitem" className="collection-item-logo-anim w-dyn-item"></div>
                    <div style={{ backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6886834949596497c68bf5b1_686e821bdf1767b3c81c36e8_231030_RND_DK_010_orangehintergrund_v2%20fog%20Large.avif")` }} role="listitem" className="collection-item-logo-anim w-dyn-item"></div>
                    <div style={{ backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/688683406e8226dcdd61a12c_6867e107b4d400ad20ad39dd_230303_Firstcolo_Broschure_Rnd_001c_blueAkzent_01%20Large.avif")` }} role="listitem" className="collection-item-logo-anim w-dyn-item"></div>
                    <div style={{ backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68868334c66e32973ba66caf_686685c2c0df48ad320a646c_230124_OP1_v003_1_Main_0001%20Large.avif")` }} role="listitem" className="collection-item-logo-anim w-dyn-item"></div>
                    <div style={{ backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6886832b826db4c61cb8afcf_686695b490c6187b4302ded1_We_are_Rewind_Ghetto_Blaster_1x1_07%20Large.avif")` }} role="listitem" className="collection-item-logo-anim w-dyn-item"></div>
                    <div style={{ backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/688682a866bb85d741dbe468_6862aa2bcc68d0ad5ce0ed3a_mars_cover.avif")` }} role="listitem" className="collection-item-logo-anim w-dyn-item"></div>
                    <div style={{ backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68868319d36be5e41a195460_6867c4009b5aeeeb46555855_RND_dk_011_0031.avif")` }} role="listitem" className="collection-item-logo-anim w-dyn-item"></div>
                    <div style={{ backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/688683100007bdc0d6b8d0c4_6867d7d6a8c71bddc3942a28_2.avif")` }} role="listitem" className="collection-item-logo-anim w-dyn-item"></div>
                    <div style={{ backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/688682ff1da9335baedef285_6867f5123aa787b54ba2cafe_7.avif")` }} role="listitem" className="collection-item-logo-anim w-dyn-item"></div>
                    <div style={{ backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/688682fa186bbdce6c8fe845_686bf6bd7fb6fdadca975d14_cover%20image-web-497237698_18509548351001463_3505879398570363264_n.avif")` }} role="listitem" className="collection-item-logo-anim w-dyn-item"></div>
                    <div style={{ backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/688682a866bb85d741dbe468_6862aa2bcc68d0ad5ce0ed3a_mars_cover.avif")` }} role="listitem" className="collection-item-logo-anim w-dyn-item"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer-logo-s"></div>
            <div className="footer-logo-r"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudioPage;
