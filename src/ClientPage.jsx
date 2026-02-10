import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "./components/Footer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { useVideoPlayer } from "./hooks/useVideoPlayer";

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
        const videoWidth = 320;
        const videoHeight = 180;

        const offsetX =
          touch.clientX - (hoverVideo.offsetWidth || videoWidth) / 2;
        const offsetY =
          touch.clientY - (hoverVideo.offsetHeight || videoHeight) / 2;

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
        // REMOVED preventDefault to allow scrolling

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
      // Changed to passive: true to allow scrolling
      item.addEventListener("touchstart", handleTouchStart, { passive: true });
      item.addEventListener("touchend", handleTouchEnd);
      item.addEventListener("touchcancel", handleTouchEnd); // Handle scroll cancellation
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
              <div role="listitem" className="index-item w-dyn-item">
                <Link
                  to="/project/samsung-wearables"
                  className="link table-row w-inline-block"
                >
                  <div className="index-1st-col-wrp">
                    <div className="t-large mob-size">2021</div>
                  </div>
                  <div className="t-large">USAID</div>
                  <div className="t-large">
                    COVID-19 Pandemic Explainer Animation
                  </div>
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

              <div role="listitem" className="index-item w-dyn-item">
                <Link
                  to="/project/plantaris-ti"
                  className="link table-row w-inline-block"
                >
                  <div className="index-1st-col-wrp">
                    <div className="t-large mob-size">2024</div>
                  </div>
                  <div className="t-large">DIFC</div>
                  <div className="t-large">Social media content</div>
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

              <div role="listitem" className="index-item w-dyn-item">
                <Link
                  to="/project/beats-n-buckets"
                  className="link table-row w-inline-block"
                >
                  <div className="index-1st-col-wrp">
                    <div className="t-large mob-size">2022</div>
                  </div>
                  <div className="t-large">UNODC</div>
                  <div className="t-large">Explainer Animations</div>
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

              <div role="listitem" className="index-item w-dyn-item">
                <Link
                  to="/project/innovation-lab"
                  className="link table-row w-inline-block"
                >
                  <div className="index-1st-col-wrp">
                    <div className="t-large mob-size">2025</div>
                  </div>
                  <div className="t-large">FrontRow Entertainment</div>
                  <div className="t-large">Hollywood Posters</div>
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

              <div role="listitem" className="index-item w-dyn-item">
                <Link
                  to="/project/cltr-rdfnd-7nt5r"
                  className="link table-row w-inline-block"
                >
                  <div className="index-1st-col-wrp">
                    <div className="t-large mob-size">2025</div>
                  </div>
                  <div className="t-large">Marriott</div>
                  <div className="t-large">Digital & Print Menu</div>
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

              <div role="listitem" className="index-item w-dyn-item">
                <Link
                  to="/project/wolf-shepherd"
                  className="link table-row w-inline-block"
                >
                  <div className="index-1st-col-wrp">
                    <div className="t-large mob-size">2024</div>
                  </div>
                  <div className="t-large">Parkview City</div>
                  <div className="t-large">Commercials</div>
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

              <div role="listitem" className="index-item w-dyn-item">
                <Link
                  to="/project/moncler-grenoble"
                  className="link table-row w-inline-block"
                >
                  <div className="index-1st-col-wrp">
                    <div className="t-large mob-size">2025</div>
                  </div>
                  <div className="t-large">Intercity Hotel</div>
                  <div className="t-large">Promotional Reels</div>
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

              <div role="listitem" className="index-item w-dyn-item">
                <Link
                  to="/project/moncler-grenoble"
                  className="link table-row w-inline-block"
                >
                  <div className="index-1st-col-wrp">
                    <div className="t-large mob-size">2024</div>
                  </div>
                  <div className="t-large">POF</div>
                  <div className="t-large">Presentational Videos</div>
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

              <div role="listitem" className="index-item w-dyn-item">
                <Link
                  to="/project/moncler-grenoble"
                  className="link table-row w-inline-block"
                >
                  <div className="index-1st-col-wrp">
                    <div className="t-large mob-size">2023</div>
                  </div>
                  <div className="t-large">WAH Industries Limited</div>
                  <div className="t-large">Promotional Profiles</div>
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

              <div role="listitem" className="index-item w-dyn-item">
                <Link
                  to="/project/moncler-grenoble"
                  className="link table-row w-inline-block"
                >
                  <div className="index-1st-col-wrp">
                    <div className="t-large mob-size">2025</div>
                  </div>
                  <div className="t-large">Neuro</div>
                  <div className="t-large">Promotional Content</div>
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

              <div role="listitem" className="index-item w-dyn-item">
                <Link
                  to="/project/moncler-grenoble"
                  className="link table-row w-inline-block"
                >
                  <div className="index-1st-col-wrp">
                    <div className="t-large mob-size">2026</div>
                  </div>
                  <div className="t-large">Millennium Aesthetic</div>
                  <div className="t-large">Digital Campaigns</div>
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

              <div role="listitem" className="index-item w-dyn-item">
                <Link
                  to="/project/moncler-grenoble"
                  className="link table-row w-inline-block"
                >
                  <div className="index-1st-col-wrp">
                    <div className="t-large mob-size">2022</div>
                  </div>
                  <div className="t-large">Zonergy</div>
                  <div className="t-large">Digital Campaigns</div>
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

              <div role="listitem" className="index-item w-dyn-item">
                <Link
                  to="/project/moncler-grenoble"
                  className="link table-row w-inline-block"
                >
                  <div className="index-1st-col-wrp">
                    <div className="t-large mob-size">2025</div>
                  </div>
                  <div className="t-large">COCO Cotton Collection</div>
                  <div className="t-large">Promotional Reels</div>
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

              <div role="listitem" className="index-item w-dyn-item">
                <Link
                  to="/project/moncler-grenoble"
                  className="link table-row w-inline-block"
                >
                  <div className="index-1st-col-wrp">
                    <div className="t-large mob-size">2020</div>
                  </div>
                  <div className="t-large">ONYX Tower</div>
                  <div className="t-large">Architectural Animation</div>
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

              <div role="listitem" className="index-item w-dyn-item">
                <Link
                  to="/project/moncler-grenoble"
                  className="link table-row w-inline-block"
                >
                  <div className="index-1st-col-wrp">
                    <div className="t-large mob-size">2024</div>
                  </div>
                  <div className="t-large">Abraham & Agrimont Tractors</div>
                  <div className="t-large">3D animation</div>
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

              <div role="listitem" className="index-item w-dyn-item">
                <Link
                  to="/project/moncler-grenoble"
                  className="link table-row w-inline-block"
                >
                  <div className="index-1st-col-wrp">
                    <div className="t-large mob-size">2025</div>
                  </div>
                  <div className="t-large">Avtive</div>
                  <div className="t-large">Branding</div>
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

              <div role="listitem" className="index-item w-dyn-item">
                <Link
                  to="/project/moncler-grenoble"
                  className="link table-row w-inline-block"
                >
                  <div className="index-1st-col-wrp">
                    <div className="t-large mob-size">2023</div>
                  </div>
                  <div className="t-large">Trivelles</div>
                  <div className="t-large">Digital Campaigns</div>
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

              <div role="listitem" className="index-item w-dyn-item">
                <Link
                  to="/project/szp"
                  className="link table-row w-inline-block"
                >
                  <div className="index-1st-col-wrp">
                    <div className="t-large mob-size">2025</div>
                  </div>
                  <div className="t-large">NUST</div>
                  <div className="t-large">Promotional Videos</div>
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
    </>
  );
}

export default ClientPage;
