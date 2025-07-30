import { useState, useEffect } from "react";
import { Bot, Send } from "lucide-react";

interface AITextboxProps {
  placeholder?: string[];
  disabled?: boolean;
  className?: string;
}

export default function AITextbox({
  placeholder = ["Zapytaj mnie o coś..."],
  disabled = false,
  className = "",
}: AITextboxProps) {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // Animacja typewriter dla placeholder
  useEffect(() => {
    if (isFocused || message.trim()) return; // Nie animuj gdy użytkownik wpisuje

    const currentPlaceholder = placeholder[currentPlaceholderIndex];
    let currentIndex = 0;
    setIsTyping(true);
    setTypedText("");

    const typingInterval = setInterval(() => {
      if (currentIndex < currentPlaceholder.length) {
        setTypedText(currentPlaceholder.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);

        // Po 2.5s przejdź do następnego placeholder
        setTimeout(() => {
          setCurrentPlaceholderIndex((prev) => (prev + 1) % placeholder.length);
        }, 2500);
      }
    }, 80); // Szybkość pisania - 80ms na znak

    return () => clearInterval(typingInterval);
  }, [currentPlaceholderIndex, placeholder, isFocused, message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log("AI Message:", message.trim());
      // TODO: Implement AI functionality here
      // You can add AI integration, API calls, etc.
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      {/* Animated container - animacja cały czas */}
      <div className="ai-textbox-animated">
        <div
          className={`
            ai-textbox-content flex items-center gap-3 bg-white border rounded-lg px-4 py-2 
            shadow-sm transition-all duration-300 min-h-[60px] w-full
            ${isFocused ? "border-transparent shadow-lg" : "border-gray-200 hover:border-gray-300"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}>
          {/* Robot Icon */}
          <Bot
            size={20}
            className={`flex-shrink-0 transition-colors duration-300 ${
              isFocused ? "text-purple-500" : "text-gray-400"
            }`}
          />

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={isFocused || message.trim() ? "" : `${typedText}${isTyping ? "|" : ""}`}
            disabled={disabled}
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500"
          />

          {/* Send Button */}
          {message.trim() && (
            <button
              type="submit"
              disabled={disabled}
              className="flex-shrink-0 p-1 text-purple-500 hover:text-purple-600 transition-colors duration-200 disabled:opacity-50">
              <Send size={16} />
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
