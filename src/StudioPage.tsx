
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// @ts-ignore
import SplitType from 'split-type';

const StudioPage: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Split text animations setup
    const splitInstances: any[] = [];
    
    const runSplit = () => {
      // General split for all marked elements
      // Fix: TypesList requires comma-separated values without spaces or an array
      const mainSplit = new SplitType("[text-split]", {
        types: "lines,words,chars",
        tagName: "span",
      });
      splitInstances.push(mainSplit);

      // Specific split for line masking
      // Fix: TypesList requires comma-separated values without spaces or an array
      const lineSplit = new SplitType(".split-lines", {
        types: "lines,words",
      });
      splitInstances.push(lineSplit);
      
      // Add line masks as in the original script
      document.querySelectorAll('.line').forEach(line => {
        const mask = document.createElement('div');
        mask.className = 'line-mask';
        line.appendChild(mask);
      });

      // Animation Triggers
      const createScrollTrigger = (triggerElement: Element, timeline: gsap.core.Timeline) => {
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
      };

      // Words Slide Up
      document.querySelectorAll("[words-slide-up]").forEach(el => {
        const tl = gsap.timeline({ paused: true });
        tl.from(el.querySelectorAll(".word"), {
          opacity: 0,
          yPercent: 100,
          duration: 0.5,
          ease: "power2.out",
          stagger: { amount: 0.5 },
        });
        createScrollTrigger(el, tl);
      });

      // Words Rotate In
      document.querySelectorAll("[words-rotate-in]").forEach(el => {
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

      // Letters Fade In Random
      document.querySelectorAll("[letters-fade-in-random]").forEach(el => {
        const tl = gsap.timeline({ paused: true });
        tl.from(el.querySelectorAll(".char"), {
          opacity: 0,
          duration: 0.05,
          ease: "power1.out",
          stagger: { amount: 0.4, from: "random" },
        });
        createScrollTrigger(el, tl);
      });

      // Scrub each word
      document.querySelectorAll("[scrub-each-word]").forEach(el => {
        let tl = gsap.timeline({
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

      // Line masking animation
      document.querySelectorAll(".line").forEach(line => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: line,
            start: "top center",
            end: "bottom center",
            scrub: 1,
          },
        });
        tl.to(line.querySelector(".line-mask"), {
          width: "0%",
          duration: 1,
        });
      });

      gsap.set("[text-split]", { opacity: 1 });
    };

    runSplit();

    // 2. Logo Animation Carousel Logic (Footer)
    const logoCarousels = document.querySelectorAll(".collection-list-logo-anim");
    const carouselIntervals: number[] = [];
    logoCarousels.forEach((carousel) => {
      const slides = Array.from(carousel.children) as HTMLElement[];
      let idx = -1;
      slides.forEach((slide) => (slide.style.display = "none"));
      const rotate = () => {
        if (idx >= 0) slides[idx].style.display = "none";
        idx = (idx + 1) % slides.length;
        slides[idx].style.display = "block";
        carouselIntervals.push(window.setTimeout(rotate, 83.33));
      };
      rotate();
    });

    // 3. Hero BG Carousel Logic
    const heroItems = document.querySelectorAll(".collection-list-stud .collection-item-stud");
    if (heroItems.length > 0) {
      let heroIdx = -1;
      const rotateHero = () => {
        heroItems.forEach((el) => (el as HTMLElement).style.opacity = "0");
        heroIdx = (heroIdx + 1) % heroItems.length;
        (heroItems[heroIdx] as HTMLElement).style.opacity = "1";
        carouselIntervals.push(window.setTimeout(rotateHero, 3000));
      };
      rotateHero();
    }

    // 4. Team Drag Scroller (Improved Sensitivity)
    const scroller = document.querySelector(".cms-list-team") as HTMLElement;
    if (scroller) {
      const IS_DESKTOP = window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;
      if (IS_DESKTOP) {
        let isDragging = false;
        let startX = 0;
        let startScrollLeft = 0;
        let activePointerId: number | null = null;
        const onPointerDown = (e: PointerEvent) => {
          if (e.pointerType !== "mouse" || e.button !== 0) return;
          isDragging = true;
          activePointerId = e.pointerId;
          startX = e.clientX;
          startScrollLeft = scroller.scrollLeft;
          scroller.setPointerCapture(activePointerId);
        };
        const onPointerMove = (e: PointerEvent) => {
          if (!isDragging || e.pointerId !== activePointerId) return;
          const dx = (e.clientX - startX) * 1.5;
          scroller.scrollLeft = startScrollLeft - dx;
        };
        const endDrag = () => {
          isDragging = false;
          activePointerId = null;
        };
        scroller.addEventListener("pointerdown", onPointerDown as any);
        scroller.addEventListener("pointermove", onPointerMove as any);
        scroller.addEventListener("pointerup", endDrag);
        scroller.addEventListener("pointercancel", endDrag);
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      carouselIntervals.forEach(id => clearTimeout(id));
      splitInstances.forEach(s => s.revert());
    };
  }, []);

  return (
    <div ref={pageRef} className="studio-page-content">
      {/* Hero Section */}
      <div className="section hero-studio pt-32 md:pt-48 pb-20 relative overflow-hidden">
        <div className="studio-heading-wrp px-5 md:px-10 mb-2">
          <h1 className="studio-heading text-6xl md:text-[10rem] font-medium leading-[0.9] tracking-tighter">
            Shaping<br />thoughts
          </h1>
        </div>
        <div className="studio-heading-wrp px-5 md:px-10">
          <div words-slide-up="" text-split="" className="studio-heading t-primary text-6xl md:text-[10rem] font-medium leading-[0.9] tracking-tighter text-[#ff5101]">
            into iconic<br />visuals.
          </div>
        </div>
        
        {/* Hero Image Slider Container */}
        <div className="collection-list-wrp-stud w-dyn-list mt-20 h-[60vh] md:h-[80vh]">
          <div role="list" className="collection-list-stud w-dyn-items relative w-full h-full overflow-hidden">
            {[
              "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/68ee6ddf3fc3885121b907ee_Studio_Edit_Selection_Web_v001_0010.avif",
              "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/690a2b03914f559250f8572a_Studio_Edit_Selection_Web_v002_0000_0000_SF_Studio_Edit_v2-52.avif",
              "https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/690509e32cb72754ae848f6a_SF_Studio_Edit_v2-53%20(1).avif"
            ].map((url, i) => (
              <div 
                key={i} 
                role="listitem" 
                className="collection-item-stud absolute inset-0 transition-opacity duration-1000 ease-in-out bg-cover bg-center" 
                style={{ backgroundImage: `url(${url})`, opacity: i === 0 ? 1 : 0 }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="section pad-5 py-24 md:py-40 px-5 md:px-10">
        <div className="container grid md:grid-cols-2 gap-16 md:gap-32">
          <div words-slide-up="" text-split="" className="t-large text-2xl md:text-4xl leading-[1.2] font-light tracking-tight text-black/90">
            The studio’s process is rooted in careful listening, clear planning,
            and meticulous execution. Each project begins with a shared
            understanding of objectives, developing into visuals that are both
            impactful and enduring.
            <br /><br />
            Styleframe offers expertise across visual effects, post-production, creative direction,
            animation direction, and CGI production. Each service is tailored to
            the needs of the project, ensuring flexibility while maintaining
            uncompromising standards.
          </div>
          <div words-slide-up="" text-split="" className="t-large text-2xl md:text-4xl leading-[1.2] font-light tracking-tight text-black/90 md:mt-48">
            Dedicated research and look development keep the studio at the
            forefront of technology and aesthetics. Every commission is an
            opportunity to refine methods, push boundaries, and deliver visuals
            that resonate.
          </div>
        </div>

        {/* Services & Clients Lists */}
        <div className="container grid md:grid-cols-2 gap-16 md:gap-32 mt-32">
          <div className="services-column">
            <div words-slide-up="" text-split="" className="list-title text-xs uppercase font-bold tracking-[0.2em] mb-8 text-[#ff5101]">
              Services
            </div>
            <div className="service-list flex flex-col gap-1">
              {["3D Motion", "Conception & Design", "Research & Visual Development", "Creative, Art & Animation Direction", "CGI Still & Animation Production", "AI Direction & Execution", "Visual Effects"].map(s => (
                <div key={s} className="text-3xl md:text-5xl py-3 border-b border-black/5 last:border-0 hover:text-[#ff5101] transition-colors duration-300">{s}</div>
              ))}
            </div>
          </div>
          <div className="clients-column">
            <div words-slide-up="" text-split="" className="list-title text-xs uppercase font-bold tracking-[0.2em] mb-8 text-[#ff5101]">
              Selected Clients
            </div>
            <div className="client-list grid grid-cols-2 gap-x-8 gap-y-4">
              {["Audi", "Bose", "Deutsche Bank", "Ferrero", "Hatton Labs", "Lionsgate", "Michelin", "Microsoft", "Moncler", "Nickelodeon", "Oakley", "Opel", "Ray-Ban", "Samsung", "Sonra", "rabbit"].map(c => (
                <div key={c} words-slide-up="" text-split="" className="text-xl md:text-2xl font-light opacity-60 hover:opacity-100 transition-opacity">{c}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interior Slider Simulation */}
      <div className="section studio-interior h-screen bg-black relative">
        <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: 'url(https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/690a2b20cddfb71d5949e555_Studio_Edit_Selection_Web_v002_0000_0013_SF_Studio_Edit_v2-39.avif)' }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>

      {/* Team Section */}
      <div className="section team-title-wrp pt-32 pb-10 px-5 md:px-10">
        <h2 className="team-heading text-5xl md:text-8xl font-medium tracking-tighter">Team</h2>
      </div>
      <div className="section studio-team pb-40">
        <div className="cms-list-wrp-team">
          <div role="list" className="cms-list-team flex gap-6 px-5 md:px-10 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing">
            {[
              { name: "Robin", title: "Founder & CEO", img: "68ee35284412b64fabb6a434_SF_Portraits_Robin_Final_Blur.avif" },
              { name: "Tim", title: "3D Designer", img: "68ee35013dd7d3f72fcabcd1_SF_Portraits_Tim_Final_Blur.avif" },
              { name: "Leon", title: "Art Director", img: "68ee354d777ee4ff4b6c96ab_SF_Portraits_Leon_Final_Blur.avif" },
              { name: "Susanne", title: "Digital Artist", img: "68f0ffe81feb96d1aab1818c_SF_Portraits_Susanne_Final_Blur_v2.avif" },
              { name: "Lorenzo", title: "Producer", img: "68ee35368c68ed7d1a4c30aa_SF_Portraits_Lorenzo_Final_Blur.avif" },
              { name: "Denys", title: "3D Designer", img: "68ee353d562ff2e2a5f4adf8_SF_Portraits_Denys_Final_Blur.avif" },
              { name: "Shirley", title: "Producer", img: "68ee352248913abd5ae9598d_SF_Portraits_Shirley_Final_Blur.avif" },
              { name: "Colin", title: "Director & Editor", img: "68ee35566f7ab6229138a2b4_SF_Portraits_Colin_Final_Blur.avif" }
            ].map((p, i) => (
              <div key={i} className="cms-item-team flex-shrink-0 w-[300px] md:w-[450px]">
                <div className="team-photo aspect-[4/5] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700 mb-6 bg-[#eee]" style={{ backgroundImage: `url(https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/${p.img})` }}></div>
                <div className="team-name text-3xl font-medium mb-1">{p.name}</div>
                <div className="team-title text-xs uppercase font-bold tracking-widest opacity-40">{p.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Logo Animation Loop */}
      <div className="footer-logo-cont bg-white py-32 border-t border-black/5">
        <div className="footer-logo-wrp max-w-5xl mx-auto flex items-center justify-center">
          <div className="footer-logo-frame w-64 h-64 md:w-[500px] md:h-[500px] relative">
            <div className="collection-list-logo-anim w-full h-full">
              {[
                "68e42f32e179658fc220ff71_20.avif", "68e42f2a1bc30a29cc9dde23_19.avif",
                "68e42ea7b8caf2e461da972d_18.avif", "68e42e9dab059fd303cb59bb_17.avif",
                "68e42e8c9b02ae0d1681b7b8_16.avif", "68e42cb457683fdcaecf34aa_15.avif",
                "68e42cabbf94893911f30b8d_14.avif", "68e42ca28d03c1d72159ab26_13.avif",
                "68e42c954de027a2c9aa384c_12.avif", "68e42c84894ff1d8f915df24_11.avif"
              ].map(img => (
                <div key={img} className="absolute inset-0 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(https://cdn.prod.website-files.com/66c3a685de0fd85a256fe680/${img})` }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioPage;
