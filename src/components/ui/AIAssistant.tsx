// src/components/ui/AIAssistant.tsx
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function AIAssistant() {
  const [waving, setWaving] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaving(true);
      setTimeout(() => setWaving(false), 1500);
    }, 3000); // co 3s

    return () => clearInterval(interval);
  }, []);

  return (
    <NavLink to="/lumiq">
      <div className="relative flex justify-center items-center mb-12">
        <div className={`text-5xl transition-transform duration-300 ease-in-out mb-6 ${waving ? "animate-wave" : ""}`}>
          <img
            src="lumiq.png"
            alt="AI Avatar"
            draggable="false"
            className={`w-21 h-21 mb-2`}
          />
        </div>
        <div className="absolute -bottom-6 bg-white dark:bg-gray-700 text-sm px-4 py-2 rounded shadow text-gray-800 dark:text-white animate-fade-in">
          Need help with something? Click me!
        </div>
      </div>
    </NavLink>
  );
}
