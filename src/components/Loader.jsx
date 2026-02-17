import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Loader({ duration = 1.5 }) {
  const rootRef = useRef(null);
  const overlayRef = useRef(null);
  const logoContRef = useRef(null);
  const innerLogoRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const overlay = overlayRef.current;
    const logoCont = logoContRef.current;
    const innerLogo = innerLogoRef.current;

    if (!root || !overlay || !logoCont || !innerLogo) return;

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

    // Mouse movement logic
    const handleMouseMove = (e) => {
      const x = e.clientX - vw / 2;
      const y = e.clientY - vh / 2;

      // Move the inner logo slightly based on cursor position (parallax effect)
      // Adjust factors (0.1) to control sensitivity
      gsap.to(innerLogo, {
        x: x,
        y: y,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto"
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    const tl = gsap.timeline();
    tl.set(logoCont, { opacity: 0, scale: 0.95 })
      .to(logoCont, {
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
      })
      .to(logoCont, {
        duration: Math.max(0.6, duration - 0.9),
        onComplete: () => {
          // Clean up event listener when animation completes
          window.removeEventListener("mousemove", handleMouseMove);
        }
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

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [duration]);

  return (
    <div ref={rootRef}>
      <div className="loader" ref={overlayRef}>
        <div className="loader-logo-cont" ref={logoContRef}>
          <div className="footer-logo-wrp" ref={innerLogoRef}>
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
