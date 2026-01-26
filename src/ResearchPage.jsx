import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { useVideoPlayer } from "./hooks/useVideoPlayer";

gsap.registerPlugin(ScrollTrigger);

function ResearchPage() {
  const pageRef = useRef(null);
  const cursorPackRef = useRef(null);
  const defaultCursorRef = useRef(null);
  const linkCursorRef = useRef(null);
  const [cursorType, setCursorType] = useState("default");
  const [isContactOpen, setIsContactOpen] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    // Load scripts
    const loadScript = (src, integrity = null) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        if (integrity) script.integrity = integrity;
        script.crossOrigin = integrity ? "anonymous" : null;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    Promise.all([
      loadScript(
        "https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=66c3a685de0fd85a256fe67c",
        "sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=",
      ),
      loadScript(
        "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe67c/js/webflow.schunk.36b8fb49256177c8.js",
      ),
      loadScript(
        "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe67c/js/webflow.schunk.b76e6d9ad01b486f.js",
      ),
      loadScript(
        "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe67c/js/webflow.22196bf4.30fd916c899bdc1d.js",
      ),
      loadScript("https://unpkg.com/panzoom@9.4.0/dist/panzoom.min.js"),
    ]).catch((err) => console.log("Script loading error:", err));

    // Text split animations
    let typeSplit;
    const runSplit = () => {
      // Only run if there are [text-split] elements
      const textSplitElements = document.querySelectorAll("[text-split]");
      if (textSplitElements.length === 0) return;

      try {
        typeSplit = new SplitType("[text-split]", {
          types: "words, chars",
          tagName: "span",
        });
      } catch (err) {
        console.log("SplitType error:", err);
        return;
      }

      function createScrollTrigger(triggerElement, timeline) {
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

      document.querySelectorAll("[words-slide-up]").forEach((el) => {
        const tl = gsap.timeline({ paused: true });
        tl.from(el.querySelectorAll(".word"), {
          opacity: 0,
          yPercent: 100,
          duration: 0.5,
          ease: "power2.out(2)",
          stagger: { amount: 0.5 },
        });
        createScrollTrigger(el, tl);
      });

      document.querySelectorAll("[words-rotate-in]").forEach((el) => {
        const tl = gsap.timeline({ paused: true });
        tl.set(el.querySelectorAll(".word"), { transformPerspective: 1000 });
        tl.from(el.querySelectorAll(".word"), {
          rotationX: -90,
          duration: 0.6,
          ease: "power2.out",
          stagger: { amount: 0.6 },
        });
        createScrollTrigger(el, tl);
      });

      document.querySelectorAll("[words-slide-from-right]").forEach((el) => {
        const tl = gsap.timeline({ paused: true });
        tl.from(el.querySelectorAll(".word"), {
          opacity: 0,
          x: "1em",
          duration: 0.6,
          ease: "power2.out",
          stagger: { amount: 0.2 },
        });
        createScrollTrigger(el, tl);
      });

      document.querySelectorAll("[letters-slide-up]").forEach((el) => {
        const tl = gsap.timeline({ paused: true });
        tl.from(el.querySelectorAll(".char"), {
          yPercent: 100,
          duration: 0.2,
          ease: "power1.out",
          stagger: { amount: 0.6 },
        });
        createScrollTrigger(el, tl);
      });

      document.querySelectorAll("[letters-slide-down]").forEach((el) => {
        const tl = gsap.timeline({ paused: true });
        tl.from(el.querySelectorAll(".char"), {
          yPercent: -120,
          duration: 0.3,
          ease: "power1.out",
          stagger: { amount: 0.7 },
        });
        createScrollTrigger(el, tl);
      });

      document.querySelectorAll("[letters-fade-in]").forEach((el) => {
        const tl = gsap.timeline({ paused: true });
        tl.from(el.querySelectorAll(".char"), {
          opacity: 0,
          duration: 0.2,
          ease: "power1.out",
          stagger: { amount: 0.8 },
        });
        createScrollTrigger(el, tl);
      });

      document.querySelectorAll("[letters-fade-in-random]").forEach((el) => {
        const tl = gsap.timeline({ paused: true });
        tl.from(el.querySelectorAll(".char"), {
          opacity: 0,
          duration: 0.05,
          ease: "power1.out",
          stagger: { amount: 0.4, from: "random" },
        });
        createScrollTrigger(el, tl);
      });

      document.querySelectorAll("[scrub-each-word]").forEach((el) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            end: "top center",
            scrub: true,
          },
        });
        tl.from(el.querySelectorAll(".word"), {
          opacity: 0.2,
          duration: 0.2,
          ease: "power1.out",
          stagger: { each: 0.4 },
        });
      });

      // Only set if elements exist
      const textSplitEls = document.querySelectorAll("[text-split]");
      if (textSplitEls.length > 0) {
        gsap.set("[text-split]", { opacity: 1 });
      }
    };

    runSplit();

    // Line split animation
    let lineSplit;
    const runLineSplit = () => {
      // Only run if there are .split-lines elements
      const splitLinesElements = document.querySelectorAll(".split-lines");
      if (splitLinesElements.length === 0) return;

      try {
        lineSplit = new SplitType(".split-lines", {
          types: "lines, words",
        });
      } catch (err) {
        console.log("SplitType error for split-lines:", err);
        return;
      }
      document.querySelectorAll(".line").forEach((line) => {
        if (!line.querySelector(".line-mask")) {
          const mask = document.createElement("div");
          mask.className = "line-mask";
          line.appendChild(mask);
        }
      });
      createLineAnimation();
    };

    const createLineAnimation = () => {
      document.querySelectorAll(".line").forEach((line) => {
        const mask = line.querySelector(".line-mask");
        if (mask) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: line,
              start: "top center",
              end: "bottom center",
              scrub: 1,
            },
          });
          tl.to(mask, {
            width: "0%",
            duration: 1,
          });
        }
      });
    };

    runLineSplit();

    // Logo carousel animation
    const logoCarousels = document.querySelectorAll(
      ".collection-list-logo-anim",
    );
    const carouselIntervals = [];
    logoCarousels.forEach((carousel) => {
      const slides = Array.from(carousel.children);
      let idx = -1;
      slides.forEach((slide) => (slide.style.display = "none"));
      const rotate = () => {
        if (idx >= 0) {
          slides[idx].style.display = "none";
        }
        idx = (idx + 1) % slides.length;
        slides[idx].style.display = "block";
        carouselIntervals.push(setTimeout(rotate, 83.333333));
      };
      rotate();
    });

    // Panzoom and drag/resize functionality for lab images
    const initLabCanvas = () => {
      if (typeof window.panzoom === "undefined") {
        setTimeout(initLabCanvas, 100);
        return;
      }

      const container = document.querySelector(".collection-list-wrp-lab");
      const list = document.querySelector(".collection-list-lab");
      const items = document.querySelectorAll(".collection-item-lab");
      const resizables = document.querySelectorAll(".resizable");

      if (!container || !list || items.length === 0) return;

      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const nonPassive = { passive: false };

      // Panzoom instance
      const instance = window.panzoom(list, {
        initialZoom: 0.5,
        maxZoom: 2.5,
        minZoom: 0.4,
        zoomSpeed: 0.05,
      });

      let mode = null;
      let activeItem = null;
      let startX = 0,
        startY = 0;
      let startLeft = 0,
        startTop = 0;
      let origW = 0,
        origH = 0;
      let rStartX = 0,
        rStartY = 0;

      const getScale = () =>
        list.getBoundingClientRect().width / list.offsetWidth;

      function freezeGestures() {
        list.style.touchAction = "none";
        if (container) container.style.touchAction = "none";
        try {
          if (instance.pause) instance.pause();
        } catch {}
      }

      function unfreezeGestures() {
        list.style.touchAction = "";
        if (container) container.style.touchAction = "";
        try {
          if (instance.resume) instance.resume();
        } catch {}
      }

      // Initial scroll
      if (container) {
        container.scrollLeft = 1000;
        container.scrollTop = 0;
      }

      // Randomly place items
      items.forEach((item) => {
        item.addEventListener("dragstart", (e) => e.preventDefault());
        item
          .querySelectorAll("img")
          .forEach((img) => img.setAttribute("draggable", "false"));

        const cw = container?.scrollWidth || list.scrollWidth || 0;
        const ch = container?.scrollHeight || list.scrollHeight || 0;
        const iw = item.clientWidth;
        const ih = item.clientHeight;
        const rx = Math.random() * Math.max(0, cw - iw);
        const ry = Math.random() * Math.max(0, ch - ih);
        item.style.left = `${rx}px`;
        item.style.top = `${ry}px`;

        if (hasTouch) {
          item.addEventListener("touchstart", onDragStartTouch, nonPassive);
        } else {
          item.addEventListener("mousedown", onDragStartMouse);
        }
      });

      // Resizable handles
      resizables.forEach((handle) => {
        if (hasTouch) {
          handle.addEventListener("touchstart", onResizeStartTouch, nonPassive);
        } else {
          handle.addEventListener("mousedown", onResizeStartMouse);
        }
      });

      function onDragStartMouse(e) {
        if (e.button !== 0) return;
        if (e.target.classList && e.target.classList.contains("resizable"))
          return;

        e.preventDefault();
        e.stopPropagation();

        activeItem = e.currentTarget;
        mode = "drag";

        startX = e.pageX;
        startY = e.pageY;
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
        const dx = (e.pageX - startX) / scale;
        const dy = (e.pageY - startY) / scale;

        activeItem.style.left = `${startLeft + dx}px`;
        activeItem.style.top = `${startTop + dy}px`;
      }

      function onEndMouse(e) {
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
        startX = t.pageX;
        startY = t.pageY;
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
        const dx = (t.pageX - startX) / scale;
        const dy = (t.pageY - startY) / scale;

        activeItem.style.left = `${startLeft + dx}px`;
        activeItem.style.top = `${startTop + dy}px`;
      }

      function onEndTouch(e) {
        cleanup();
      }

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
          newW = Math.max(20, origW + dx);
          newH = newW * aspect;
        } else if (Math.abs(dy) < Math.abs(dx)) {
          newH = Math.max(20, origH + dy);
          newW = newH / aspect;
        } else {
          newW = Math.max(20, origW + dx);
          newH = Math.max(20, origH + dy);
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
    };

    // Initialize lab canvas after scripts load
    setTimeout(initLabCanvas, 1000);

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      carouselIntervals.forEach((id) => clearTimeout(id));
      if (typeSplit) typeSplit.revert();
      if (lineSplit) lineSplit.revert();
    };
  }, []);

  // Lab images data
  const labImages = [
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6904c4d67248630f3b884c9f_RND_002_rv.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6904c4ba6091278950063d28_RND_006_rv.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6904c4abb1cf50e8eac3c609_250203_Midas_RND_v006_rv0001.avif",
      srcset:
        "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6904c4abb1cf50e8eac3c609_250203_Midas_RND_v006_rv0001-p-500.avif 500w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6904c4abb1cf50e8eac3c609_250203_Midas_RND_v006_rv0001-p-800.avif 800w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6904c4abb1cf50e8eac3c609_250203_Midas_RND_v006_rv0001-p-1080.avif 1080w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6904c4abb1cf50e8eac3c609_250203_Midas_RND_v006_rv0001.avif 1920w",
      sizes: "100vw",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6904c49833f45c0e5cb1b0fd_250203_Midas_RND_v007_abstract_rv0001.avif",
      srcset:
        "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6904c49833f45c0e5cb1b0fd_250203_Midas_RND_v007_abstract_rv0001-p-500.avif 500w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6904c49833f45c0e5cb1b0fd_250203_Midas_RND_v007_abstract_rv0001-p-800.avif 800w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6904c49833f45c0e5cb1b0fd_250203_Midas_RND_v007_abstract_rv0001-p-1080.avif 1080w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6904c49833f45c0e5cb1b0fd_250203_Midas_RND_v007_abstract_rv0001.avif 1920w",
      sizes: "100vw",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe84e_wc-2.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe84d_wc-1.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe84c_vans-2.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe84b_vans-1.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe84a_sonra-snow-globe-2.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe849_sonra-snow-globe-1.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe848_sonra-3.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe847_sonra-2.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe846_sonra-1.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe845_rose.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe844_ropescene.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe843_rayban-ferrari-3.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe842_rayban-ferrari-2.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe841_rayban-ferrari-1.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe840_rack-3.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe83f_rack-2.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe83e_rack-1.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe83d_ps-2.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe83c_ps-1.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe83b_printer-2.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe83a_printer-1.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe839_polestar.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe838_partikulierung.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe837_mickey-2.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe836_mickey-1.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe835_michelin-3.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe834_michelin-2.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe833_michelin-1.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe832_megabunt.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe831_mad-paris.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe830_letter-a.avif",
      srcset:
        "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe830_letter-a.webp 500w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe830_letter-a.webp 800w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe830_letter-a.webp 1080w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe830_letter-a.webp 1600w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe830_letter-a.avif 2160w",
      sizes: "100vw",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe82f_hyundai-cam-2.avif",
      srcset:
        "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe82f_hyundai-cam-2.avif 500w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe82f_hyundai-cam-2.avif 800w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe82f_hyundai-cam-2.avif 1080w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe82f_hyundai-cam-2.avif 2480w",
      sizes: "100vw",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe82e_hyundai-cam-1.avif",
      srcset:
        "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe82e_hyundai-cam-1.avif 500w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe82e_hyundai-cam-1.avif 800w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe82e_hyundai-cam-1.avif 1080w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe82e_hyundai-cam-1.avif 2480w",
      sizes: "100vw",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe82d_humanpower.avif",
      srcset:
        "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe82d_humanpower.avif 500w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe82d_humanpower.avif 800w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe82d_humanpower.avif 1080w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe82d_humanpower.avif 1600w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe82d_humanpower.avif 2160w",
      sizes: "100vw",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe82c_hattonlabs-9.avif",
      srcset:
        "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe82c_hattonlabs-9.avif 500w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe82c_hattonlabs-9.avif 800w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe82c_hattonlabs-9.avif 1080w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe82c_hattonlabs-9.avif 1920w",
      sizes: "100vw",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe81d_hattonlabs-8.avif",
      srcset:
        "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe81d_hattonlabs-8.avif 500w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe81d_hattonlabs-8.avif 800w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe81d_hattonlabs-8.avif 1080w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe81d_hattonlabs-8.avif 1920w",
      sizes: "100vw",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe804_hattonlabs-7.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe803_hattonlabs-6.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe802_hattonlabs-5.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe801_hattonlabs-4.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7e1_hattonlabs-3.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7cf_hattonlabs-2.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7ce_hattonlabs-1.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7cd_cloth-2.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7cc_cloth-1.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7cb_chair-simple.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7ca_cd-covers.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7c9_carseat-3.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7c8_carseat-2.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7c7_carseat-1.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7c6_cactus.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7c5_blob.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7c4_bizzare-12.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7c3_bizzare-11.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7c2_bizzare-10.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7c1_bizzare-9.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7c0_bizzare-8.avif",
      srcset: null,
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7bf_bizzare-7.avif",
      srcset:
        "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7bf_bizzare-7.avif 500w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7bf_bizzare-7.avif 800w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7bf_bizzare-7.avif 1080w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7bf_bizzare-7.avif 1600w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7bf_bizzare-7.avif 2000w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7bf_bizzare-7.avif 3000w",
      sizes: "100vw",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7be_bizzare-6.avif",
      srcset:
        "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7be_bizzare-6.webp 500w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7be_bizzare-6.webp 800w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7be_bizzare-6.webp 1080w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7be_bizzare-6.avif 1920w",
      sizes: "100vw",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7bd_bizzare-5.avif",
      srcset:
        "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7bd_bizzare-5.avif 500w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7bd_bizzare-5.avif 800w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7bd_bizzare-5.avif 1080w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7bd_bizzare-5.avif 1920w",
      sizes: "100vw",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7bc_bizzare-4.avif",
      srcset:
        "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7bc_bizzare-4.avif 500w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7bc_bizzare-4.avif 800w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7bc_bizzare-4.avif 1080w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7bc_bizzare-4.avif 1920w",
      sizes: "100vw",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7bb_bizzare-3.avif",
      srcset:
        "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7bb_bizzare-3.avif 500w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7bb_bizzare-3.avif 800w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7bb_bizzare-3.avif 1080w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7bb_bizzare-3.avif 1920w",
      sizes: "100vw",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7ba_bizzare-2.avif",
      srcset:
        "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7ba_bizzare-2.avif 500w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7ba_bizzare-2.avif 800w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7ba_bizzare-2.avif 1080w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7ba_bizzare-2.avif 1920w",
      sizes: "100vw",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7b9_bizarre-1.avif",
      srcset:
        "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7b9_bizarre-1.avif 500w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7b9_bizarre-1.avif 800w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7b9_bizarre-1.avif 1080w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7b9_bizarre-1.avif 3000w",
      sizes: "100vw",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7b8_apfel.avif",
      srcset:
        "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7b8_apfel.avif 500w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7b8_apfel.avif 800w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7b8_apfel.avif 1080w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7b8_apfel.avif 2160w",
      sizes: "100vw",
    },
    {
      src: "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7b7_and.avif",
      srcset:
        "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7b7_and.avif 500w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7b7_and.avif 800w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7b7_and.avif 1080w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7b7_and.avif 1600w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7b7_and.avif 2000w, https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/66c3a685de0fd85a256fe7b7_and.avif 4320w",
      sizes: "100vw",
    },
  ];

  return (
    <>
      <div className="navbar">
        <div className="navbar-main-wrp">
          <div className="navbar-logo-wrp">
            <Link to="/" className="logo link w-inline-block"></Link>
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

      <div
        data-w-id="d5f92b82-978f-a770-3f25-8224578da03a"
        className={`contact-banner ${isContactOpen ? "open" : "closed"}`}
      >
        <div
          data-w-id="d5f92b82-978f-a770-3f25-8224578da03b"
          className="link t-large t-right bottom-auto"
          onClick={() => setIsContactOpen(false)}
          style={{ cursor: "pointer", color: "black" }}
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

      {/* Hero Section with text-split for GSAP animations */}
      <div className="lab-hero-section">
        <div
          words-slide-up=""
          text-split=""
          className="container lab-hero-container"
        >
          <h1 className="lab-hero-title">
            Experimental visuals and <br />
            technical explorations
          </h1>
        </div>
      </div>

      <div className="lab-canvas-wrp">
        <Link
          to="/research"
          aria-current="page"
          className="refresh-page w-inline-block w--current"
        ></Link>
        <div
          data-w-id="bb85d5a4-4b77-08a5-330f-48e2521ba1e8"
          className="collection-list-wrp-lab w-dyn-list"
        >
          <div role="list" className="collection-list-lab w-dyn-items">
            {labImages.map((img, index) => (
              <div
                key={index}
                role="listitem"
                className="collection-item-lab w-dyn-item"
              >
                <img
                  src={img.src}
                  loading="eager"
                  width="Auto"
                  height="Auto"
                  alt=""
                  className="lab-image"
                  srcSet={img.srcset || undefined}
                  sizes={img.sizes || undefined}
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
