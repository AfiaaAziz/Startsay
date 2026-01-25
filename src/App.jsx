import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { useVideoPlayer } from "./hooks/useVideoPlayer";
import { Routes, Route, Link } from "react-router-dom";
import IndexPage from "./IndexPage";
import StudioPage from "./StudioPage";
// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/project-index" element={<IndexPage />} />
      <Route path="/studio" element={<StudioPage />} />
    </Routes>
  );
}

function HomePage() {
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
        // Split text into spans
        let typeSplit = new SplitType("[text-split]", {
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

        const $ = (sel) => document.querySelector(sel);
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

    // Wait a bit for libraries to load and DOM to settle
    const timer = setTimeout(initializeAnimations, 500);
    return () => clearTimeout(timer);
  }, []);

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
                    style={{
                      backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42f32e179658fc220ff71_20.avif")`,
                    }}
                    role="listitem"
                    className="collection-item-logo-anim w-dyn-item"
                  ></div>
                  <div
                    style={{
                      backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42f2a1bc30a29cc9dde23_19.avif")`,
                    }}
                    role="listitem"
                    className="collection-item-logo-anim w-dyn-item"
                  ></div>
                  <div
                    style={{
                      backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42ea7b8caf2e461da972d_18.avif")`,
                    }}
                    role="listitem"
                    className="collection-item-logo-anim w-dyn-item"
                  ></div>
                  <div
                    style={{
                      backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42e9dab059fd303cb59bb_17.avif")`,
                    }}
                    role="listitem"
                    className="collection-item-logo-anim w-dyn-item"
                  ></div>
                  <div
                    style={{
                      backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42e8c9b02ae0d1681b7b8_16.avif")`,
                    }}
                    role="listitem"
                    className="collection-item-logo-anim w-dyn-item"
                  ></div>
                  <div
                    style={{
                      backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42cb457683fdcaecf34aa_15.avif")`,
                    }}
                    role="listitem"
                    className="collection-item-logo-anim w-dyn-item"
                  ></div>
                  <div
                    style={{
                      backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42cabbf94893911f30b8d_14.avif")`,
                    }}
                    role="listitem"
                    className="collection-item-logo-anim w-dyn-item"
                  ></div>
                  <div
                    style={{
                      backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42ca28d03c1d72159ab26_13.avif")`,
                    }}
                    role="listitem"
                    className="collection-item-logo-anim w-dyn-item"
                  ></div>
                  <div
                    style={{
                      backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42c954de027a2c9aa384c_12.avif")`,
                    }}
                    role="listitem"
                    className="collection-item-logo-anim w-dyn-item"
                  ></div>
                  <div
                    style={{
                      backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42c84894ff1d8f915df24_11.avif")`,
                    }}
                    role="listitem"
                    className="collection-item-logo-anim w-dyn-item"
                  ></div>
                  <div
                    style={{
                      backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6886834949596497c68bf5b1_686e821bdf1767b3c81c36e8_231030_RND_DK_010_orangehintergrund_v2%20fog%20Large.avif")`,
                    }}
                    role="listitem"
                    className="collection-item-logo-anim w-dyn-item"
                  ></div>
                  <div
                    style={{
                      backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/688683406e8226dcdd61a12c_6867e107b4d400ad20ad39dd_230303_Firstcolo_Broschure_Rnd_001c_blueAkzent_01%20Large.avif")`,
                    }}
                    role="listitem"
                    className="collection-item-logo-anim w-dyn-item"
                  ></div>
                  <div
                    style={{
                      backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68868334c66e32973ba66caf_686685c2c0df48ad320a646c_230124_OP1_v003_1_Main_0001%20Large.avif")`,
                    }}
                    role="listitem"
                    className="collection-item-logo-anim w-dyn-item"
                  ></div>
                  <div
                    style={{
                      backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6886832b826db4c61cb8afcf_686695b490c6187b4302ded1_We_are_Rewind_Ghetto_Blaster_1x1_07%20Large.avif")`,
                    }}
                    role="listitem"
                    className="collection-item-logo-anim w-dyn-item"
                  ></div>
                  <div
                    style={{
                      backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/688682a866bb85d741dbe468_6862aa2bcc68d0ad5ce0ed3a_mars_cover.avif")`,
                    }}
                    role="listitem"
                    className="collection-item-logo-anim w-dyn-item"
                  ></div>
                  <div
                    style={{
                      backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68868319d36be5e41a195460_6867c4009b5aeeeb46555855_RND_dk_011_0031.avif")`,
                    }}
                    role="listitem"
                    className="collection-item-logo-anim w-dyn-item"
                  ></div>
                  <div
                    style={{
                      backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/688683100007bdc0d6b8d0c4_6867d7d6a8c71bddc3942a28_2.avif")`,
                    }}
                    role="listitem"
                    className="collection-item-logo-anim w-dyn-item"
                  ></div>
                  <div
                    style={{
                      backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/688682ff1da9335baedef285_6867f5123aa787b54ba2cafe_7.avif")`,
                    }}
                    role="listitem"
                    className="collection-item-logo-anim w-dyn-item"
                  ></div>
                  <div
                    style={{
                      backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/688682fa186bbdce6c8fe845_686bf6bd7fb6fdadca975d14_cover%20image-web-497237698_18509548351001463_3505879398570363264_n.avif")`,
                    }}
                    role="listitem"
                    className="collection-item-logo-anim w-dyn-item"
                  ></div>
                  <div
                    style={{
                      backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/688682a866bb85d741dbe468_6862aa2bcc68d0ad5ce0ed3a_mars_cover.avif")`,
                    }}
                    role="listitem"
                    className="collection-item-logo-anim w-dyn-item"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-logo-s"></div>
          <div className="footer-logo-r"></div>
        </div>
      </div>
      <div className="navbar">
        <div className="navbar-main-wrp">
          <div className="navbar-logo-wrp">
            <a
              data-wf-native-id-path="db3a588f-3827-e854-563a-f0ecb0988341:695dd12c-82a5-a52d-8f5b-486dd64e909b"
              data-wf-ao-click-engagement-tracking="true"
              data-wf-element-id="695dd12c-82a5-a52d-8f5b-486dd64e909b"
              data-wf-component-context="%5B%7B%22componentId%22%3A%22695dd12c-82a5-a52d-8f5b-486dd64e909a%22%2C%22instanceId%22%3A%22db3a588f-3827-e854-563a-f0ecb0988341%22%7D%5D"
              href="/"
              aria-current="page"
              className="logo link w-inline-block w--current"
            ></a>
          </div>
          <div
            id="w-node-f189272f-6638-5b12-d5b7-2dd5adebb21e-d64e909a"
            className="navbar-dt-wrp"
          >
            <div className="navbar-link-wrp">
              <a
                data-wf-native-id-path="db3a588f-3827-e854-563a-f0ecb0988341:777dc168-b433-7e41-f8ce-a97e84182cc6:7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de3"
                data-wf-ao-click-engagement-tracking="true"
                data-wf-element-id="7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de3"
                data-wf-component-context="%5B%7B%22componentId%22%3A%22695dd12c-82a5-a52d-8f5b-486dd64e909a%22%2C%22instanceId%22%3A%22db3a588f-3827-e854-563a-f0ecb0988341%22%7D%2C%7B%22componentId%22%3A%227f4a4cfd-1a02-f6e0-fe12-3c21a7a73de2%22%2C%22instanceId%22%3A%22777dc168-b433-7e41-f8ce-a97e84182cc6%22%7D%5D"
                href="/project-index"
                className="link navbar-link"
              >
                Index
              </a>
              <a
                data-w-id="7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de5"
                data-wf-native-id-path="db3a588f-3827-e854-563a-f0ecb0988341:777dc168-b433-7e41-f8ce-a97e84182cc6:7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de5"
                data-wf-ao-click-engagement-tracking="true"
                data-wf-element-id="7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de5"
                data-wf-component-context="%5B%7B%22componentId%22%3A%22695dd12c-82a5-a52d-8f5b-486dd64e909a%22%2C%22instanceId%22%3A%22db3a588f-3827-e854-563a-f0ecb0988341%22%7D%2C%7B%22componentId%22%3A%227f4a4cfd-1a02-f6e0-fe12-3c21a7a73de2%22%2C%22instanceId%22%3A%22777dc168-b433-7e41-f8ce-a97e84182cc6%22%7D%5D"
                href="/research"
                className="link navbar-link"
              >
                Research
              </a>
              <a
                data-wf-native-id-path="db3a588f-3827-e854-563a-f0ecb0988341:777dc168-b433-7e41-f8ce-a97e84182cc6:7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de7"
                data-wf-ao-click-engagement-tracking="true"
                data-wf-element-id="7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de7"
                data-wf-component-context="%5B%7B%22componentId%22%3A%22695dd12c-82a5-a52d-8f5b-486dd64e909a%22%2C%22instanceId%22%3A%22db3a588f-3827-e854-563a-f0ecb0988341%22%7D%2C%7B%22componentId%22%3A%227f4a4cfd-1a02-f6e0-fe12-3c21a7a73de2%22%2C%22instanceId%22%3A%22777dc168-b433-7e41-f8ce-a97e84182cc6%22%7D%5D"
                href="/studio"
                className="link navbar-link"
              >
                Studio
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
            <a
              data-wf-native-id-path="db3a588f-3827-e854-563a-f0ecb0988341:43979cbf-fab0-480b-4b9a-2c363aa41cfd:7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de3"
              data-wf-ao-click-engagement-tracking="true"
              data-wf-element-id="7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de3"
              data-wf-component-context="%5B%7B%22componentId%22%3A%22695dd12c-82a5-a52d-8f5b-486dd64e909a%22%2C%22instanceId%22%3A%22db3a588f-3827-e854-563a-f0ecb0988341%22%7D%2C%7B%22componentId%22%3A%227f4a4cfd-1a02-f6e0-fe12-3c21a7a73de2%22%2C%22instanceId%22%3A%2243979cbf-fab0-480b-4b9a-2c363aa41cfd%22%7D%5D"
              href="/project-index"
              className="link navbar-link"
            >
              Index
            </a>
            <a
              data-w-id="7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de5"
              data-wf-native-id-path="db3a588f-3827-e854-563a-f0ecb0988341:43979cbf-fab0-480b-4b9a-2c363aa41cfd:7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de5"
              data-wf-ao-click-engagement-tracking="true"
              data-wf-element-id="7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de5"
              data-wf-component-context="%5B%7B%22componentId%22%3A%22695dd12c-82a5-a52d-8f5b-486dd64e909a%22%2C%22instanceId%22%3A%22db3a588f-3827-e854-563a-f0ecb0988341%22%7D%2C%7B%22componentId%22%3A%227f4a4cfd-1a02-f6e0-fe12-3c21a7a73de2%22%2C%22instanceId%22%3A%2243979cbf-fab0-480b-4b9a-2c363aa41cfd%22%7D%5D"
              href="/research"
              className="link navbar-link"
            >
              Research
            </a>
            <a
              data-wf-native-id-path="db3a588f-3827-e854-563a-f0ecb0988341:43979cbf-fab0-480b-4b9a-2c363aa41cfd:7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de7"
              data-wf-ao-click-engagement-tracking="true"
              data-wf-element-id="7f4a4cfd-1a02-f6e0-fe12-3c21a7a73de7"
              data-wf-component-context="%5B%7B%22componentId%22%3A%22695dd12c-82a5-a52d-8f5b-486dd64e909a%22%2C%22instanceId%22%3A%22db3a588f-3827-e854-563a-f0ecb0988341%22%7D%2C%7B%22componentId%22%3A%227f4a4cfd-1a02-f6e0-fe12-3c21a7a73de2%22%2C%22instanceId%22%3A%2243979cbf-fab0-480b-4b9a-2c363aa41cfd%22%7D%5D"
              href="/studio"
              className="link navbar-link"
            >
              Studio
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
              +49 69 9494 689-0
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
          data-wf-native-id-path="20f5aab3-bb9e-bf4b-b6b2-65f1575cf856:d5f92b82-978f-a770-3f25-8224578da048"
          data-wf-ao-click-engagement-tracking="true"
          data-wf-element-id="d5f92b82-978f-a770-3f25-8224578da048"
          data-wf-component-context="%5B%7B%22componentId%22%3A%22d5f92b82-978f-a770-3f25-8224578da03a%22%2C%22instanceId%22%3A%2220f5aab3-bb9e-bf4b-b6b2-65f1575cf856%22%7D%5D"
          href="https://maps.app.goo.gl/iqJ7Bt22FuPA7EKA7"
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
            href="https://www.instagram.com/styleframe.studio/"
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
            href="https://www.linkedin.com/company/styleframe"
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
            href="https://www.behance.net/styleframe"
            target="_blank"
            className="link t-large"
          >
            ↗ Behance
          </a>
          <a
            data-wf-native-id-path="20f5aab3-bb9e-bf4b-b6b2-65f1575cf856:d2af606f-149b-8b2f-5693-b4336dbbb856"
            data-wf-ao-click-engagement-tracking="true"
            data-wf-element-id="d2af606f-149b-8b2f-5693-b4336dbbb856"
            data-wf-component-context="%5B%7B%22componentId%22%3A%22d5f92b82-978f-a770-3f25-8224578da03a%22%2C%22instanceId%22%3A%2220f5aab3-bb9e-bf4b-b6b2-65f1575cf856%22%7D%5D"
            href="https://www.instagram.com/echologic.lab/"
            target="_blank"
            className="link t-large"
          >
            ↗ AI Lab
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
                  backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68fb8277d242196cfc68802d_Mars_Glasses_Hero_Portait_v003_web.avif")`,
                }}
                href="/project/mars"
                className="link project-card w-inline-block"
              >
                <div
                  data-w-id="a6b1d65a-6253-497b-f5ad-8b354b24b4e3"
                  className="project-title"
                >
                  Oakley
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
                  backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68fb923211684ccad8ba7f6f_230124_OP1_v003_1_Main_0001_web.avif")`,
                }}
                href="/project/teenage-engineering"
                className="link project-card w-inline-block"
              >
                <div
                  data-w-id="a6b1d65a-6253-497b-f5ad-8b354b24b4e3"
                  className="project-title"
                >
                  Teenage Engineering
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
                  backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/69010151686bcc9bfa2af042_Cover_image-v2.avif")`,
                }}
                href="/project/innovation-lab"
                className="link project-card w-inline-block"
              >
                <div
                  data-w-id="a6b1d65a-6253-497b-f5ad-8b354b24b4e3"
                  className="project-title"
                >
                  Ray-Ban
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
                  backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6900e837866d7e691a0e9ae3_SAMSUNG_BnB_OPENING_FINAL_3709_web.avif")`,
                }}
                href="/project/beats-n-buckets"
                className="link project-card w-inline-block"
              >
                <div
                  data-w-id="a6b1d65a-6253-497b-f5ad-8b354b24b4e3"
                  className="project-title"
                >
                  Samsung
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
                  backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6900efeaf6cde121118c4036_250305_Moncler_Grenoble_Ticket_Cover00164_web.avif")`,
                }}
                href="/project/moncler-grenoble"
                className="link project-card w-inline-block"
              >
                <div
                  data-w-id="a6b1d65a-6253-497b-f5ad-8b354b24b4e3"
                  className="project-title"
                >
                  Moncler
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
                  backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6863fb29be7faa9be9331c2f_OAK23_CATALYST_13.11_Metaphor_16x6.jpg")`,
                }}
                href="/project/13-11"
                className="link project-card w-inline-block"
              >
                <div
                  data-w-id="a6b1d65a-6253-497b-f5ad-8b354b24b4e3"
                  className="project-title"
                >
                  Oakley
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
                  backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6900ec9e83ce6ba9cfe2a137_we-are-rewind-titel.avif")`,
                }}
                href="/project/we-are-rewind"
                className="link project-card w-inline-block"
              >
                <div
                  data-w-id="a6b1d65a-6253-497b-f5ad-8b354b24b4e3"
                  className="project-title"
                >
                  We Are Rewind
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
                  backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68921423739f1125120c9884_hero_Hatton_Labs_AP_Stills_Watch_009_v002_0000_Black.avif")`,
                }}
                href="/project/hatton-labs-x-ap"
                className="link project-card w-inline-block"
              >
                <div
                  data-w-id="a6b1d65a-6253-497b-f5ad-8b354b24b4e3"
                  className="project-title"
                >
                  Hatton Labs
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
        <div id="scrollto" className="gap-80"></div>
        <div className="container _5-grid">
          <div id="w-node-_868d1110-b12c-1f1a-6951-19194e763c46-256fe678"></div>
          <div id="w-node-_07ba283e-d6d6-55a6-8ecc-27cf9d894ec7-256fe678">
            <div
              data-w-id="7256aa37-c59c-faaf-e9fb-6a5ef41e1011"
              style={{ opacity: 1 }}
              className="motto"
            >
              Visual precision, designed to resonate
            </div>
          </div>
        </div>
        <div id="showreel" className="container _5-grid">
          <div id="w-node-a83bf4c9-7318-1161-7fa0-1f567b3d4e71-256fe678">
            <div>Showreel</div>
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
                  <source
                    src="https://cdn.styleframe.de/SF_Showreel_2025_FINAL.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
            </div>
          </div>
        </div>
        <div className="gap-80"></div>
        <div words-slide-up="" text-split="" className="container">
          <div>
            <div>
              Styleframe GmbH
              <br />
              Based in
              <br />
              Frankfurt am Main
            </div>
          </div>
          <div id="w-node-_2cb51c69-c4b8-8fd1-4c5c-0440af9c465c-256fe678">
            <div className="t-large">
              Styleframe is a design and CGI animation studio driven by clarity,
              craft, and creative vision. Projects are approached with precision
              and purpose, ensuring every detail contributes to meaningful
              visual impact.
            </div>
          </div>
          <div id="w-node-_2cb51c69-c4b8-8fd1-4c5c-0440af9c465f-256fe678">
            <div className="t-large">
              Collaboration with international clients shapes the work, always
              balancing experimentation with refined execution.
            </div>
            <div className="gap-40"></div>
            <a
              data-wf-native-id-path="2cb51c69-c4b8-8fd1-4c5c-0440af9c4663"
              data-wf-ao-click-engagement-tracking="true"
              data-wf-element-id="2cb51c69-c4b8-8fd1-4c5c-0440af9c4663"
              href="/studio"
              className="link l-large right-arrow"
            >
              Read More
            </a>
          </div>
        </div>
        <div className="gap-120"></div>
        <div words-slide-up="" text-split="" className="container">
          <div>
            <div className="gap-15"></div>
            <div>Awards</div>
          </div>
          <div id="w-node-d48b33b4-4f55-d80e-e9f8-fe8192c56aee-256fe678">
            <div className="carousel-wrp">
              <div className="carousel">
                <div
                  data-w-id="23bbced2-e113-b288-9ae4-e1b1c477c475"
                  className="overflow-hidden w-dyn-list"
                >
                  <div
                    data-w-id="23bbced2-e113-b288-9ae4-e1b1c477c476"
                    role="list"
                    className="scroll-list w-dyn-items"
                  >
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        04 x World Media Festivals
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        04 x Worldfest Houston
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        01 x Berlin Movie Awards
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        02 x Vegas Movie Awards
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        01 x New York Movie Awards
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        03 x Red Movie Awards
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">01 x Lafa Awards</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden w-dyn-list">
                  <div role="list" className="scroll-list w-dyn-items">
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        04 x World Media Festivals
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        04 x Worldfest Houston
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        01 x Berlin Movie Awards
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        02 x Vegas Movie Awards
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        01 x New York Movie Awards
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        03 x Red Movie Awards
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">01 x Lafa Awards</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden w-dyn-list">
                  <div role="list" className="scroll-list w-dyn-items">
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        04 x World Media Festivals
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        04 x Worldfest Houston
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        01 x Berlin Movie Awards
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        02 x Vegas Movie Awards
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        01 x New York Movie Awards
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        03 x Red Movie Awards
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">01 x Lafa Awards</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden w-dyn-list">
                  <div role="list" className="scroll-list w-dyn-items">
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        04 x World Media Festivals
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        04 x Worldfest Houston
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        01 x Berlin Movie Awards
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        02 x Vegas Movie Awards
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        01 x New York Movie Awards
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">
                        03 x Red Movie Awards
                      </div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">01 x Lafa Awards</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                      <div className="t-large-no-anim">Audi</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Bose</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Deutsche Bank</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Lionsgate</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Michelin</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Moncler</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Oakley</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Opel</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Ray-Ban</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Sonra</div>
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
                      <div className="t-large-no-anim">Audi</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Bose</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Deutsche Bank</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Lionsgate</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Michelin</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Moncler</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Oakley</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Opel</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Ray-Ban</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Sonra</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden w-dyn-list">
                  <div role="list" className="scroll-list w-dyn-items">
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Audi</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Bose</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Deutsche Bank</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Lionsgate</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Michelin</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Moncler</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Oakley</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Opel</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Ray-Ban</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Sonra</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden w-dyn-list">
                  <div role="list" className="scroll-list w-dyn-items">
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Audi</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Bose</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Deutsche Bank</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Lionsgate</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Michelin</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Moncler</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Oakley</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Opel</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Ray-Ban</div>
                      <div className="t-large-no-anim t-gray">●</div>
                    </div>
                    <div role="listitem" className="scroll-item w-dyn-item">
                      <div className="t-large-no-anim">Sonra</div>
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
              href="/project-index"
              className="link l-large right-arrow"
            >
              All Projects
            </a>
          </div>
        </div>
        <div className="gap-80"></div>
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
              data-wf-native-id-path="25bbb818-505b-4eef-f059-e84f2ae1b087:d636055f-4a21-6155-01a4-3396fc0d09e9"
              data-wf-ao-click-engagement-tracking="true"
              data-wf-element-id="d636055f-4a21-6155-01a4-3396fc0d09e9"
              data-wf-component-context="%5B%7B%22componentId%22%3A%22d636055f-4a21-6155-01a4-3396fc0d09e3%22%2C%22instanceId%22%3A%2225bbb818-505b-4eef-f059-e84f2ae1b087%22%7D%5D"
              href="https://www.instagram.com/styleframe.studio/"
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
              href="https://www.linkedin.com/company/styleframe"
              target="_blank"
              className="link footer-link right-up-arrow"
            >
              LinkedIn
            </a>
            <a
              data-wf-native-id-path="25bbb818-505b-4eef-f059-e84f2ae1b087:d636055f-4a21-6155-01a4-3396fc0d09ed"
              data-wf-ao-click-engagement-tracking="true"
              data-wf-element-id="d636055f-4a21-6155-01a4-3396fc0d09ed"
              data-wf-component-context="%5B%7B%22componentId%22%3A%22d636055f-4a21-6155-01a4-3396fc0d09e3%22%2C%22instanceId%22%3A%2225bbb818-505b-4eef-f059-e84f2ae1b087%22%7D%5D"
              href="https://www.behance.net/styleframe"
              target="_blank"
              className="link footer-link right-up-arrow"
            >
              Behance
            </a>
            <a
              data-wf-native-id-path="25bbb818-505b-4eef-f059-e84f2ae1b087:663a9216-98a0-5d14-d605-628b564d6c41"
              data-wf-ao-click-engagement-tracking="true"
              data-wf-element-id="663a9216-98a0-5d14-d605-628b564d6c41"
              data-wf-component-context="%5B%7B%22componentId%22%3A%22d636055f-4a21-6155-01a4-3396fc0d09e3%22%2C%22instanceId%22%3A%2225bbb818-505b-4eef-f059-e84f2ae1b087%22%7D%5D"
              href="https://vimeo.com/styleframe"
              target="_blank"
              className="link footer-link right-up-arrow"
            >
              Vimeo
            </a>
            <a
              data-wf-native-id-path="25bbb818-505b-4eef-f059-e84f2ae1b087:8aaf9017-ddd5-9ae3-dc86-58cdc2f708ad"
              data-wf-ao-click-engagement-tracking="true"
              data-wf-element-id="8aaf9017-ddd5-9ae3-dc86-58cdc2f708ad"
              data-wf-component-context="%5B%7B%22componentId%22%3A%22d636055f-4a21-6155-01a4-3396fc0d09e3%22%2C%22instanceId%22%3A%2225bbb818-505b-4eef-f059-e84f2ae1b087%22%7D%5D"
              href="https://www.instagram.com/echologic.lab/"
              target="_blank"
              className="link footer-link right-up-arrow"
            >
              AI Lab
            </a>
          </div>
          <div
            id="w-node-d636055f-4a21-6155-01a4-3396fc0d09ef-fc0d09e3"
            className="footer-column"
          >
            <a
              data-wf-native-id-path="25bbb818-505b-4eef-f059-e84f2ae1b087:d636055f-4a21-6155-01a4-3396fc0d09f0"
              data-wf-ao-click-engagement-tracking="true"
              data-wf-element-id="d636055f-4a21-6155-01a4-3396fc0d09f0"
              data-wf-component-context="%5B%7B%22componentId%22%3A%22d636055f-4a21-6155-01a4-3396fc0d09e3%22%2C%22instanceId%22%3A%2225bbb818-505b-4eef-f059-e84f2ae1b087%22%7D%5D"
              href="/legal/privacy-policy"
              className="link footer-link fl-small"
            >
              Privacy Policy
            </a>
            <a
              data-wf-native-id-path="25bbb818-505b-4eef-f059-e84f2ae1b087:d636055f-4a21-6155-01a4-3396fc0d09f2"
              data-wf-ao-click-engagement-tracking="true"
              data-wf-element-id="d636055f-4a21-6155-01a4-3396fc0d09f2"
              data-wf-component-context="%5B%7B%22componentId%22%3A%22d636055f-4a21-6155-01a4-3396fc0d09e3%22%2C%22instanceId%22%3A%2225bbb818-505b-4eef-f059-e84f2ae1b087%22%7D%5D"
              href="/legal/imprint"
              className="link footer-link fl-small"
            >
              Imprint
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
              href="/project-index"
              className="link footer-link right-arrow"
            >
              Index
            </a>
            <a
              data-wf-native-id-path="25bbb818-505b-4eef-f059-e84f2ae1b087:d636055f-4a21-6155-01a4-3396fc0d09f7"
              data-wf-ao-click-engagement-tracking="true"
              data-wf-element-id="d636055f-4a21-6155-01a4-3396fc0d09f7"
              data-wf-component-context="%5B%7B%22componentId%22%3A%22d636055f-4a21-6155-01a4-3396fc0d09e3%22%2C%22instanceId%22%3A%2225bbb818-505b-4eef-f059-e84f2ae1b087%22%7D%5D"
              href="/research"
              className="link footer-link right-arrow"
            >
              Research
            </a>
            <a
              data-wf-native-id-path="25bbb818-505b-4eef-f059-e84f2ae1b087:d636055f-4a21-6155-01a4-3396fc0d09f9"
              data-wf-ao-click-engagement-tracking="true"
              data-wf-element-id="d636055f-4a21-6155-01a4-3396fc0d09f9"
              data-wf-component-context="%5B%7B%22componentId%22%3A%22d636055f-4a21-6155-01a4-3396fc0d09e3%22%2C%22instanceId%22%3A%2225bbb818-505b-4eef-f059-e84f2ae1b087%22%7D%5D"
              href="/studio"
              className="link footer-link right-arrow"
            >
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
        <div className="footer-logo-cont">
          <div className="footer-logo-wrp">
            <div className="footer-logo-frame">
              <div className="logo-frame-wrp">
                <div className="collection-list-wrp-logo-anim w-dyn-list">
                  <div
                    role="list"
                    className="collection-list-logo-anim w-dyn-items"
                  >
                    <div
                      style={{
                        backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42f32e179658fc220ff71_20.avif")`,
                      }}
                      role="listitem"
                      className="collection-item-logo-anim w-dyn-item"
                    ></div>
                    <div
                      style={{
                        backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42f2a1bc30a29cc9dde23_19.avif")`,
                      }}
                      role="listitem"
                      className="collection-item-logo-anim w-dyn-item"
                    ></div>
                    <div
                      style={{
                        backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42ea7b8caf2e461da972d_18.avif")`,
                      }}
                      role="listitem"
                      className="collection-item-logo-anim w-dyn-item"
                    ></div>
                    <div
                      style={{
                        backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42e9dab059fd303cb59bb_17.avif")`,
                      }}
                      role="listitem"
                      className="collection-item-logo-anim w-dyn-item"
                    ></div>
                    <div
                      style={{
                        backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42e8c9b02ae0d1681b7b8_16.avif")`,
                      }}
                      role="listitem"
                      className="collection-item-logo-anim w-dyn-item"
                    ></div>
                    <div
                      style={{
                        backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42cb457683fdcaecf34aa_15.avif")`,
                      }}
                      role="listitem"
                      className="collection-item-logo-anim w-dyn-item"
                    ></div>
                    <div
                      style={{
                        backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42cabbf94893911f30b8d_14.avif")`,
                      }}
                      role="listitem"
                      className="collection-item-logo-anim w-dyn-item"
                    ></div>
                    <div
                      style={{
                        backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42ca28d03c1d72159ab26_13.avif")`,
                      }}
                      role="listitem"
                      className="collection-item-logo-anim w-dyn-item"
                    ></div>
                    <div
                      style={{
                        backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42c954de027a2c9aa384c_12.avif")`,
                      }}
                      role="listitem"
                      className="collection-item-logo-anim w-dyn-item"
                    ></div>
                    <div
                      style={{
                        backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42c84894ff1d8f915df24_11.avif")`,
                      }}
                      role="listitem"
                      className="collection-item-logo-anim w-dyn-item"
                    ></div>
                    <div
                      style={{
                        backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6886834949596497c68bf5b1_686e821bdf1767b3c81c36e8_231030_RND_DK_010_orangehintergrund_v2%20fog%20Large.avif")`,
                      }}
                      role="listitem"
                      className="collection-item-logo-anim w-dyn-item"
                    ></div>
                    <div
                      style={{
                        backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/688683406e8226dcdd61a12c_6867e107b4d400ad20ad39dd_230303_Firstcolo_Broschure_Rnd_001c_blueAkzent_01%20Large.avif")`,
                      }}
                      role="listitem"
                      className="collection-item-logo-anim w-dyn-item"
                    ></div>
                    <div
                      style={{
                        backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68868334c66e32973ba66caf_686685c2c0df48ad320a646c_230124_OP1_v003_1_Main_0001%20Large.avif")`,
                      }}
                      role="listitem"
                      className="collection-item-logo-anim w-dyn-item"
                    ></div>
                    <div
                      style={{
                        backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6886832b826db4c61cb8afcf_686695b490c6187b4302ded1_We_are_Rewind_Ghetto_Blaster_1x1_07%20Large.avif")`,
                      }}
                      role="listitem"
                      className="collection-item-logo-anim w-dyn-item"
                    ></div>
                    <div
                      style={{
                        backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/688682a866bb85d741dbe468_6862aa2bcc68d0ad5ce0ed3a_mars_cover.avif")`,
                      }}
                      role="listitem"
                      className="collection-item-logo-anim w-dyn-item"
                    ></div>
                    <div
                      style={{
                        backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68868319d36be5e41a195460_6867c4009b5aeeeb46555855_RND_dk_011_0031.avif")`,
                      }}
                      role="listitem"
                      className="collection-item-logo-anim w-dyn-item"
                    ></div>
                    <div
                      style={{
                        backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/688683100007bdc0d6b8d0c4_6867d7d6a8c71bddc3942a28_2.avif")`,
                      }}
                      role="listitem"
                      className="collection-item-logo-anim w-dyn-item"
                    ></div>
                    <div
                      style={{
                        backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/688682ff1da9335baedef285_6867f5123aa787b54ba2cafe_7.avif")`,
                      }}
                      role="listitem"
                      className="collection-item-logo-anim w-dyn-item"
                    ></div>
                    <div
                      style={{
                        backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/688682fa186bbdce6c8fe845_686bf6bd7fb6fdadca975d14_cover%20image-web-497237698_18509548351001463_3505879398570363264_n.avif")`,
                      }}
                      role="listitem"
                      className="collection-item-logo-anim w-dyn-item"
                    ></div>
                    <div
                      style={{
                        backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/688682a866bb85d741dbe468_6862aa2bcc68d0ad5ce0ed3a_mars_cover.avif")`,
                      }}
                      role="listitem"
                      className="collection-item-logo-anim w-dyn-item"
                    ></div>
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

export default App;
