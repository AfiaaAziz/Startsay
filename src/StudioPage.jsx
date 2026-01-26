import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

function StudioPage() {
  const pageRef = useRef(null);

  useEffect(() => {
    // Load jQuery and Webflow scripts dynamically
    const loadScript = (src, integrity = null) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        if (integrity) script.integrity = integrity;
        script.crossOrigin = integrity ? "anonymous" : null;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    // Load external scripts
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
        "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe67c/js/webflow.abe4dd2f.a1bf77bd6e7f229c.js",
      ),
    ]).catch((err) => console.log("Script loading error:", err));

    // Text split animations
    let typeSplit;
    const runSplit = () => {
      typeSplit = new SplitType("[text-split]", {
        types: "words, chars",
        tagName: "span",
      });

      // Link timelines to scroll position
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

      gsap.set("[text-split]", { opacity: 1 });
    };

    runSplit();

    // Line split animation
    let lineSplit;
    const runLineSplit = () => {
      lineSplit = new SplitType(".split-lines", {
        types: "lines, words",
      });
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

    // Team drag scroller
    const scroller = document.querySelector(".cms-list-team");
    if (scroller) {
      const IS_DESKTOP = window.matchMedia?.(
        "(hover: hover) and (pointer: fine)",
      ).matches;

      if (IS_DESKTOP) {
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

        scroller.addEventListener("pointerdown", onPointerDown, {
          passive: true,
        });
        scroller.addEventListener("pointermove", onPointerMove, {
          passive: false,
        });
        scroller.addEventListener("pointerup", endDrag, { passive: true });
        scroller.addEventListener("pointercancel", endDrag, {
          passive: true,
        });
        scroller.addEventListener(
          "pointerleave",
          (e) => {
            if (!scroller.hasPointerCapture?.(activePointerId)) endDrag(e);
          },
          { passive: true },
        );

        window.addEventListener(
          "blur",
          () => endDrag({ pointerId: activePointerId }),
          { passive: true },
        );

        return () => {
          scroller.removeEventListener("pointerdown", onPointerDown);
          scroller.removeEventListener("pointermove", onPointerMove);
          scroller.removeEventListener("pointerup", endDrag);
          scroller.removeEventListener("pointercancel", endDrag);
          scroller.removeEventListener("pointerleave", endDrag);
          window.removeEventListener("blur", endDrag);
        };
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      carouselIntervals.forEach((id) => clearTimeout(id));
      if (typeSplit) typeSplit.revert();
      if (lineSplit) lineSplit.revert();
    };
  }, []);

  const studioImages = [
    "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68ee6ddf3fc3885121b907ee_Studio_Edit_Selection_Web_v001_0010.avif",
    "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/690a2b03914f559250f8572a_Studio_Edit_Selection_Web_v002_0000_0000_SF_Studio_Edit_v2-52.avif",
    "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/690509e32cb72754ae848f6a_SF_Studio_Edit_v2-53%20(1).avif",
  ];

  const sliderImages = [
    "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/690a2b20cddfb71d5949e555_Studio_Edit_Selection_Web_v002_0000_0013_SF_Studio_Edit_v2-39.avif",
    "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/690a2b03914f559250f8572a_Studio_Edit_Selection_Web_v002_0000_0000_SF_Studio_Edit_v2-52.avif",
    "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/690509e32cb72754ae848f6a_SF_Studio_Edit_v2-53%20(1).avif",
    "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f9f883cf09f60d16bd7e90_Studio_Edit_Selection_Web_v002_0000_0024_SF_Studio_Edit_v2-28.avif",
    "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f9f7c9448e01ee222c4792_Studio_Edit_Selection_Web_v002_0000_0043_SF_Studio_Edit_v2-9.avif",
    "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f9f7d13ea4e2beff5d1cf7_Studio_Edit_Selection_Web_v002_0000_0014_SF_Studio_Edit_v2-38.avif",
    "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f9f7d948381a19e7aa0f31_Studio_Edit_Selection_Web_v002_0000_0027_SF_Studio_Edit_v2-25b.avif",
    "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f9f7e44691e0454e399c1d_Studio_Edit_Selection_Web_v002_0000_0010_SF_Studio_Edit_v2-42.avif",
    "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f9f80438b622db140ec8e1_Studio_Edit_Selection_Web_v002_0000_0034_SF_Studio_Edit_v2-19.avif",
    "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f9f80c89799113b8c98300_Studio_Edit_Selection_Web_v002_0000_0041_SF_Studio_Edit_v2-11.avif",
    "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f9f814483fcea9103d2b49_Studio_Edit_Selection_Web_v002_0000_0004_SF_Studio_Edit_v2-48.avif",
    "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f9f821e8dbfe6ba3373af5_Studio_Edit_Selection_Web_v002_0000_0035_SF_Studio_Edit_v2-18.avif",
    "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f9f828873523313595236c_Studio_Edit_Selection_Web_v002_0000_0001_SF_Studio_Edit_v2-51.avif",
    "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68ee6ddf3fc3885121b907ee_Studio_Edit_Selection_Web_v001_0010.avif",
    "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68f9f831e3f913223df5df33_Studio_Edit_Selection_Web_v002_0000_0011_SF_Studio_Edit_v2-41.avif",
  ];

  const teamMembers = [
    {
      name: "Robin",
      title: "Founder & CEO",
      img: "68ee35284412b64fabb6a434_SF_Portraits_Robin_Final_Blur.avif",
    },
    {
      name: "Tim",
      title: "3D Designer",
      img: "68ee35013dd7d3f72fcabcd1_SF_Portraits_Tim_Final_Blur.avif",
    },
    {
      name: "Leon",
      title: "Art Director",
      img: "68ee354d777ee4ff4b6c96ab_SF_Portraits_Leon_Final_Blur.avif",
    },
    {
      name: "Susanne",
      title: "Digital Artist",
      img: "68f0ffe81feb96d1aab1818c_SF_Portraits_Susanne_Final_Blur_v2.avif",
    },
    {
      name: "Lorenzo",
      title: "Producer",
      img: "68ee35368c68ed7d1a4c30aa_SF_Portraits_Lorenzo_Final_Blur.avif",
    },
    {
      name: "Denys",
      title: "3D Designer",
      img: "68ee353d562ff2e2a5f4adf8_SF_Portraits_Denys_Final_Blur.avif",
    },
    {
      name: "Shirley",
      title: "Producer",
      img: "68ee352248913abd5ae9598d_SF_Portraits_Shirley_Final_Blur.avif",
    },
    {
      name: "Colin",
      title: "Director & Editor",
      img: "68ee35566f7ab6229138a2b4_SF_Portraits_Colin_Final_Blur.avif",
    },
    {
      name: "Lukas",
      title: "3D Designer",
      img: "68ee352e562ff2e2a5f4aa40_SF_Portraits_Lukas_Final_Blur.avif",
    },
    {
      name: "Andre",
      title: "3D Designer / TD",
      img: "68ee355e74d0eff38a24440a_SF_Portraits_Andre_Final_Blur.avif",
    },
    {
      name: "Victor",
      title: "3D Designer",
      img: "68ee354313087b95211028b8_SF_Portraits_Victor_Final_Blur.avif",
    },
    {
      name: "Janic",
      title: "3D Designer",
      img: "68ee350e62d9c1fccfde9981_SF_Portraits_Jannic_Final_Blur.avif",
    },
  ];

  const logoAnimImages = [
    "68e42f32e179658fc220ff71_20.avif",
    "68e42f2a1bc30a29cc9dde23_19.avif",
    "68e42ea7b8caf2e461da972d_18.avif",
    "68e42e9dab059fd303cb59bb_17.avif",
    "68e42e8c9b02ae0d1681b7b8_16.avif",
    "68e42cb457683fdcaecf34aa_15.avif",
    "68e42cabbf94893911f30b8d_14.avif",
    "68e42ca28d03c1d72159ab26_13.avif",
    "68e42c954de027a2c9aa384c_12.avif",
    "68e42c84894ff1d8f915df24_11.avif",
    "6886834949596497c68bf5b1_686e821bdf1767b3c81c36e8_231030_RND_DK_010_orangehintergrund_v2%20fog%20Large.avif",
    "688683406e8226dcdd61a12c_6867e107b4d400ad20ad39dd_230303_Firstcolo_Broschure_Rnd_001c_blueAkzent_01%20Large.avif",
    "68868334c66e32973ba66caf_686685c2c0df48ad320a646c_230124_OP1_v003_1_Main_0001%20Large.avif",
    "6886832b826db4c61cb8afcf_686695b490c6187b4302ded1_We_are_Rewind_Ghetto_Blaster_1x1_07%20Large.avif",
    "688682a866bb85d741dbe468_6862aa2bcc68d0ad5ce0ed3a_mars_cover.avif",
    "68868319d36be5e41a195460_6867c4009b5aeeeb46555855_RND_dk_011_0031.avif",
    "688683100007bdc0d6b8d0c4_6867d7d6a8c71bddc3942a28_2.avif",
    "688682ff1da9335baedef285_6867f5123aa787b54ba2cafe_7.avif",
    "688682fa186bbdce6c8fe845_686bf6bd7fb6fdadca975d14_cover%20image-web-497237698_18509548351001463_3505879398570363264_n.avif",
    "688682a866bb85d741dbe468_6862aa2bcc68d0ad5ce0ed3a_mars_cover.avif",
  ];

  return (
    <div ref={pageRef}>
      <div className="section hero-studio">
        <div
          data-w-id="41581821-281b-5340-029b-f2cb43f3ec89"
          className="studio-heading-wrp"
        >
          <h1
            id="w-node-_3b410aeb-a2d0-349a-44a3-4d43b6c0bed9-256fe6c8"
            className="studio-heading"
          >
            Shaping
            <br />
            thoughts
          </h1>
        </div>
        <div
          data-w-id="bac6ccc3-b1b3-4b34-bec7-e9322b305e2a"
          className="studio-heading-wrp"
        >
          <div
            words-slide-up=""
            text-split=""
            id="w-node-_531d84bb-34db-2cf5-f00c-83ae8951effc-256fe6c8"
            className="studio-heading t-primary"
            style={{ opacity: 1 }}
          >
            into iconic visuals.
          </div>
        </div>
        <div className="collection-list-wrp-stud w-dyn-list">
          <div role="list" className="collection-list-stud w-dyn-items">
            {studioImages.map((url, index) => (
              <div
                key={index}
                data-w-id="fd119206-2a34-ff29-2923-aae0e3814796"
                style={{
                  backgroundImage: `url("${url}")`,
                }}
                role="listitem"
                className="collection-item-stud w-dyn-item"
              >
                <div className="studio-hero-img"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section pad-5">
        <div className="container _2-grid">
          <div id="w-node-a015b895-5327-9b52-18a8-86eb25046afe-256fe6c8">
            <div
              words-slide-up=""
              text-split=""
              className="t-large"
              style={{ opacity: 1 }}
            >
              The studio's process is rooted in careful listening, clear
              planning, and meticulous execution. Each project begins with a
              shared understanding of objectives, developing into visuals that
              are both impactful and enduring.
              <br />
              <br />
              Styleframe offers expertise across visual effects,
              post-production, creative direction, animation direction, and CGI
              production. Each service is tailored to the needs of the project,
              ensuring flexibility while maintaining uncompromising standards.
            </div>
          </div>
          <div id="w-node-_34137bb5-6e30-fef7-98ba-ce3c58c7b13e-256fe6c8">
            <div
              words-slide-up=""
              text-split=""
              className="t-large"
              style={{ opacity: 1 }}
            >
              Dedicated research and look development keep the studio at the
              forefront of technology and aesthetics. Every commission is an
              opportunity to refine methods, push boundaries, and deliver
              visuals that resonate.
            </div>
          </div>
        </div>
        <div className="container _2-grid">
          <div id="w-node-f93ddf6f-87e1-b663-a6c1-6b9a31b54410-256fe6c8">
            <div className="gap-40"></div>
            <div
              words-slide-up=""
              text-split=""
              className="list-title"
              style={{ opacity: 1 }}
            >
              <strong style={{ display: "inline-block", position: "relative" }}>
                Services
              </strong>
            </div>
            <div className="gap-20"></div>
            <div className="w-dyn-list">
              <div role="list" className="service-list w-dyn-items">
                {[
                  "3D Motion",
                  "Conception & Design",
                  "Research & Visual Development",
                  "Creative, Art & Animation Direction",
                  "CGI Still & Animation Production",
                  "AI Direction & Execution",
                  "Visual Effects",
                ].map((service, index) => (
                  <div
                    key={index}
                    role="listitem"
                    className="service-item w-dyn-item"
                  >
                    <div>{service}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div id="w-node-f93ddf6f-87e1-b663-a6c1-6b9a31b5441e-256fe6c8">
            <div className="gap-40"></div>
            <div
              words-slide-up=""
              text-split=""
              className="list-title"
              style={{ opacity: 1 }}
            >
              <strong style={{ display: "inline-block", position: "relative" }}>
                Selected Clients
              </strong>
            </div>
            <div className="gap-20"></div>
            <div className="w-dyn-list">
              <div role="list" className="client-list w-dyn-items">
                {[
                  "Audi",
                  "Bose",
                  "Deutsche Bank",
                  "Ferrero",
                  "Hatton Labs",
                  "Lionsgate",
                  "Michelin",
                  "Microsoft",
                  "Moncler",
                  "Nickelodeon",
                  "Oakley",
                  "Opel",
                  "Ray-Ban",
                  "Samsung",
                  "Sonra",
                  "rabbit",
                ].map((client, index) => (
                  <div
                    key={index}
                    words-slide-up=""
                    text-split=""
                    role="listitem"
                    className="w-dyn-item"
                    style={{ opacity: 1 }}
                  >
                    <div
                      style={{ display: "inline-block", position: "relative" }}
                    >
                      {client}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="gap-80"></div>
        <div className="gap-80"></div>
      </div>

      <div className="section studio-interior">
        <div className="w-dyn-list" style={{ display: "none" }}>
          <div
            fs-cmsslider-element="list"
            role="list"
            className="w-dyn-items"
          ></div>
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
          role="region"
          aria-label="carousel"
        >
          <div className="w-slider-mask" id="w-slider-mask-0">
            {sliderImages.map((url, index) => (
              <div
                key={index}
                className="w-slide"
                aria-label={`${index + 1} of ${sliderImages.length}`}
                role="group"
                style={{
                  backgroundImage: `url("${url}")`,
                }}
              >
                <div className="slider-item w-dyn-item"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section team-title-wrp">
        <h2 className="team-heading">Team</h2>
      </div>
      <div className="section studio-team">
        <div className="cms-list-wrp-team w-dyn-list">
          <div role="list" className="cms-list-team w-dyn-items">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                item={member.name.toLowerCase()}
                role="listitem"
                className="cms-item-team w-dyn-item"
              >
                <div className="team-name">{member.name}</div>
                <div className="team-title">{member.title}</div>
                <div
                  style={{
                    backgroundImage: `url("https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/${member.img}")`,
                  }}
                  className="team-photo"
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudioPage;
