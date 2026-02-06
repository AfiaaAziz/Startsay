import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Loader({ duration = 1.5 }) {
  const rootRef = useRef(null);
  const overlayRef = useRef(null);
  const logoContRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const overlay = overlayRef.current;
    const logoCont = logoContRef.current;
    if (!root || !overlay || !logoCont) return;

    overlay.style.display = "flex";
    overlay.style.opacity = "1";
    overlay.setAttribute("aria-busy", "true");

    const vw = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0,
    );
    const vh = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0,
    );

    const tl = gsap.timeline();
    tl.set(logoCont, { opacity: 0, x: -vw * 0.35, y: vh * 0.25, scale: 0.95 })
      .to(logoCont, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
      })
      .to(logoCont, {
        x: vw * 0.25,
        y: -vh * 0.2,
        duration: Math.max(0.6, duration - 0.9),
        ease: "power2.inOut",
      })
      .to(overlay, {
        opacity: 0,
        duration: 0.4,
        ease: "power1.out",
        onComplete: () => {
          overlay.style.display = "none";
          overlay.removeAttribute("aria-busy");
          overlay.setAttribute("aria-hidden", "true");
        },
      });
  }, [duration]);

  return (
    <div ref={rootRef}>
      <div className="loader" ref={overlayRef}>
        <div className="loader-logo-cont" ref={logoContRef}>
          <div className="footer-logo-wrp">
            <div className="footer-logo-frame">
              <div className="logo-frame-wrp"></div>
            </div>
            <div
              className="footer-logo-img"
              style={{
                backgroundImage: 'url("/assets/logo.png")',
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                width: "160px",
                height: "120px",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
