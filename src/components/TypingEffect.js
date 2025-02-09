import React, { useState, useEffect } from "react";

const TypingEffect = ({ messages, speed, delay, fontSize }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const message = messages[messageIndex];
    
    if (isDeleting) {
      if (charIndex > 0) {
        setTimeout(() => setCharIndex((prev) => prev - 1), speed / 2);
      } else {
        setIsDeleting(false);
        setMessageIndex((prev) => (prev + 1) % messages.length);
      }
    } else {
      if (charIndex < message.length) {
        setTimeout(() => setCharIndex((prev) => prev + 1), speed);
      } else {
        setTimeout(() => setIsDeleting(true), delay);
      }
    }

    setCurrentMessage(message.substring(0, charIndex));
  }, [charIndex, isDeleting, messageIndex, messages, speed, delay]);

  return (
    <p
      className={`mb-6 h-8 ${fontSize}`}
      style={{ display: "inline" }}
    >
      {currentMessage}| 
    </p>
  );
};

export default TypingEffect;
