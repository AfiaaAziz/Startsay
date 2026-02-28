import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "./components/Footer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { useVideoPlayer } from "./hooks/useVideoPlayer";
import { clientProjects } from "./data/clientProjects";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function ClientPage({ isContactOpen, setIsContactOpen }) {
  useVideoPlayer();

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
          setTimeout(rotate, 5000);
        }
        rotate();
      });
    };

    // Wait a bit for libraries to load and DOM to settle
    const timer = setTimeout(initializeAnimations, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => { }, []);

  // Handle index hover video positioning and visibility
  useEffect(() => {
    const indexItems = document.querySelectorAll(".index-item");

    // Map each hover element to its GSAP quickTo setters for silky smooth following
    const quickToMap = new WeakMap();

    const getOrCreateQuickTo = (video) => {
      if (quickToMap.has(video)) return quickToMap.get(video);

      // Set GPU acceleration hint once
      video.style.willChange = "transform";

      const xTo = gsap.quickTo(video, "x", { duration: 0.6, ease: "power3.out" });
      const yTo = gsap.quickTo(video, "y", { duration: 0.6, ease: "power3.out" });
      const setters = { xTo, yTo };
      quickToMap.set(video, setters);
      return setters;
    };


    const handleItemMouseEnter = (e) => {
      const hoverVideo = e.currentTarget.querySelector(".index-hover");
      if (hoverVideo) {
        const videoWidth = hoverVideo.offsetWidth || window.innerWidth * 0.25;
        const videoHeight = hoverVideo.offsetHeight || videoWidth * (9 / 16);
        const startX = e.clientX - videoWidth / 2;
        const startY = e.clientY - videoHeight / 2;

        // Snap to cursor first, then create quickTo (prevents fly-in from stale position)
        gsap.set(hoverVideo, { x: startX, y: startY });
        getOrCreateQuickTo(hoverVideo);
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
        const videoWidth = video.offsetWidth || window.innerWidth * 0.25;
        const videoHeight = video.offsetHeight || videoWidth * (9 / 16);

        // Target position centred on cursor
        const targetX = e.clientX - videoWidth / 2;
        const targetY = e.clientY - videoHeight / 2;

        // Use GSAP quickTo for smooth lerp-based following (silky smooth)
        const { xTo, yTo } = getOrCreateQuickTo(video);
        xTo(targetX);
        yTo(targetY);
      });
    };

    // Touch Event Handlers
    const handleTouchStart = (e) => {
      const hoverVideo = e.currentTarget.querySelector(".index-hover");
      if (hoverVideo) {
        hoverVideo.style.display = "block";
        hoverVideo.setAttribute("data-visible", "true");

        const touch = e.touches[0];
        const videoWidth = hoverVideo.offsetWidth || 320;
        const videoHeight = hoverVideo.offsetHeight || 180;

        const targetX = touch.clientX - videoWidth / 2;
        const targetY = touch.clientY - videoHeight / 2;

        const { xTo, yTo } = getOrCreateQuickTo(hoverVideo);
        xTo(targetX);
        yTo(targetY);
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
        const touch = e.touches[0];
        visibleVideos.forEach((video) => {
          const videoWidth = video.offsetWidth || 320;
          const videoHeight = video.offsetHeight || 180;

          const targetX = touch.clientX - videoWidth / 2;
          const targetY = touch.clientY - videoHeight / 2;

          const { xTo, yTo } = getOrCreateQuickTo(video);
          xTo(targetX);
          yTo(targetY);
        });
      }
    };

    indexItems.forEach((item) => {
      item.addEventListener("mouseenter", handleItemMouseEnter);
      item.addEventListener("mouseleave", handleItemMouseLeave);
      item.addEventListener("touchstart", handleTouchStart, { passive: true });
      item.addEventListener("touchend", handleTouchEnd);
      item.addEventListener("touchcancel", handleTouchEnd);
    });

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      indexItems.forEach((item) => {
        item.removeEventListener("mouseenter", handleItemMouseEnter);
        item.removeEventListener("mouseleave", handleItemMouseLeave);
        item.removeEventListener("touchstart", handleTouchStart);
        item.removeEventListener("touchend", handleTouchEnd);
        item.removeEventListener("touchcancel", handleTouchEnd);
      });
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <>
      <div className="section">
        <div className="gap-100"></div>
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
              {Object.values(clientProjects).map((project) => (
                <div key={project.slug} role="listitem" className="index-item w-dyn-item">
                  <Link
                    to={`/client-project/${project.slug}`}
                    className="link table-row w-inline-block"
                  >
                    <div className="index-1st-col-wrp">
                      <div className="t-large mob-size">{project.year}</div>
                    </div>
                    <div className="t-large">{project.client}</div>
                    <div className="t-large">{project.projectName}</div>
                  </Link>
                  <div className="index-hover">
                    <div className="index-hover-vid w-embed">
                      {project.heroVideo ? (
                        <video
                          autoPlay
                          muted
                          loop
                          playsInline
                          disablePictureInPicture
                          disableRemotePlayback
                          poster={project.heroImage}
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                          }}
                        >
                          <source src={project.heroVideo} type="video/mp4" />
                        </video>
                      ) : (
                        <img
                          src={project.heroImage}
                          alt={project.title}
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ClientPage;
