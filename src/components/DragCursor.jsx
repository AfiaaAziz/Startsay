import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "../TeamPage.css"; // Ensure styles are available

const DragCursor = () => {
    const cursorRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        // Move cursor with mouse
        const moveCursor = (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: "power2.out",
            });
        };

        // Show/Hide logic based on hovering .cms-list-team
        const teamList = document.querySelector(".cms-list-team");

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        if (teamList) {
            teamList.addEventListener("mouseenter", handleMouseEnter);
            teamList.addEventListener("mouseleave", handleMouseLeave);
            // Also track mouse movement globally to position the cursor, 
            // but only show it when hovering the list if that's the desired effect.
            // Or we can just track it when visible.
            // studio.html seems to have it track globally but change state.
            // For simplicity and performance, let's track globally for smooth entry.
            window.addEventListener("mousemove", moveCursor);
        }

        return () => {
            if (teamList) {
                teamList.removeEventListener("mouseenter", handleMouseEnter);
                teamList.removeEventListener("mouseleave", handleMouseLeave);
            }
            window.removeEventListener("mousemove", moveCursor);
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            className={`team-drag-cursor ${isVisible ? "visible" : ""}`}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                pointerEvents: "none",
                zIndex: 9999,
                transform: "translate(-50%, -50%)", // Center the cursor on mouse
                // mixBlendMode: "difference", // Removed for glassy effect
            }}
        >
            <span style={{ marginRight: "4px" }}>Drag</span>
            <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M17 7L22 12L17 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M7 17L2 12L7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M2 12H22"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
};

export default DragCursor;
