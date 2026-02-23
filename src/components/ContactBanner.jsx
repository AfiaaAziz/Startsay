import React from 'react';
import './ContactBanner.css';

const ContactBanner = ({ isOpen, onClose }) => {
    return (
        <div className={`contact-banner ${isOpen ? "open" : "closed"}`}>
            <div
                className="link t-large t-right bottom-auto"
                onClick={onClose}
                style={{ cursor: "pointer" }}
            >
                ✕
            </div>
            <div>
                <div className="t-large t-white">
                    <a href="tel:+923125175041">+92 312 517 5041</a>
                    <br />
                </div>
                <div className="t-large t-white">
                    <a href="mailto:info@startsay.com" className="link">
                        info@startsay.com
                    </a>
                    <br />
                </div>
            </div>
            <div className="t-large t-white">
                Office Number 2207 <br />
                National Science & Technology Park (NSTP)
                <br />
                NUST H-12, Islamabad
            </div>
            <a
                href="https://www.google.com/maps/place/National+Science+%26+Technology+Park+(NSTP)/@33.6457175,72.9972339,18z/data=!4m14!1m7!3m6!1s0x38df9573aecd2f93:0x1c7fdc5084512ca2!2sNational+Science+%26+Technology+Park+(NSTP)!8m2!3d33.6456729!4d72.9985536!16s%2Fg%2F11h7fm4qtk!3m5!1s0x38df9573aecd2f93:0x1c7fdc5084512ca2!8m2!3d33.6456729!4d72.9985536!16s%2Fg%2F11h7fm4qtk?entry=ttu&g_ep=EgoyMDI2MDEyNS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                className="link t-white-50"
            >
                Map ↗
            </a>
            <div className="link-wrp">
                <a
                    href="https://www.instagram.com/startsay.official/"
                    target="_blank"
                    className="link t-large"
                >
                    ↗ Instagram
                </a>
                <a
                    href="https://www.linkedin.com/company/startsayofficial"
                    target="_blank"
                    className="link t-large"
                >
                    ↗ LinkedIn
                </a>
                <a
                    href="https://www.behance.net/thisissyedbadshah"
                    target="_blank"
                    className="link t-large"
                >
                    ↗ Behance
                </a>
            </div>
        </div>
    );
};

export default ContactBanner;
