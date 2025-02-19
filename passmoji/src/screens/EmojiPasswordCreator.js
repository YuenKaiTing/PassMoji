import { useState, useCallback } from "react";
import BenefitsCard from "../components/BenefitsCard";
import TipsCard from "../components/TipsCard";
import EmojiPickerComponent from "../components/PickEmoji";
import "../styles/EmojiPasswordCreator.css";

const calculatePasswordStrength = (value = "") => {
  let score = 0;
  
  if (value.length > 8) score += 25;
  if (/[A-Z]/.test(value)) score += 25;
  if (/[0-9]/.test(value)) score += 25;
  if (/[^A-Za-z0-9]/.test(value)) score += 25;

  return {
    score,
    label: score < 50 ? "Weak" : score < 75 ? "Medium" : "Strong",
    percentage: Math.min(score, 100),
  };
};

function EmojiPasswordCreator() {
  const [password, setPassword] = useState(""); 
  const [strength, setStrength] = useState(calculatePasswordStrength("")); 
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const updatePassword = useCallback((value) => {
    setPassword(value);
    setStrength(calculatePasswordStrength(value));
  }, []);

  const addEmoji = useCallback(
    (emoji) => {
      setPassword((prev) => {
        const newPassword = prev ? prev + emoji : emoji; 
        setStrength(calculatePasswordStrength(newPassword));
        return newPassword;
      });
      setShowEmojiPicker(false);
    },
    []
  );

  const toggleEmojiPicker = useCallback(() => {
    setShowEmojiPicker(true);
  }, []);
  
  const closeEmojiPicker = useCallback(() => {
    setShowEmojiPicker(false);
  }, []);
  

  return (
    <div className="emoji-password-container">
      <div className="emoji-password-title">Improving Passwords with Emojis 🔒</div>
      <div className="emoji-password-subtitle">Enhance your password security by incorporating emojis into your passwords</div>

      <div className="emoji-password-input-container">
        <input
          type="text"
          placeholder="Type or select emojis..."
          value={password}
          onChange={(e) => updatePassword(e.target.value)}
          className="emoji-password-input"
        />
        <button onClick={toggleEmojiPicker} className="emoji-button">
          😊
        </button>
        <EmojiPickerComponent onEmojiSelect={addEmoji} open={showEmojiPicker} closePicker={closeEmojiPicker} />
      </div>

      <div className="emoji-password-strength-container">
        <div className="strength-bar-wrapper">
          <div className="emoji-password-strength-bar">
            <div
              className={`emoji-password-strength-fill ${strength.label.toUpperCase()}`}
              style={{ width: `${strength.percentage}%` }}
            ></div>
          </div>
          <span className="emoji-password-strength-label">{strength.label}</span>
        </div>
      </div>
      <div className="card-container">
        <div className="benefits-card">
          <BenefitsCard />
        </div>
        <div className="tips-card">
          <TipsCard />
        </div>
      </div>
    </div>
  );
}

export default EmojiPasswordCreator;
