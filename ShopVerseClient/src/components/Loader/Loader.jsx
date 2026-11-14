import React, { useState, useEffect } from "react";
import { subscribeToLoading } from "../../services/api";
import "./Loader.css";

const Loader = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Subscribe to global axios loading state
    const unsubscribe = subscribeToLoading((isLoading) => {
      setLoading(isLoading);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="global-loader-container" role="status" aria-live="polite">
      {/* 1. Slim glowing indeterminate top progress bar */}
      <div className="top-progress-bar">
        <div className="progress-bar-glow"></div>
      </div>

      {/* 2. Frosted glass ambient modal with dual-ring spinner */}
      <div className="loader-backdrop">
        <div className="loader-card">
          <div className="spinner-wrapper">
            {/* Outer Blue Ring */}
            <div className="spinner-ring outer-ring"></div>
            {/* Inner Orange Ring */}
            <div className="spinner-ring inner-ring"></div>
            {/* Center Glowing Dot */}
            <div className="spinner-core"></div>
          </div>

          <div className="loader-text-group">
            <h4 className="loader-brand">
              <span className="brand-shop">Shop</span>
              <span className="brand-verse">Verse</span>
            </h4>
            <p className="loader-caption">Syncing with server...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
