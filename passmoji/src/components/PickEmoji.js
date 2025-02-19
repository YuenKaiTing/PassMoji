import React, { useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";

const PickEmoji = ({ onEmojiSelect, open, closePicker }) => {
  const pickerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        closePicker();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, closePicker]);

  if (!open) return null;

  return (
    <div ref={pickerRef} className="emoji-picker-container">
      <EmojiPicker
        onEmojiClick={(emojiObject) => {
          if (emojiObject && emojiObject.emoji) {
            onEmojiSelect(emojiObject.emoji);
          }
        }}
      />
    </div>
  );
};

export default PickEmoji;
