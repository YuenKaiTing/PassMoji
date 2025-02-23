import { useState, useCallback } from "react";
import BenefitsCard from "../components/BenefitsCard";
import TipsCard from "../components/TipsCard";
import EmojiPickerComponent from "../components/PickEmoji";
import "../styles/EmojiPasswordCreator.css";

const calculatePasswordStrength = (value = "") => {
  let score = 0;

  // 简单的密码强度评分逻辑
  if (value.length > 8) score += 25;
  if (/[A-Z]/.test(value)) score += 25;
  if (/[0-9]/.test(value)) score += 25;
  // 如果你想让“表情符号”加分，可以加一个正则检测 \p{Extended_Pictographic}
  if (/[^A-Za-z0-9]/.test(value)) score += 25;

  return {
    score,
    label: score < 50 ? "Weak" : score < 75 ? "Medium" : "Strong",
    percentage: Math.min(score, 100),
  };
};

function EmojiPasswordCreator() {
  // 切换模式：true = 登录模式, false = 注册模式
  const [isLoginMode, setIsLoginMode] = useState(false);

  // 用户名 & 密码
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 密码强度
  const [strength, setStrength] = useState(calculatePasswordStrength("")); 

  // Emoji Picker
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // 用于显示后端返回信息
  const [info, setInfo] = useState("");

  // 更新密码 & 计算强度
  const updatePassword = useCallback((value) => {
    setPassword(value);
    setStrength(calculatePasswordStrength(value));
  }, []);

  // 选中一个 Emoji 时，追加到密码里
  const addEmoji = useCallback((emoji) => {
    setPassword((prev) => {
      const newPassword = prev + emoji; 
      setStrength(calculatePasswordStrength(newPassword));
      return newPassword;
    });
    setShowEmojiPicker(false);
  }, []);

  const toggleEmojiPicker = useCallback(() => {
    setShowEmojiPicker(true);
  }, []);
  
  const closeEmojiPicker = useCallback(() => {
    setShowEmojiPicker(false);
  }, []);

  // 提交（注册/登录）
  const handleSubmit = async (e) => {
    e.preventDefault();
    setInfo("");

    try {
      const endpoint = isLoginMode
        ? "http://localhost:3001/api/login"
        : "http://localhost:3001/api/register";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();

      if (data.success) {
        setInfo(isLoginMode 
          ? "Login success!" 
          : "Register success! You can now login.");
        // 如果想登录成功后跳转到别的页面：
        // if (isLoginMode) window.location.href = "/EmojiPassword";
      } else {
        setInfo((isLoginMode ? "Login failed: " : "Register failed: ") + data.message);
      }
    } catch (err) {
      console.error("Error:", err);
      setInfo("Server error or network problem.");
    }
  };

  return (
    <div className="emoji-password-container">
      {/* 标题和副标题 */}
      <div className="emoji-password-title">
        {isLoginMode 
          ? "Login with an Emoji-Enhanced Password 🔒" 
          : "Register & Improve Passwords with Emojis 🔒"}
      </div>
      <div className="emoji-password-subtitle">
        {isLoginMode 
          ? "Enter your username & password to login"
          : "Enhance your password security by incorporating emojis and then register"}
      </div>

      {/* 模式切换按钮 */}
      <button 
        onClick={() => setIsLoginMode(!isLoginMode)} 
        style={{ marginBottom: "20px" }}
      >
        Switch to {isLoginMode ? "Register Mode" : "Login Mode"}
      </button>

      {/* 后端返回的信息 */}
      {info && <p style={{ color: "blue" }}>{info}</p>}

      {/* 表单 */}
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "800px" }}>
        {/* 用户名输入框：使用与密码相似的外观 */}
        <div className="emoji-password-input-container" style={{ marginBottom: "16px" }}>
          <input
            type="text"
            placeholder="Enter username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="emoji-password-input"
          />
        </div>

        {/* 密码（带 emoji）输入框 */}
        <div className="emoji-password-input-container" style={{ marginBottom: "16px" }}>
          <input
            type="text"
            placeholder="Type or select emojis..."
            value={password}
            onChange={(e) => updatePassword(e.target.value)}
            className="emoji-password-input"
            required
          />
          <button 
            onClick={toggleEmojiPicker} 
            className="emoji-button"
            type="button"  // 避免点击后立即submit
          >
            😊
          </button>
          <EmojiPickerComponent 
            onEmojiSelect={addEmoji} 
            open={showEmojiPicker} 
            closePicker={closeEmojiPicker} 
          />
        </div>

        <button 
          type="submit"
          style={{ 
            marginTop: "10px",
            padding: "10px 20px",
            cursor: "pointer"
          }}
        >
          {isLoginMode ? "Login" : "Register"}
        </button>
      </form>

      {/* 密码强度条 */}
      <div className="emoji-password-strength-container">
        <div className="strength-bar-wrapper">
          <div className="emoji-password-strength-bar">
            <div
              className={`emoji-password-strength-fill ${strength.label.toUpperCase()}`}
              style={{ width: `${strength.percentage}%` }}
            ></div>
          </div>
          <span className="emoji-password-strength-label">
            {strength.label}
          </span>
        </div>
      </div>

      {/* 两个卡片：Benefits / Tips */}
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
