import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import panzoom from "panzoom";
import { useVideoPlayer } from "./hooks/useVideoPlayer";

gsap.registerPlugin(ScrollTrigger);

function ResearchPage() {
  const cursorPackRef = useRef(null);
  const defaultCursorRef = useRef(null);
  const linkCursorRef = useRef(null);
  const [cursorType, setCursorType] = useState("default");
  const [isContactOpen, setIsContactOpen] = useState(false);
  const panzoomInstanceRef = useRef(null);

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

  // Panzoom and drag/resize functionality
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const container = document.querySelector(".collection-list-wrp-lab");
      const list = document.querySelector(".collection-list-lab");
      const items = document.querySelectorAll(".collection-item-lab");
      const resizables = document.querySelectorAll(".resizable");

      if (!container || !list || items.length === 0) {
        console.log("Elements not found:", {
          container,
          list,
          itemsCount: items.length,
        });
        return;
      }

      console.log("Initializing panzoom with", items.length, "items");

      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const nonPassive = { passive: false };

      // Get actual viewport dimensions
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      console.log("Container dimensions:", containerWidth, containerHeight);

      // Initialize Panzoom
      const instance = panzoom(list, {
        initialZoom: 1,
        maxZoom: 2.5,
        minZoom: 0.3,
        zoomSpeed: 0.05,
        bounds: false,
        boundsPadding: 0.1,
      });
      panzoomInstanceRef.current = instance;

      let mode = null;
      let activeItem = null;
      let dragStartX = 0,
        dragStartY = 0;
      let startLeft = 0,
        startTop = 0;
      let origW = 0,
        origH = 0;
      let rStartX = 0,
        rStartY = 0;

      const getScale = () => {
        const transform = list.style.transform;
        if (!transform) return 1;
        const matrix = new DOMMatrix(transform);
        return matrix.a || 1;
      };

      function freezeGestures() {
        list.style.touchAction = "none";
        if (container) container.style.touchAction = "none";
        try {
          if (instance.pause) instance.pause();
        } catch (e) {
          console.log("Pause error:", e);
        }
      }

      function unfreezeGestures() {
        list.style.touchAction = "";
        if (container) container.style.touchAction = "";
        try {
          if (instance.resume) instance.resume();
        } catch (e) {
          console.log("Resume error:", e);
        }
      }

      // FIXED: Position items in visible viewport with proper spacing
      const itemSize = 250;
      const spacing = 50;
      const cols = Math.ceil(Math.sqrt(items.length));
      const rows = Math.ceil(items.length / cols);

      const gridWidth = cols * itemSize + (cols - 1) * spacing;
      const gridHeight = rows * itemSize + (rows - 1) * spacing;

      const gridStartX = Math.max(100, (containerWidth - gridWidth) / 2);
      const gridStartY = Math.max(100, (containerHeight - gridHeight) / 2);

      console.log("Grid layout:", {
        cols,
        rows,
        gridWidth,
        gridHeight,
        gridStartX,
        gridStartY,
      });

      items.forEach((item, index) => {
        // Prevent default drag
        item.addEventListener("dragstart", (e) => e.preventDefault());

        const col = index % cols;
        const row = Math.floor(index / cols);

        const x = gridStartX + col * (itemSize + spacing);
        const y = gridStartY + row * (itemSize + spacing);

        // ULTIMATE FORCE VISIBILITY - MAX Z-INDEX
        item.style.cssText = `
          position: absolute !important;
          left: ${x}px !important;
          top: ${y}px !important;
          width: ${itemSize}px !important;
          height: ${itemSize}px !important;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          z-index: 99999 !important;
          cursor: move !important;
        `;

        // Force image visibility
        const img = item.querySelector("img");
        if (img) {
          img.style.cssText = `
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            width: 100% !important;
            height: 100% !important;
            object-fit: contain !important;
            pointer-events: none !important;
          `;
          img.setAttribute("draggable", "false");

          // Log when image loads
          img.onload = () => {
            console.log(`✅ Image ${index} rendered at ${x}, ${y}`);
          };
          img.onerror = () => {
            console.error(`❌ Image ${index} FAILED to load: ${img.src}`);
          };
        }

        console.log(
          `🎯 Item ${index} ULTIMATE FORCE at: ${x}, ${y} (size: ${itemSize}x${itemSize})`,
        );

        if (hasTouch) {
          item.addEventListener("touchstart", onDragStartTouch, nonPassive);
        } else {
          item.addEventListener("mousedown", onDragStartMouse);
        }
      });

      // Force the list container to be visible too
      list.style.cssText += `
        z-index: 99998 !important;
        visibility: visible !important;
        opacity: 1 !important;
      `;

      container.style.cssText += `
        z-index: 99997 !important;
        visibility: visible !important;
        opacity: 1 !important;
      `;

      console.log("🚀 ULTIMATE FORCE APPLIED - YOU MUST SEE LIME BORDERS NOW!");

      // Resizable handles
      resizables.forEach((handle) => {
        if (hasTouch) {
          handle.addEventListener("touchstart", onResizeStartTouch, nonPassive);
        } else {
          handle.addEventListener("mousedown", onResizeStartMouse);
        }
      });

      // ===== DRAG FUNCTIONS =====
      function onDragStartMouse(e) {
        if (e.button !== 0) return;
        if (e.target.classList && e.target.classList.contains("resizable"))
          return;

        e.preventDefault();
        e.stopPropagation();

        activeItem = e.currentTarget;
        mode = "drag";

        dragStartX = e.pageX;
        dragStartY = e.pageY;
        startLeft = parseFloat(activeItem.style.left || "0");
        startTop = parseFloat(activeItem.style.top || "0");

        freezeGestures();
        document.addEventListener("mousemove", onDragMoveMouse);
        document.addEventListener("mouseup", onEndMouse);
      }

      function onDragMoveMouse(e) {
        if (mode !== "drag" || !activeItem) return;
        e.preventDefault();

        const scale = getScale();
        const dx = (e.pageX - dragStartX) / scale;
        const dy = (e.pageY - dragStartY) / scale;

        activeItem.style.left = `${startLeft + dx}px`;
        activeItem.style.top = `${startTop + dy}px`;
      }

      function onEndMouse() {
        cleanup();
      }

      function onDragStartTouch(e) {
        if (e.touches.length > 1) return;
        if (e.target.classList && e.target.classList.contains("resizable"))
          return;

        e.preventDefault();
        e.stopPropagation();

        activeItem = e.currentTarget;
        mode = "drag";

        const t = e.touches[0];
        dragStartX = t.pageX;
        dragStartY = t.pageY;
        startLeft = parseFloat(activeItem.style.left || "0");
        startTop = parseFloat(activeItem.style.top || "0");

        freezeGestures();
        document.addEventListener("touchmove", onDragMoveTouch, nonPassive);
        document.addEventListener("touchend", onEndTouch);
        document.addEventListener("touchcancel", onEndTouch);
      }

      function onDragMoveTouch(e) {
        if (mode !== "drag" || !activeItem) return;
        if (e.cancelable) e.preventDefault();

        const t = e.touches[0];
        const scale = getScale();
        const dx = (t.pageX - dragStartX) / scale;
        const dy = (t.pageY - dragStartY) / scale;

        activeItem.style.left = `${startLeft + dx}px`;
        activeItem.style.top = `${startTop + dy}px`;
      }

      function onEndTouch() {
        cleanup();
      }

      // ===== RESIZE FUNCTIONS =====
      function onResizeStartMouse(e) {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();

        activeItem = e.target.closest(".collection-item-lab");
        if (!activeItem) return;
        mode = "resize";

        const styles = getComputedStyle(activeItem);
        origW = parseFloat(styles.width);
        origH = parseFloat(styles.height);

        rStartX = e.pageX;
        rStartY = e.pageY;

        freezeGestures();
        document.addEventListener("mousemove", onResizeMoveMouse, nonPassive);
        document.addEventListener("mouseup", onEndMouse);
      }

      function onResizeMoveMouse(e) {
        if (mode !== "resize" || !activeItem) return;
        e.preventDefault();

        const scale = getScale();
        const dx = (e.pageX - rStartX) / scale;
        const dy = (e.pageY - rStartY) / scale;

        applyResize(dx, dy);
      }

      function onResizeStartTouch(e) {
        if (e.touches.length > 1) return;
        e.preventDefault();
        e.stopPropagation();

        activeItem = e.target.closest(".collection-item-lab");
        if (!activeItem) return;
        mode = "resize";

        const styles = getComputedStyle(activeItem);
        origW = parseFloat(styles.width);
        origH = parseFloat(styles.height);

        const t = e.touches[0];
        rStartX = t.pageX;
        rStartY = t.pageY;

        freezeGestures();
        document.addEventListener("touchmove", onResizeMoveTouch, nonPassive);
        document.addEventListener("touchend", onEndTouch);
        document.addEventListener("touchcancel", onEndTouch);
      }

      function onResizeMoveTouch(e) {
        if (mode !== "resize" || !activeItem) return;
        if (e.cancelable) e.preventDefault();

        const t = e.touches[0];
        const scale = getScale();
        const dx = (t.pageX - rStartX) / scale;
        const dy = (t.pageY - rStartY) / scale;

        applyResize(dx, dy);
      }

      function applyResize(dx, dy) {
        const aspect = origH / origW;
        let newW, newH;

        if (Math.abs(dx) < Math.abs(dy)) {
          newW = Math.max(100, origW + dx);
          newH = newW * aspect;
        } else if (Math.abs(dy) < Math.abs(dx)) {
          newH = Math.max(100, origH + dy);
          newW = newH / aspect;
        } else {
          newW = Math.max(100, origW + dx);
          newH = Math.max(100, origH + dy);
        }

        activeItem.style.width = `${newW}px`;
        activeItem.style.height = `${newH}px`;
      }

      function cleanup() {
        unfreezeGestures();

        document.removeEventListener("mousemove", onDragMoveMouse);
        document.removeEventListener("mouseup", onEndMouse);
        document.removeEventListener("mousemove", onResizeMoveMouse);

        document.removeEventListener("touchmove", onDragMoveTouch, nonPassive);
        document.removeEventListener("touchend", onEndTouch);
        document.removeEventListener("touchcancel", onEndTouch);
        document.removeEventListener(
          "touchmove",
          onResizeMoveTouch,
          nonPassive,
        );

        mode = null;
        activeItem = null;
      }

      return () => {
        if (panzoomInstanceRef.current) {
          panzoomInstanceRef.current.dispose();
          panzoomInstanceRef.current = null;
        }
        cleanup();
      };
    }, 100);

    return () => {
      clearTimeout(timer);
      if (panzoomInstanceRef.current) {
        panzoomInstanceRef.current.dispose();
        panzoomInstanceRef.current = null;
      }
    };
  }, []);

  // Lab images data
  const labImages = [
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6904c4d67248630f3b884c9f_RND_002_rv.avif",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6904c4ba6091278950063d28_RND_006_rv.avif",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6904c4abb1cf50e8eac3c609_250203_Midas_RND_v006_rv0001.avif",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6904c49833f45c0e5cb1b0fd_250203_Midas_RND_v007_abstract_rv0001.avif",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe84e_wc-2.avif",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe84d_wc-1.avif",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe84c_vans-2.avif",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe84b_vans-1.avif",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe84a_sonra-snow-globe-2.avif",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe849_sonra-snow-globe-1.avif",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe848_sonra-3.avif",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe847_sonra-2.avif",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe846_sonra-1.avif",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe845_rose.avif",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe844_ropescene.avif",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe843_rayban-ferrari-3.avif",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe842_rayban-ferrari-2.avif",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe841_rayban-ferrari-1.avif",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe840_rack-3.avif",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe83f_rack-2.avif",
    },
  ];

  return (
    <>
      <div className="navbar">
        <div className="navbar-main-wrp">
          <div className="navbar-logo-wrp">
            <Link
              to="/"
              className="logo link w-inline-block"
              style={{
                backgroundImage: 'url("/assets/logo.png")',
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            ></Link>
          </div>
          <div
            id="w-node-f189272f-6638-5b12-d5b7-2dd5adebb21e-d64e909a"
            className="navbar-dt-wrp"
          >
            <div className="navbar-link-wrp">
              <Link to="/project-index" className="link navbar-link">
                Index
              </Link>
              <Link
                to="/research"
                aria-current="page"
                className="link navbar-link w--current"
              >
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
            ></div>
            <div
              data-w-id="695dd12c-82a5-a52d-8f5b-486dd64e909e"
              className="menu-icon-line mi-2"
            ></div>
          </div>
        </div>
        <div className="navbar-mob-wrp">
          <div className="navbar-link-wrp">
            <Link to="/project-index" className="link navbar-link">
              Index
            </Link>
            <Link
              to="/research"
              aria-current="page"
              className="link navbar-link w--current"
            >
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
              </a>
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
                <div>Preferences</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        id="cursor-pack"
        className="cursor-pack"
        ref={cursorPackRef}
        style={{ zIndex: 200000 }}
      >
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
      </div>

      <div
        className={`contact-banner ${isContactOpen ? "open" : "closed"}`}
        style={{ zIndex: 150000 }}
      >
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
            <a href="mailto:info@styleframe.de" className="link">
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
          rel="noopener noreferrer"
          className="link t-white-50"
        >
          Map ↗
        </a>
        <div className="link-wrp">
          <a
            href="https://www.instagram.com/styleframe.studio/"
            target="_blank"
            rel="noopener noreferrer"
            className="link t-large"
          >
            ↗ Instagram
          </a>
          <a
            href="https://www.linkedin.com/company/styleframe"
            target="_blank"
            rel="noopener noreferrer"
            className="link t-large"
          >
            ↗ LinkedIn
          </a>
          <a
            href="https://www.behance.net/styleframe"
            target="_blank"
            rel="noopener noreferrer"
            className="link t-large"
          >
            ↗ Behance
          </a>
          <a
            href="https://vimeo.com/styleframe"
            target="_blank"
            rel="noopener noreferrer"
            className="link t-large"
          >
            ↗ Vimeo
          </a>
          <a
            href="https://www.instagram.com/echologic.lab/"
            target="_blank"
            rel="noopener noreferrer"
            className="link t-large"
          >
            ↗ AI Lab
          </a>
        </div>
      </div>

      <div className="lab-canvas-wrp" style={{ zIndex: 50000 }}>
        <Link
          to="/research"
          aria-current="page"
          className="refresh-page w-inline-block w--current"
        ></Link>
        <div className="collection-list-wrp-lab">
          <div className="collection-list-lab">
            {labImages.map((img, index) => (
              <div key={index} className="collection-item-lab">
                <img
                  src={img.src}
                  loading="eager"
                  alt={`Lab research ${index + 1}`}
                  className="lab-image"
                  draggable="false"
                />
                <div className="resizable"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ResearchPage;
