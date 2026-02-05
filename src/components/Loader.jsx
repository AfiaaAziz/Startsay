import { useEffect, useRef } from "react";
import gsap from "gsap";

// CDN URLs for loader images (from original Webflow)
const loaderImages = [
  "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42f32e179658fc220ff71_20.avif",
  "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42f2a1bc30a29cc9dde23_19.avif",
  "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42ea7b8caf2e461da972d_18.avif",
  "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42e9dab059fd303cb59bb_17.avif",
  "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42e8c9b02ae0d1681b7b8_16.avif",
  "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42cb457683fdcaecf34aa_15.avif",
  "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42cabbf94893911f30b8d_14.avif",
  "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42ca28d03c1d72159ab26_13.avif",
  "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42c954de027a2c9aa384c_12.avif",
  "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68e42c84894ff1d8f915df24_11.avif",
  "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6886834949596497c68bf5b1_686e821bdf1767b3c81c36e8_231030_RND_DK_010_orangehintergrund_v2%20fog%20Large.avif",
  "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/688683406e8226dcdd61a12c_6867e107b4d400ad20ad39dd_230303_Firstcolo_Broschure_Rnd_001c_blueAkzent_01%20Large.avif",
  "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68868334c66e32973ba66caf_686685c2c0df48ad320a646c_230124_OP1_v003_1_Main_0001%20Large.avif",
  "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/6886832b826db4c61cb8afcf_686695b490c6187b4302ded1_We_are_Rewind_Ghetto_Blaster_1x1_07%20Large.avif",
  "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/688682a866bb85d741dbe468_6862aa2bcc68d0ad5ce0ed3a_mars_cover.avif",
  "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68868319d36be5e41a195460_6867c4009b5aeeeb46555855_RND_dk_011_0031.avif",
  "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/688683100007bdc0d6b8d0c4_6867d7d6a8c71bddc3942a28_2.avif",
  "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/688682ff1da9335baedef285_6867f5123aa787b54ba2cafe_7.avif",
  "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/688682fa186bbdce6c8fe845_686bf6bd7fb6fdadca975d14_cover%20image-web-497237698_18509548351001463_3505879398570363264_n.avif",
  "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/688682a866bb85d741dbe468_6862aa2bcc68d0ad5ce0ed3a_mars_cover.avif",
];

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

    // Carousel rotation - shows one image at a time cycling rapidly (original Webflow behavior)
    const carousels = root.querySelectorAll(".collection-list-logo-anim");
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
  }, [duration]);

  return (
    <div ref={rootRef}>
      <div className="loader" ref={overlayRef}>
        <div className="loader-logo-cont" ref={logoContRef}>
          <div className="footer-logo-wrp">
            <div className="footer-logo-frame">
              <div className="logo-frame-wrp">
                <div className="collection-list-wrp-logo-anim w-dyn-list">
                  <div
                    role="list"
                    className="collection-list-logo-anim w-dyn-items"
                  >
                    {loaderImages.map((src, i) => (
                      <div
                        key={i}
                        className="collection-item-logo-anim w-dyn-item"
                        style={{
                          backgroundImage: `url("${src}")`,
                        }}
                        role="listitem"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div
              className="footer-logo-img"
              style={{
                backgroundImage: 'url("/assets/logo.png")',
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                width: "80px",
                height: "60px",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
