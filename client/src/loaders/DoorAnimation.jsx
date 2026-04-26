import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "../index.css";


/* --------------------
  DoorAnimation - animate .panel-top (up) and .panel-bottom (down)
-------------------- */
const DoorAnimation = ({ onComplete }) => {
  const tlRef = useRef(null);

  useEffect(() => {
    const top = document.querySelector(".panel-top");
    const bottom = document.querySelector(".panel-bottom");
    if (!top || !bottom) {
      if (typeof onComplete === "function") onComplete();
      return;
    }

    const tl = gsap.timeline({ onComplete });
    tl.to(top, { yPercent: -100, duration: 1, ease: "power2.inOut" });
    tl.to(bottom, { yPercent: 100, duration: 1, ease: "power2.inOut" }, "<");
    // tl.to(top, { yPercent: -100, duration: 0.8, ease: "power2.inOut" });
    // tl.to(bottom, { yPercent: 100, duration: 0.8, ease: "power2.inOut" }, "<");

    tlRef.current = tl;

    return () => {
      if (tlRef.current) tlRef.current.kill();
    };
  }, [onComplete]);

  return null;
}


export default DoorAnimation