import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import "../index.css";
// import Logo from "../../assets/aditya_construction.svg"; // adjust path as needed
// import Logo from "../../assets/webp/logo-full.webp"; // adjust path as needed
import Logo from "../assets/icons/logo-ind.png"; // adjust path as needed

const BrandNameAnimation = ({ onComplete }) => {
    const sloganRef = useRef(null);
    const logoRef = useRef(null);
    const tlRef = useRef(null);

    useEffect(() => {
        const textWrapper = sloganRef.current;
        if (!textWrapper) return;

        // Wrap every letter in a span
        const text = textWrapper.textContent;
        textWrapper.innerHTML = text.replace(/\S/g, "<span class='letter'>$&</span>");

        const letters = textWrapper.querySelectorAll(".letter");

        const tl = gsap.timeline({ onComplete });

        // Animate logo fade in only
        tl.fromTo(
            logoRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 2, ease: "power2.inOut" }
        );

        // Animate slogan letters fade in
        tl.fromTo(
            letters,
            { opacity: 0 },
            {
                opacity: 1,
                duration: 1.5,
                // duration: 2,
                ease: "power2.inOut",
                stagger: 0.1,
            },
            "-=0.5" // overlap with logo fade-in
        );

        // Fade out everything
        tl.to([textWrapper, logoRef.current], {
            opacity: 0,
            // duration: 0.5,
            // duration: 1.5,
            duration: 1,
            ease: "power2.out",
            delay: 0.2,
        });

        tlRef.current = tl;

        return () => {
            if (tlRef.current) tlRef.current.kill();
        };
    }, [onComplete]);

    // Skip handler
    const handleSkip = () => {
        if (tlRef.current) tlRef.current.kill(); // stop animation
        onComplete(); // immediately finish
    };

    return (
        <div className="brand-container max-w-1600px fixed inset-0 flex flex-col items-center justify-center z-[1001] pointer-events-none space-y-6">
            {/* Logo */}
            <img
                ref={logoRef}
                src={Logo}
                alt="Logo"

                className="lg:w-[45vh] h-auto object-contain"
            />

            {/* Slogan */}
            <h1
                ref={sloganRef}
                // className="ml3 text-gray-800 uppercase tracking-[0.42em] font-light text-5xl"
                // className="ml3 text-gray-800 uppercase tracking-[0.42em] font-light lg:text-5xl"
                className="ml3 text-gray-800 uppercase tracking-[0.1em] font-semibold font-[montserrat] lg:text-[35px]"
            >
              PAYMITRA
            </h1>

            {/* Skip button */}
            {/* Skip button */}
            <button
                onClick={handleSkip}
                className="
                    absolute bottom-6 right-6
                    px-4 py-1.5
                    text-xs font-medium tracking-wide
                    text-gray-500 border border-gray-300
                    rounded-full bg-white/70 backdrop-blur-sm
                    pointer-events-auto
                    hover:text-gray-700 hover:border-gray-500
                    transition
                    "
            >
                Skip
            </button>

        </div>
    );
};

export default BrandNameAnimation;
