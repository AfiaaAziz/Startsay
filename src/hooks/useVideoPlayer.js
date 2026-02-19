import { useEffect } from "react";

export const useVideoPlayer = () => {
  useEffect(() => {
    // Wait for DOM to be ready and video element to exist
    const timer = setTimeout(() => {
      const canPlay = !!document.createElement("video").canPlayType;
      if (!canPlay) return;

      const $ = (sel, root = document) => root.querySelector(sel);
      const $$ = (sel, root = document) =>
        Array.from(root.querySelectorAll(sel));
      const on = (t, type, h, opts) => t && t.addEventListener(type, h, opts);
      const once = (t, type, h, opts) =>
        t && t.addEventListener(type, h, { ...opts, once: true });
      const off = (t, type, h) => t && t.removeEventListener(type, h);

      const videoContainer = $("#videocontainer");
      const video = $("#video");
      const controls = $("#videocontrol");
      const playArea = $("#videocontrol-play-area");
      const track = $("#videocontrol-track");
      const bar = $("#videocontrol-bar");
      const cursorPack = $("#cursor-pack");
      const cursor = cursorPack;
      const playBtns = $$(".videocontrol-play-btn");
      const soundBtns = $$("#videocontrol-sound");
      const screenBtns = $$("#videocontrol-screensize");
      const loaders = $$(".video-loader");
      const videoCursors = $$(".video-cursor");

      if (!video || !videoContainer || !controls) return;

      // Video cursor elements
      const videoCursor = $("#video-cursor");
      const videoCursorMobile = $(".video-cursor.mobile-cursor");

      // Hide mobile cursor on desktop
      if (videoCursorMobile) {
        videoCursorMobile.style.display = "none";
      }

      const HIDE_DELAY = 2000;
      const SEEK_STEP = 1;
      const AUTOHIDE_CONTROLS = true;

      const fsElement = () =>
        document.fullscreenElement || document.webkitFullscreenElement || null;

      async function enterFs(el) {
        try {
          if (el?.requestFullscreen) {
            const p = el.requestFullscreen();
            if (p && typeof p.then === "function") await p;
            return;
          }
          if (el?.webkitRequestFullscreen) {
            el.webkitRequestFullscreen();
            return;
          }
        } catch (_) {}

        if (!video) return;
        try {
          if (
            typeof video.webkitSetPresentationMode === "function" &&
            typeof video.webkitSupportsPresentationMode === "function" &&
            video.webkitSupportsPresentationMode("fullscreen")
          ) {
            video.webkitSetPresentationMode("fullscreen");
            return;
          }
        } catch (_) {}

        if (typeof video.webkitEnterFullscreen === "function") {
          try {
            video.webkitEnterFullscreen();
          } catch (_) {}
        }
      }

      async function exitFs() {
        try {
          if (document.exitFullscreen) {
            const p = document.exitFullscreen();
            if (p && typeof p.then === "function") await p;
            return;
          }
          if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
            return;
          }
        } catch (_) {}

        if (video && typeof video.webkitSetPresentationMode === "function") {
          try {
            video.webkitSetPresentationMode("inline");
          } catch (_) {}
        }
      }

      if (video) video.controls = false;
      playBtns.forEach((btn) => {
        btn.style.pointerEvents = "none";
        btn.setAttribute("aria-hidden", "true");
        btn.tabIndex = -1;
      });

      const firstSoundBtn = soundBtns[0];
      const firstScreenBtn = screenBtns[0];
      if (firstSoundBtn && firstSoundBtn.tabIndex < 0)
        firstSoundBtn.tabIndex = 0;
      if (firstScreenBtn && firstScreenBtn.tabIndex < 0)
        firstScreenBtn.tabIndex = 0;

      let hideTimer = null;
      let loaderTimer = null;

      let autoHideEnabled = false;
      const enableAutoHide = () => {
        autoHideEnabled = true;
        resetHideTimer();
      };

      const cursorHome = cursor?.parentNode || null;
      const cursorNextSibling = cursor?.nextSibling || null;
      let cursorPrevInline = null;

      let fsOverlay = null;

      // Only controls bar fades in/out — video cursor visibility is handled
      // exclusively by mouseenter/mouseleave on the video container
      const setControlsOpacity = (v) => {
        if (controls) controls.style.opacity = v;
      };
      const showControls = () => setControlsOpacity("1");
      const hideControls = () => setControlsOpacity("0");

      const resetHideTimer = () => {
        if (!AUTOHIDE_CONTROLS) return;
        showControls();
        if (!autoHideEnabled) return;
        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(hideControls, HIDE_DELAY);
      };

      const showLoaderSoon = (delay = 120) => {
        if (!loaders.length) return;
        clearTimeout(loaderTimer);
        loaderTimer = setTimeout(() => {
          loaders.forEach((loader) => {
            loader.style.display = "block";
            loader.style.opacity = "1";
            loader.setAttribute("aria-busy", "true");
            loader.removeAttribute("aria-hidden");
          });
        }, delay);
      };
      const hideLoader = () => {
        if (!loaders.length) return;
        clearTimeout(loaderTimer);
        loaders.forEach((loader) => {
          loader.style.opacity = "0";
          loader.style.display = "none";
          loader.removeAttribute("aria-busy");
          loader.setAttribute("aria-hidden", "true");
        });
      };

      const updatePlayButtons = () => {
        if (!video) return;
        const label = video.paused || video.ended ? "Play" : "Pause";
        playBtns.forEach((btn) => {
          btn.textContent = label;
        });
      };
      const togglePlay = () => {
        if (!video) return;
        video.paused || video.ended ? video.play() : video.pause();
      };

      const updateProgress = () => {
        if (
          !video ||
          !bar ||
          !Number.isFinite(video.duration) ||
          video.duration <= 0
        )
          return;
        bar.style.width = (video.currentTime / video.duration) * 100 + "%";
      };

      const seekToClick = (e) => {
        if (
          !video ||
          !track ||
          !Number.isFinite(video.duration) ||
          video.duration <= 0
        )
          return;
        const rect = track.getBoundingClientRect();
        const clickX = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
        video.currentTime = (clickX / rect.width) * video.duration;
        resetHideTimer();
      };

      const seekBy = (delta) => {
        if (!video) return;
        const dur = Number.isFinite(video.duration) ? video.duration : Infinity;
        const cur = video.currentTime || 0;
        video.currentTime = Math.max(0, Math.min(dur, cur + delta));
        resetHideTimer();
      };

      const reflectMuteUI = () => {
        soundBtns.forEach((btn) => {
          btn.classList.toggle("muted", !!video?.muted);
          btn.setAttribute("aria-pressed", String(!!video?.muted));
        });
      };
      const toggleMute = () => {
        if (!video) return;
        video.muted = !video.muted;
        reflectMuteUI();
        resetHideTimer();
      };

      const snapshotInline = (el, props) => {
        const out = {};
        props.forEach((p) => {
          out[p] = el.style[p] ?? "";
        });
        return out;
      };
      const restoreInline = (el, snap) => {
        if (!el || !snap) return;
        Object.keys(snap).forEach((p) => {
          el.style[p] = snap[p];
        });
      };

      const ensureFsOverlay = (parentEl) => {
        if (fsOverlay && fsOverlay.parentNode === parentEl) return fsOverlay;
        if (fsOverlay?.parentNode) fsOverlay.parentNode.removeChild(fsOverlay);
        const overlay = document.createElement("div");
        overlay.setAttribute("aria-hidden", "true");
        overlay.style.position = "fixed";
        overlay.style.inset = "0";
        overlay.style.pointerEvents = "none";
        overlay.style.zIndex = "2147483647";
        overlay.style.contain = "layout style paint";
        parentEl.appendChild(overlay);
        fsOverlay = overlay;
        return overlay;
      };

      const placeCursorInFullscreen = (el) => {
        const fsEl = fsElement();
        const isContainerFs =
          fsEl === videoContainer ||
          fsEl === document.documentElement ||
          fsEl === document.body;
        if (!cursor || !el || !isContainerFs) return;

        const overlay = ensureFsOverlay(el);
        if (!cursorPrevInline) {
          cursorPrevInline = snapshotInline(cursor, [
            "position",
            "left",
            "top",
            "right",
            "bottom",
            "transform",
            "zIndex",
            "pointerEvents",
            "visibility",
            "opacity",
            "cursor",
          ]);
        }
        overlay.appendChild(cursor);
        cursor.style.pointerEvents = "none";
        cursor.style.position = "absolute";
        if (!cursor.style.left) cursor.style.left = "0px";
        if (!cursor.style.top) cursor.style.top = "0px";
        cursor.style.zIndex = "2147483647";
        cursor.style.visibility = "visible";
        if (!cursor.style.opacity) cursor.style.opacity = "1";
        try {
          (fsEl || videoContainer).style.cursor = "none";
        } catch {}
      };

      const restoreCursorHome = () => {
        if (!cursor || !cursorHome) return;
        try {
          if (
            cursorNextSibling &&
            cursorNextSibling.parentNode === cursorHome
          ) {
            cursorHome.insertBefore(cursor, cursorNextSibling);
          } else {
            cursorHome.appendChild(cursor);
          }
          restoreInline(cursor, cursorPrevInline);
          cursorPrevInline = null;
          if (fsOverlay?.parentNode)
            fsOverlay.parentNode.removeChild(fsOverlay);
          fsOverlay = null;
          const fse = fsElement();
          try {
            (fse || videoContainer)?.style &&
              ((fse || videoContainer).style.cursor = "");
          } catch {}
        } catch {}
      };

      const onFsChange = () => {
        const fsEl = fsElement();
        if (fsEl) placeCursorInFullscreen(fsEl);
        else restoreCursorHome();
        screenBtns.forEach((btn) => btn.classList.toggle("fullscreen", !!fsEl));
        resetHideTimer();
      };

      const isTyping = () => {
        const ae = document.activeElement;
        return !!(
          ae &&
          (ae.isContentEditable ||
            /^(INPUT|TEXTAREA|SELECT)$/i.test(ae.tagName))
        );
      };
      const onKeyDown = (e) => {
        if (!video || isTyping()) return;
        if (e.key === "ArrowRight") {
          e.preventDefault();
          seekBy(+SEEK_STEP);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          seekBy(-SEEK_STEP);
        } else if (e.key === " " || e.key === "k") {
          e.preventDefault();
          togglePlay();
        } else if (e.key === "m" || e.key === "M") {
          e.preventDefault();
          toggleMute();
        } else if (e.key === "f" || e.key === "F") {
          e.preventDefault();
          fsElement() ? exitFs() : enterFs(videoContainer);
        }
      };

      // Video cursor mouse tracking
      let isHoveringVideo = false;

      // Track cursor on entire document when video container is hovered
      // The main cursor already tracks document level, we just need to show/hide the video cursor overlay
      if (videoContainer) {
        on(videoContainer, "mouseenter", () => {
          isHoveringVideo = true;
          // Show video cursor by making it visible
          videoCursors.forEach((vc) => {
            if (vc && !vc.classList.contains("mobile-cursor")) {
              vc.style.opacity = "1";
              vc.style.visibility = "visible";
            }
          });
        });

        on(videoContainer, "mouseleave", () => {
          isHoveringVideo = false;
          // Hide video cursor
          videoCursors.forEach((vc) => {
            if (vc) {
              vc.style.opacity = "0";
              vc.style.visibility = "hidden";
            }
          });
        });
      }

      ["pointermove", "pointerdown"].forEach((evt) =>
        on(videoContainer, evt, resetHideTimer, { passive: true }),
      );
      on(controls, "pointermove", resetHideTimer, { passive: true });

      on(videoContainer, "pointerdown", enableAutoHide, { passive: true });
      on(playArea, "click", () => {
        enableAutoHide();
        togglePlay();
      });

      on(video, "play", () => {
        updatePlayButtons();
        resetHideTimer();
      });
      on(video, "pause", () => {
        updatePlayButtons();
        resetHideTimer();
      });
      once(video, "play", enableAutoHide);

      on(video, "timeupdate", updateProgress);
      on(track, "click", seekToClick);

      soundBtns.forEach((btn) => on(btn, "click", toggleMute));
      screenBtns.forEach((btn) =>
        on(btn, "click", () => {
          fsElement() ? exitFs() : enterFs(videoContainer);
          resetHideTimer();
        }),
      );

      on(document, "fullscreenchange", onFsChange);
      on(document, "webkitfullscreenchange", onFsChange);

      if (video && typeof video.addEventListener === "function") {
        on(video, "webkitpresentationmodechanged", () => {
          const isFs = video.webkitPresentationMode === "fullscreen";
          screenBtns.forEach((btn) => btn.classList.toggle("fullscreen", isFs));
          // In fullscreen mode, hide the video cursor (it gets repositioned)
          if (isFs) {
            videoCursors.forEach((vc) => {
              vc.style.opacity = "0";
              vc.style.visibility = "hidden";
            });
          }
          resetHideTimer();
        });
      }

      ["loadstart", "waiting", "seeking", "stalled", "emptied"].forEach((evt) =>
        on(video, evt, () => showLoaderSoon()),
      );
      [
        "playing",
        "canplay",
        "canplaythrough",
        "seeked",
        "loadeddata",
        "loadedmetadata",
      ].forEach((evt) => on(video, evt, hideLoader));
      on(video, "error", hideLoader);

      on(document, "keydown", (e) => {
        enableAutoHide();
        onKeyDown(e);
      });

      updatePlayButtons();
      reflectMuteUI();
      showControls();
      resetHideTimer();

      if (video) {
        if (video.readyState >= 1) {
          hideLoader();
        } else {
          showLoaderSoon(120);
        }
      }
      const fsElAtStart = fsElement();
      if (fsElAtStart) placeCursorInFullscreen(fsElAtStart);
      once(window, "load", updateProgress);

      // Cleanup
      return () => {
        if (hideTimer) clearTimeout(hideTimer);
        if (loaderTimer) clearTimeout(loaderTimer);
      };
    }, 800); // Increased delay to ensure libraries are loaded

    return () => clearTimeout(timer);
  }, []);
};
