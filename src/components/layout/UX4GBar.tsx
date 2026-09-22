import React, { useState, useEffect, useRef } from "react";
import { Moon, Settings, Droplet, Type, Link as LinkIcon, ImageOff, MousePointer2, Accessibility } from "lucide-react";
import { cn } from "../../lib/utils";

export function UX4GBar() {
  const [highContrast, setHighContrast] = useState(false);
  const [invert, setInvert] = useState(false);
  const [saturation, setSaturation] = useState(false);
  const [fontSize, setFontSize] = useState("normal"); // "small", "normal", "large"
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [hideImages, setHideImages] = useState(false);
  const [bigCursor, setBigCursor] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Apply filters and classes to document root based on states
  useEffect(() => {
    const root = document.documentElement;
    
    // Reset all specific accessibility classes
    root.classList.remove(
      "text-sm-global", "text-normal-global", "text-lg-global", 
      "highlight-links", "hide-images", "big-cursor"
    );
    
    // Text Size
    if (fontSize === "small") root.classList.add("text-sm-global");
    if (fontSize === "normal") root.classList.add("text-normal-global");
    if (fontSize === "large") root.classList.add("text-lg-global");
    
    // Toggles
    if (highlightLinks) root.classList.add("highlight-links");
    if (hideImages) root.classList.add("hide-images");
    if (bigCursor) root.classList.add("big-cursor");

    // Dynamic Filter Style for root
    let filters = [];
    if (highContrast) filters.push("contrast(1.5) grayscale(0.5)");
    if (invert) filters.push("invert(1) hue-rotate(180deg)");
    if (saturation) filters.push("saturate(2)");
    
    if (filters.length > 0) {
      root.style.filter = filters.join(" ");
      root.style.backgroundColor = highContrast || invert ? "#000" : "";
    } else {
      root.style.filter = "";
      root.style.backgroundColor = "";
    }
  }, [highContrast, invert, saturation, fontSize, highlightLinks, hideImages, bigCursor]);

  const handleSkipToMain = () => {
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.scrollIntoView({ behavior: "smooth" });
      mainContent.focus();
    }
  };

  const OptionButton = ({ icon: Icon, label, active, onClick, iconStr }: any) => (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg border transition-all duration-200",
        active 
          ? "bg-[#1e293b] text-white border-[#1e293b]" 
          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:shadow-sm"
      )}
    >
      {iconStr ? (
        <span className="text-xl sm:text-2xl font-bold mb-2 font-serif">{iconStr}</span>
      ) : (
        <Icon size={24} className="mb-2" />
      )}
      <span className="text-[10px] sm:text-xs text-center font-medium leading-tight">{label}</span>
    </button>
  );

  return (
    <div className="w-full bg-[#1e293b] text-white h-7 px-3 sm:px-4 text-[11px] flex justify-between items-center z-50 sticky top-0 overflow-x-hidden">
      <div className="flex gap-2 sm:gap-4 items-center min-w-0">
        <span className="hidden sm:inline whitespace-nowrap">भारत सरकार | Government of India</span>
        <span className="sm:hidden text-[10px] whitespace-nowrap">GoI Portal</span>
        <button onClick={handleSkipToMain} className="hidden sm:inline-block hover:underline focus:outline-none focus:ring-1 focus:ring-white px-1 whitespace-nowrap">
          Skip to Main Content
        </button>
      </div>
      
      <div className="flex gap-4 items-center relative" ref={menuRef}>
        <div className="hidden sm:flex gap-1 items-center border-r border-slate-600 pr-3">
          <button onClick={() => setFontSize("small")} className="hover:bg-slate-700 px-1.5 py-0.5 rounded focus:outline-none" aria-label="Decrease Font Size">A-</button>
          <button onClick={() => setFontSize("normal")} className="hover:bg-slate-700 px-1.5 py-0.5 rounded focus:outline-none" aria-label="Normal Font Size">A</button>
          <button onClick={() => setFontSize("large")} className="hover:bg-slate-700 px-1.5 py-0.5 rounded focus:outline-none" aria-label="Increase Font Size">A+</button>
        </div>
        
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-white",
            menuOpen ? "bg-slate-700" : "hover:bg-slate-700"
          )}
        >
          <Accessibility size={14} />
          <span>Screen Reader Access</span>
        </button>

        {/* Accessibility Dropdown Menu */}
        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 w-[280px] sm:w-[320px] bg-white rounded-xl shadow-2xl border border-slate-200 text-slate-800 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <h3 className="font-semibold text-sm mb-3 pb-2 border-b border-slate-100 flex items-center justify-between">
              Accessibility Options
              <button onClick={() => setMenuOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </h3>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <OptionButton 
                icon={Moon} label="Dark Contrast" active={highContrast} 
                onClick={() => setHighContrast(!highContrast)} 
              />
              <OptionButton 
                icon={Settings} label="Invert" active={invert} 
                onClick={() => setInvert(!invert)} 
              />
              <OptionButton 
                icon={Droplet} label="Saturation" active={saturation} 
                onClick={() => setSaturation(!saturation)} 
              />
              <OptionButton 
                iconStr="A" label="Default Text Size" active={fontSize === "normal"} 
                onClick={() => setFontSize("normal")} 
              />
              <OptionButton 
                iconStr="A+" label="Increase Text Size" active={fontSize === "large"} 
                onClick={() => setFontSize("large")} 
              />
              <OptionButton 
                iconStr="A-" label="Decrease Text Size" active={fontSize === "small"} 
                onClick={() => setFontSize("small")} 
              />
              <OptionButton 
                icon={LinkIcon} label="Highlight Links" active={highlightLinks} 
                onClick={() => setHighlightLinks(!highlightLinks)} 
              />
              <OptionButton 
                icon={ImageOff} label="Hide Images" active={hideImages} 
                onClick={() => setHideImages(!hideImages)} 
              />
              <OptionButton 
                icon={MousePointer2} label="Cursor" active={bigCursor} 
                onClick={() => setBigCursor(!bigCursor)} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
