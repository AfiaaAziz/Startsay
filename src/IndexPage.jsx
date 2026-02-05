import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { useVideoPlayer } from "./hooks/useVideoPlayer";
import Loader from "./components/Loader.jsx";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function IndexPage() {
  const cursorPackRef = useRef(null);
  const defaultCursorRef = useRef(null);
  const linkCursorRef = useRef(null);
  const [cursorType, setCursorType] = useState("default");
  const [isContactOpen, setIsContactOpen] = useState(false);

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

    // Track mouse position
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    document.addEventListener("mousemove", handleMouseMove);

    // Smooth cursor animation loop
    const animateCursor = () => {
      // Smooth interpolation for cursor movement
      const speed = 0.15;
      cursorX += (mouseX - cursorX) * speed;
      cursorY += (mouseY - cursorY) * speed;

      // Position both cursors - they already have transform: translate(-50%, -50%) in CSS
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

    // Start cursor animation
    const animationFrame = requestAnimationFrame(animateCursor);

    // Handle hover states for links and interactive elements
    const handleLinkHover = () => setCursorType("link");
    const handleLinkLeave = () => setCursorType("default");

    // Add hover listeners to all links and interactive elements
    const links = document.querySelectorAll("a, button, .link, .project-card");
    links.forEach((link) => {
      link.addEventListener("mouseenter", handleLinkHover);
      link.addEventListener("mouseleave", handleLinkLeave);
    });

    // Clean up
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
    // Initialize all animations and carousel after component mounts
    const initializeAnimations = () => {
      // Text animations with GSAP
      if (typeof window !== "undefined") {
        const textSplitElements = document.querySelectorAll("[text-split]");
        if (textSplitElements.length > 0) {
          // Split text into spans
          new SplitType("[text-split]", {
            types: "words, chars",
            tagName: "span",
          });
        }

        // Link timelines to scroll position
        function createScrollTriggerAnimation(triggerElement, timeline) {
          if (!timeline) return;
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

        // Set text as visible when present
        if (textSplitElements.length > 0) {
          gsap.set("[text-split]", { opacity: 1 });
        }
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

    // Wait a bit for libraries to load and DOM to settle
    const timer = setTimeout(initializeAnimations, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {}, []);

  // Handle index hover video positioning and visibility
  useEffect(() => {
    const indexItems = document.querySelectorAll(".index-item");

    const handleItemMouseEnter = (e) => {
      const hoverVideo = e.currentTarget.querySelector(".index-hover");
      if (hoverVideo) {
        hoverVideo.style.display = "block";
        hoverVideo.setAttribute("data-visible", "true");
      }
    };

    const handleItemMouseLeave = (e) => {
      const hoverVideo = e.currentTarget.querySelector(".index-hover");
      if (hoverVideo) {
        hoverVideo.style.display = "none";
        hoverVideo.removeAttribute("data-visible");
      }
    };

    const handleMouseMove = (e) => {
      const visibleVideos = document.querySelectorAll(
        ".index-hover[data-visible='true']",
      );
      visibleVideos.forEach((video) => {
        // Get the video dimensions
        const videoWidth = video.offsetWidth || window.innerWidth * 0.25;
        const videoHeight = video.offsetHeight || videoWidth * (9 / 16);

        // Position with offset to center around cursor
        const offsetX = e.clientX - videoWidth / 2;
        const offsetY = e.clientY - videoHeight / 2;

        // Use transform for better performance
        video.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      });
    };

    // Touch Event Handlers
    const handleTouchStart = (e) => {
      const hoverVideo = e.currentTarget.querySelector(".index-hover");
      if (hoverVideo) {
        hoverVideo.style.display = "block";
        hoverVideo.setAttribute("data-visible", "true");
        
        // Immediate position update
        const touch = e.touches[0];
        // Ensure we calculate dimensions correctly even if valid
        const videoWidth = 320; // Fallback or use offsetWidth
        const videoHeight = 180;
        
        // Use clientX/Y which is viewport relative
        const offsetX = touch.clientX - (hoverVideo.offsetWidth || videoWidth) / 2;
        const offsetY = touch.clientY - (hoverVideo.offsetHeight || videoHeight) / 2;
        
        hoverVideo.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      }
    };

    const handleTouchEnd = (e) => {
      const hoverVideo = e.currentTarget.querySelector(".index-hover");
      if (hoverVideo) {
        hoverVideo.style.display = "none";
        hoverVideo.removeAttribute("data-visible");
      }
    };

    const handleTouchMove = (e) => {
       const visibleVideos = document.querySelectorAll(
        ".index-hover[data-visible='true']",
      );
      if (visibleVideos.length > 0) {
          // Prevent scrolling to let the user "drag" the video
          if (e.cancelable) e.preventDefault(); 
          
          const touch = e.touches[0];
          visibleVideos.forEach((video) => {
            const videoWidth = video.offsetWidth || 320;
            const videoHeight = video.offsetHeight || 180;
            
            const offsetX = touch.clientX - videoWidth / 2;
            const offsetY = touch.clientY - videoHeight / 2;
            
            video.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
          });
      }
    };

    indexItems.forEach((item) => {
      item.addEventListener("mouseenter", handleItemMouseEnter);
      item.addEventListener("mouseleave", handleItemMouseLeave);
      
      // Add touch listeners
      // Use passive: false to allow preventDefault (blocking scroll)
      item.addEventListener("touchstart", handleTouchStart, { passive: true });
      item.addEventListener("touchend", handleTouchEnd);
    });

    document.addEventListener("mousemove", handleMouseMove);
    // Use passive: false for touchmove to allow preventing scroll
    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      indexItems.forEach((item) => {
        item.removeEventListener("mouseenter", handleItemMouseEnter);
        item.removeEventListener("mouseleave", handleItemMouseLeave);
        item.removeEventListener("touchstart", handleTouchStart);
        item.removeEventListener("touchend", handleTouchEnd);
      });
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <>
      <Loader />
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
                className="link navbar-link"
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
              className="link navbar-link"
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
      </div>
      <div className="section">
        <div className="gap-120"></div>
        <div className="container">
          <div
            id="w-node-e060aa2e-8755-94e5-ddd9-be93d928de7e-256fe6c6"
            className="table-head"
          >
            <div className="index-1st-col-wrp">
              <div className="t-small">Year</div>
            </div>
            <div
              id="w-node-b33f70e5-7c5e-a17d-742d-332bb7f9776b-256fe6c6"
              className="t-small"
            >
              Client
            </div>
            <div
              id="w-node-_56def625-c6a4-ff87-da40-59d2690f689e-256fe6c6"
              className="t-small"
            >
              Project
            </div>
          </div>
        </div>
        <div className="container">
          <div
            id="w-node-_87d630e8-24c6-78b1-5886-37237d20c0ca-256fe6c6"
            className="index-list-wrp w-dyn-list"
          >
            <div role="list" className="index-list w-dyn-items">
              {/* Samsung Wearables */}
              <div role="listitem" className="index-item w-dyn-item">
                <Link
                  to="/project/samsung-wearables"
                  className="link table-row w-inline-block"
                >
                  <div className="index-1st-col-wrp">
                    <div className="t-large mob-size">2025</div>
                  </div>
                  <div className="t-large">Samsung</div>
                  <div className="t-large">Galaxy Watch8 Series</div>
                </Link>
                <div className="index-hover">
                  <div className="index-hover-vid w-embed">
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      disablePictureInPicture
                      disableRemotePlayback
                      poster="https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/69023aab725e99851044f4b2_Samsung_Wearables_Watches_10s_PACKSHOT_WEB.avif"
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    >
                      <source
                        src="https://cdn.styleframe.de/Samsung_Wearables/SNIPPET_SAMSUNG_WEARABLES.mp4"
                        type="video/mp4"
                      />
                    </video>
                  </div>
                </div>
              </div>

              {/* Oakley Plantaris */}
              <div role="listitem" className="index-item w-dyn-item">
                <Link
                  to="/project/plantaris-ti"
                  className="link table-row w-inline-block"
                >
                  <div className="index-1st-col-wrp">
                    <div className="t-large mob-size">2025</div>
                  </div>
                  <div className="t-large">Oakley</div>
                  <div className="t-large">Plantaris Titanium</div>
                </Link>
                <div className="index-hover">
                  <div className="index-hover-vid w-embed">
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      disablePictureInPicture
                      disableRemotePlayback
                      poster="https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6902375a90fb4818e5e5720f_PLANTARIS_TI_STILL-Life_MAXINE_HERO_V3_16x9_600dpi_web.avif"
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    >
                      <source
                        src="https://cdn.styleframe.de/oakley-plantaris_ti/SNIPPET_PLANTARIS-Ti.mp4"
                        type="video/mp4"
                      />
                    </video>
                  </div>
                </div>
              </div>

              {/* Samsung BnB */}
              <div role="listitem" className="index-item w-dyn-item">
                <Link
                  to="/project/beats-n-buckets"
                  className="link table-row w-inline-block"
                >
                  <div className="index-1st-col-wrp">
                    <div className="t-large mob-size">2025</div>
                  </div>
                  <div className="t-large">Samsung</div>
                  <div className="t-large">Galaxy Z Fold 7 - BnB</div>
                </Link>
                <div className="index-hover">
                  <div className="index-hover-vid w-embed">
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      disablePictureInPicture
                      disableRemotePlayback
                      poster="https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6900e837866d7e691a0e9ae3_SAMSUNG_BnB_OPENING_FINAL_3709_web.avif"
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    >
                      <source
                        src="https://cdn.styleframe.de/Samsung_BeatzNBuckets/SNIPPET-Samsung_BnB_LowRes.mp4"
                        type="video/mp4"
                      />
                    </video>
                  </div>
                </div>
              </div>

              {/* Ray-Ban Innovation Lab */}
              <div role="listitem" className="index-item w-dyn-item">
                <Link
                  to="/project/innovation-lab"
                  className="link table-row w-inline-block"
                >
                  <div className="index-1st-col-wrp">
                    <div className="t-large mob-size">2025</div>
                  </div>
                  <div className="t-large">Ray-Ban</div>
                  <div className="t-large">Innovation Lab</div>
                </Link>
                <div className="index-hover">
                  <div className="index-hover-vid w-embed">
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      disablePictureInPicture
                      disableRemotePlayback
                      poster="https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/69010151686bcc9bfa2af042_Cover_image-v2.avif"
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    >
                      <source
                        src="https://cdn.styleframe.de/ray-ban_innovation_lab/SNIPPET-RayBan_InnovationLab_LowRes.mp4"
                        type="video/mp4"
                      />
                    </video>
                  </div>
                </div>
              </div>

              {/* Oakley Artifacts */}
              <div role="listitem" className="index-item w-dyn-item">
                <Link
                  to="/project/cltr-rdfnd-7nt5r"
                  className="link table-row w-inline-block"
                >
                  <div className="index-1st-col-wrp">
                    <div className="t-large mob-size">2025</div>
                  </div>
                  <div className="t-large">Oakley</div>
                  <div className="t-large">Artifacts from the Future</div>
                </Link>
                <div className="index-hover">
                  <div className="index-hover-vid w-embed">
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      disablePictureInPicture
                      disableRemotePlayback
                      poster="https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6904b145453e177540b455c2_497237698_18509548351001463_3505879398570363264_n_web.avif"
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    >
                      <source
                        src="https://cdn.styleframe.de/OAKLEY_CLTR_RDFND/SNIPPET-OAKLEY_CLTR_RDFND_LowRes.mp4"
                        type="video/mp4"
                      />
                    </video>
                  </div>
                </div>
              </div>

              {/* Wolf & Shepherd */}
              <div role="listitem" className="index-item w-dyn-item">
                <Link
                  to="/project/wolf-shepherd"
                  className="link table-row w-inline-block"
                >
                  <div className="index-1st-col-wrp">
                    <div className="t-large mob-size">2025</div>
                  </div>
                  <div className="t-large">Wolf &amp; Shepherd</div>
                  <div className="t-large">Super</div>
                </Link>
                <div className="index-hover">
                  <div className="index-hover-vid w-embed">
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      disablePictureInPicture
                      disableRemotePlayback
                      poster="https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68ffa2f85f4049d12ecc726e_250305_WS_CGFILM-FINAL_v19_Music_Atmospheric01_00175_web.avif"
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    >
                      <source
                        src="https://cdn.styleframe.de/wolfshepard-film-web/SNIPPET-WOLF_%26_HIRTE_LowRes.mp4"
                        type="video/mp4"
                      />
                    </video>
                  </div>
                </div>
              </div>

              {/* Moncler */}
              <div role="listitem" className="index-item w-dyn-item">
                <Link
                  to="/project/moncler-grenoble"
                  className="link table-row w-inline-block"
                >
                  <div className="index-1st-col-wrp">
                    <div className="t-large mob-size">2025</div>
                  </div>
                  <div className="t-large">Moncler</div>
                  <div className="t-large">Grenoble FW25</div>
                </Link>
                <div className="index-hover">
                  <div className="index-hover-vid w-embed">
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      disablePictureInPicture
                      disableRemotePlayback
                      poster="https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6900efeaf6cde121118c4036_250305_Moncler_Grenoble_Ticket_Cover00164_web.avif"
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    >
                      <source
                        src="https://cdn.styleframe.de/moncler-grenoble-web/SNIPPET-MONCLER_LowRes.mp4"
                        type="video/mp4"
                      />
                    </video>
                  </div>
                </div>
              </div>

              {/* Panel Systems */}
              <div role="listitem" className="index-item w-dyn-item">
                <Link
                  to="/project/szp"
                  className="link table-row w-inline-block"
                >
                  <div className="index-1st-col-wrp">
                    <div className="t-large mob-size">2024</div>
                  </div>
                  <div className="t-large">Panel Systems</div>
                  <div className="t-large">Unit</div>
                </Link>
                <div className="index-hover">
                  <div className="index-hover-vid w-embed">
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      disablePictureInPicture
                      disableRemotePlayback
                      poster="https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6904a6f2e3503a24fdfa73dc_SZP-web_055web.avif"
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    >
                      <source
                        src="https://cdn.styleframe.de/SZP-web/VARIABLE_UNIT_WebsiteSnippet.mp4"
                        type="video/mp4"
                      />
                    </video>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
            <a
              data-w-id="d636055f-4a21-6155-01a4-3396fc0d09fb"
              href="#"
              className="link footer-link"
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
    </>
  );
}

export default IndexPage;
