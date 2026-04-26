import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "../index.css";

const LoaderPanels = ({ visible }) => {
    return visible ? (
        <div className="loader-panels fixed inset-0 z-[1000] pointer-events-none">
            <div className="panel-top absolute top-0 left-0 w-full h-1/2 bg-white shadow-3xl" />
            <div className="panel-bottom absolute bottom-0 left-0 w-full h-1/2 bg-white shadow-xl" />
        </div>
    ) : null;
}


export default LoaderPanels
