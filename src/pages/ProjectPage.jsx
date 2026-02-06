import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { useVideoPlayer } from "../hooks/useVideoPlayer";
import Footer from "../components/Footer.jsx";
import { getProjectBySlug, getAdjacentProjects } from "../data/projects";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectPage({ isContactOpen, setIsContactOpen }) {
  const { projectSlug } = useParams();
  const [project, setProject] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [next, setNext] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);


  // Fetch Data
  useEffect(() => {
    const data = getProjectBySlug(projectSlug);

    if (data) {
      setProject(data);
      setGalleryImages(data.gallery || []);

      const { previous, next } = getAdjacentProjects(projectSlug);
      setPrevious(previous);
      setNext(next);
    } else {
      setProject(null);
      setGalleryImages([]);
      setPrevious(null);
      setNext(null);
    }
  }, [projectSlug]);

  // Initialize video player
  useVideoPlayer();

  // Text animations
  useEffect(() => {
    const initializeAnimations = () => {
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
    };

    const timer = setTimeout(initializeAnimations, 500);
    return () => clearTimeout(timer);
  }, [projectSlug]); // Re-run on project change

  // Section items fade in animation
  useEffect(() => {
    const items = Array.from(document.querySelectorAll(".section-item"));
    items.forEach((item) => {
      gsap.set(item, { opacity: 0 });
      ScrollTrigger.create({
        trigger: item,
        start: "top 85%",
        onEnter: () => {
          gsap.to(item, { opacity: 1, duration: 0.6, ease: "power2.out" });
        },
      });
    });
  }, [projectSlug, galleryImages]); // Re-run on project change

  if (!project) {
    return (
      <>
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
      </>
    );
  }

  return (
    <>
        <div
          fs-cc="banner"
          className="fs-cc-banner"
          style={{ display: "flex", opacity: 1 }}
        >
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
                ></path>
                <path
                  d="M16 15L16 15.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M10 17L10 17.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M11 13L11 13.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M6 12L6 12.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M12 21C16.9706 21 21 16.9706 21 12C21 11.4402 20.9489 10.8924 20.8511 10.361C20.3413 10.7613 19.6985 11 19 11C18.4536 11 17.9413 10.8539 17.5 10.5987C17.0587 10.8539 16.5464 11 16 11C14.3431 11 13 9.65685 13 8C13 7.60975 13.0745 7.23691 13.2101 6.89492C11.9365 6.54821 11 5.38347 11 4C11 3.66387 11.0553 3.34065 11.1572 3.03894C6.58185 3.46383 3 7.31362 3 12C3 16.9706 7.02944 21 12 21Z"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
            <div className="fs-cc-banner2_text">
              By clicking "Accept", you agree to the storing of cookies on your
              device to enhance site navigation, analyze site usage, and assist
              in our marketing efforts. View our{" "}
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
                role="button"
                tabIndex="0"
              >
                Accept
              </a>
              <a
                fs-cc="deny"
                href="#"
                className="link fs-cc-banner2_button fs-cc-button-alt w-button"
                role="button"
                tabIndex="0"
              >
                Deny
              </a>
              <div
                fs-cc="open-preferences"
                className="link fs-cc-manager"
                role="button"
                tabIndex="0"
              >
                <div>Preferences</div>
              </div>
            </div>
          </div>
        </div>


      {/* Up Arrow */}
      <a
        data-w-id="14381865-62c7-47ee-67e2-7f40e4733502"
        href="#top"
        className="up-arrow"
        style={{
          willChange: "transform, opacity",
          transform:
            "translate3d(0px, 100%, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)",
          transformStyle: "preserve-3d",
          opacity: 0,
        }}
      >
        ↑
      </a>

      {/* Main Content */}
      <div className="section">
        <div className="gap-120"></div>
        <div className="container">
          <h1
            words-slide-up=""
            text-split=""
            id="w-node-_78ba933a-a78e-f877-f420-ecea77870969-256fe6a4"
            style={{ opacity: 1 }}
          >
            {project.title}
          </h1>
        </div>

        {/* Hero Video / Image */}
        <div
          data-w-id="932de7c3-cbe3-b0db-943e-c0e63a54128b"
          style={{
            opacity: 1,
            transform:
              "translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)",
            transformStyle: "preserve-3d",
          }}
          className="container no-pad"
        >
          <div
            id="videocontainer"
            className="video-container w-node-e05988ce-6958-9991-9b6c-cb5b44175a30-256fe6a4"
          >
            {project.heroVideo ? (
              <>
                <div
                  id="videocontrol"
                  className="videocontrol"
                  style={{ opacity: 1 }}
                >
                  <div
                    id="videocontrol-play-area"
                    data-w-id="d3ded114-7ade-dc4e-a958-948ffa3070fc"
                    className="videocontrol-play-area"
                  >
                    <div className="video-cursor-mobile-wrp">
                      <div
                        className="video-cursor mobile-cursor"
                        style={{ opacity: 1 }}
                      >
                        <div
                          className="video-loader"
                          aria-hidden="true"
                          style={{ display: "none", opacity: 0 }}
                        ></div>
                        <div
                          className="videocontrol-play-btn"
                          aria-hidden="true"
                          tabIndex="-1"
                          style={{ pointerEvents: "none" }}
                        >
                          Play
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="videocontrol-sub-wrp">
                    <div id="videocontrol-track" className="videocontrol-track">
                      <div
                        id="videocontrol-bar"
                        className="videocontrol-bar"
                        style={{ width: "0%" }}
                      ></div>
                    </div>
                    <div
                      id="videocontrol-sound"
                      className="videocontrol-sound"
                      tabIndex="0"
                      aria-pressed="false"
                    ></div>
                    <div
                      id="videocontrol-screensize"
                      className="videocontrol-screensize"
                      tabIndex="0"
                    ></div>
                  </div>
                </div>
                <div className="project-hero-video w-embed">
                  <video
                    id="video"
                    playsInline
                    webkitPlaysinline=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    poster={project.heroImage}
                  >
                    <source src={project.heroVideo} type="video/mp4" />
                  </video>
                </div>
              </>
            ) : (
              <div
                className="project-hero-video w-embed"
                style={{ height: "100%" }}
              >
                <img
                  src={project.heroImage}
                  alt={project.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Project Info */}
        <div className="container">
          <div words-slide-up="" text-split="" style={{ opacity: 1 }}>
            <div
              className="t-small t-gray"
              style={{ display: "inline-block", position: "relative" }}
            >
              Year
            </div>
            <div className="gap-40"></div>
            <div
              className="t-large"
              style={{ display: "inline-block", position: "relative" }}
            >
              {project.year}
            </div>
          </div>
          <div words-slide-up="" text-split="" style={{ opacity: 1 }}>
            <div
              className="t-small t-gray"
              style={{ display: "inline-block", position: "relative" }}
            >
              Client
            </div>
            <div className="gap-40"></div>
            <div
              className="t-large"
              style={{ display: "inline-block", position: "relative" }}
            >
              {project.client}
            </div>
          </div>
          <div
            words-slide-up=""
            text-split=""
            id="w-node-_31f82efd-f2e5-3af9-d080-b497ba184cc2-256fe6a4"
            style={{ opacity: 1 }}
          >
            <div
              className="t-small t-gray"
              style={{ display: "inline-block", position: "relative" }}
            >
              Project Details
            </div>
            <div className="gap-40"></div>
            <div
              className="t-large t-normal w-richtext"
              style={{ display: "inline-block", position: "relative" }}
            >
              <p style={{ display: "inline-block", position: "relative" }}>
                {project.description}
              </p>
            </div>
          </div>
          <div words-slide-up="" text-split="" style={{ opacity: 1 }}>
            <div
              className="t-small t-gray"
              style={{ display: "inline-block", position: "relative" }}
            >
              Type
            </div>
            <div className="gap-40"></div>
            <div
              className="t-large"
              style={{ display: "inline-block", position: "relative" }}
            >
              {project.category}
            </div>
          </div>
        </div>
        <div className="gap-120"></div>
      </div>

      {/* Gallery Section */}
      <div className="section">
        <div className="container">
          <div
            id="w-node-_4bfd1412-00ec-d53d-c832-8775a6512fe6-256fe6a4"
            className="section-list-wrp w-dyn-list"
          >
            <div role="list" className="section-list w-dyn-items">
              {galleryImages.map((section, index) => (
                <div
                  key={index}
                  data-w-id="4bfd1412-00ec-d53d-c832-8775a6512fe8"
                  style={{ opacity: 0 }}
                  role="listitem"
                  className="section-item w-dyn-item"
                >
                  <div className="section-visuals-wrp">
                    {section.items.map((item, itemIndex) => {
                      if (item.type === "video") {
                        return (
                          <div
                            key={itemIndex}
                            className="section-video w-embed"
                          >
                            <div style={{ height: "100%" }}>
                              <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                disablePictureInPicture
                                disableRemotePlayback
                                x-webkit-airplay="deny"
                                style={{
                                  height: "100%",
                                  width: "100%",
                                  objectFit: "cover",
                                }}
                              >
                                <source src={item.src} type="video/mp4" />
                              </video>
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <img
                            key={itemIndex}
                            src={item.src}
                            loading="lazy"
                            alt=""
                            className="section-img"
                          />
                        );
                      }
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Credits Section */}
      <div className="section">
        <div className="gap-120"></div>
        <div className="container">
          <div
            id="w-node-dbacb399-4cbe-e265-cd6d-671956f93798-256fe6a4"
            className="w-richtext"
          >
            <p>
              {project.title} - {project.category}
            </p>
          </div>
          <div id="w-node-_98c4c2f8-303d-e9a5-2b47-4a6a46e7f61b-256fe6a4">
            <div className="t-small t-gray">Credits</div>
            <div className="gap-40"></div>
            <div className="credits-wrp">
              <div className="credits-column">
                <div>Client</div>
                <div className="t-bold">{project.client}</div>
                <div className="gap-20"></div>
                <div>Services</div>
                <div className="w-dyn-list">
                  <div role="list" className="w-dyn-items">
                    {project.services &&
                      project.services.map((service, index) => (
                        <div key={index} role="listitem" className="w-dyn-item">
                          <div className="t-bold">{service}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="gap-120"></div>
      </div>

      {/* Project Navigation */}
      <div
        id="current-project"
        current-title={project.title}
        className="section"
      >
        <div className="container">
          <div
            id="w-node-_15a0e899-fa0b-561c-f0d1-fbda7825a78b-256fe6a4"
            data-w-id="15a0e899-fa0b-561c-f0d1-fbda7825a78b"
            className="proj-prev-trigger"
          >
            <div className="w-dyn-list">
              {previous && (
                <div id="listPrev" role="list" className="w-dyn-items">
                  <div
                    project-title={previous.title}
                    role="listitem"
                    className="proj-item w-dyn-item"
                    style={{}}
                  >
                    <Link
                      to={`/project/${previous.slug}`}
                      className="proj-mover w-inline-block"
                    >
                      <div className="proj-mover-title-wrp">
                        <div className="t-large t-gray mov-prev">←</div>
                        <div className="t-large t-gray">Previous Project</div>
                      </div>
                      <div className="t-large">{previous.title}</div>
                    </Link>
                    <div
                      className="index-hover"
                      style={{
                        willChange: "transform",
                        transform:
                          "translate3d(0vw, 0vh, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <div className="index-hover-vid w-embed">
                        {previous.heroVideo ? (
                          <video
                            data-src={previous.heroVideo}
                            poster={previous.heroImage}
                            disablePictureInPicture
                            disableRemotePlayback
                            x-webkit-airplay="deny"
                            playsInline
                            muted
                            preload="none"
                            style={{
                              height: "100%",
                              width: "100%",
                              objectFit: "cover",
                            }}
                            src={previous.heroVideo}
                            autoPlay
                          ></video>
                        ) : (
                          <img
                            src={previous.heroImage}
                            style={{
                              height: "100%",
                              width: "100%",
                              objectFit: "cover",
                            }}
                            alt={previous.title}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div
            id="w-node-aa9e3a5a-b311-be9f-6c44-62316b4bc69c-256fe6a4"
            data-w-id="aa9e3a5a-b311-be9f-6c44-62316b4bc69c"
            className="proj-next-trigger"
          >
            <div className="w-dyn-list">
              {next && (
                <div id="listNext" role="list" className="w-dyn-items">
                  <div
                    project-title={next.title}
                    role="listitem"
                    className="proj-item w-dyn-item"
                    style={{}}
                  >
                    <Link
                      to={`/project/${next.slug}`}
                      className="proj-mover w-inline-block"
                    >
                      <div className="proj-mover-title-wrp">
                        <div className="t-large t-gray">Next Project</div>
                        <div className="t-large t-gray mov-next">→</div>
                      </div>
                      <div className="t-large">{next.title}</div>
                    </Link>
                    <div
                      className="index-hover"
                      style={{
                        willChange: "transform",
                        transform:
                          "translate3d(0vw, 0vh, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <div className="index-hover-vid w-embed">
                        {next.heroVideo ? (
                          <video
                            data-src={next.heroVideo}
                            poster={next.heroImage}
                            disablePictureInPicture
                            disableRemotePlayback
                            x-webkit-airplay="deny"
                            playsInline
                            muted
                            preload="none"
                            style={{
                              height: "100%",
                              width: "100%",
                              objectFit: "cover",
                            }}
                            src={next.heroVideo}
                            autoPlay
                          ></video>
                        ) : (
                          <img
                            src={next.heroImage}
                            style={{
                              height: "100%",
                              width: "100%",
                              objectFit: "cover",
                            }}
                            alt={next.title}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
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
              href="https://www.instagram.com/startsay.official/"
              target="_blank"
              className="link footer-link right-up-arrow"
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/company/startsayofficial"
              target="_blank"
              className="link footer-link right-up-arrow"
            >
              LinkedIn
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61572256355814"
              target="_blank"
              className="link footer-link right-up-arrow"
            >
              Facebook
            </a>
            <a
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
            <a href="#/project-index" className="link footer-link right-arrow">
              Index
            </a>
            <a href="#/research" className="link footer-link right-arrow">
              Research
            </a>
            <a href="#/team" className="link footer-link right-arrow">
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
        <div className="footer-logo-cont">
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
    </>
  );
}
