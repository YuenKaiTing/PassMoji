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
  // 如果想让表情符号加分，可新增判断
  if (/[^A-Za-z0-9]/.test(value)) score += 25;

  return {
    score,
    label: score < 50 ? "Weak" : score < 75 ? "Medium" : "Strong",
    percentage: Math.min(score, 100),
  };
};

function EmojiPasswordCreator() {
  // 初始是登录模式
  const [isLoginMode, setIsLoginMode] = useState(true);

  // 用户名、密码
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 密码强度
  const [strength, setStrength] = useState(calculatePasswordStrength("")); 

  // Emoji Picker
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // 提示信息（来自后端）
  const [info, setInfo] = useState("");

  // 更新密码并计算强度
  const updatePassword = useCallback((value) => {
    setPassword(value);
    setStrength(calculatePasswordStrength(value));
  }, []);

  // 添加选中的 Emoji
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

  // 提交登录或注册
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
        // 若登录成功要跳转，可在此处理
        // if (isLoginMode) window.location.href = "/some-other-route";
      } else {
        setInfo((isLoginMode ? "Login failed: " : "Register failed: ") + data.message);
      }
    } catch (err) {
      console.error("Error:", err);
      setInfo("Server error or network problem.");
    }
  };

  // 切换到“登录模式”时，清空输入框和提示
  const switchToLogin = (e) => {
    e.preventDefault();
    setIsLoginMode(true);
    setUsername("");
    setPassword("");
    setInfo("");
    setStrength(calculatePasswordStrength(""));
  };

  // 切换到“注册模式”时，清空输入框和提示
  const switchToRegister = (e) => {
    e.preventDefault();
    setIsLoginMode(false);
    setUsername("");
    setPassword("");
    setInfo("");
    setStrength(calculatePasswordStrength(""));
  };

  return (
    <div className="emoji-password-container">
      <div className="emoji-password-title">
        {isLoginMode
          ? "Log in with an Emoji-Enhanced Password 🔒"
          : "Create an Account & Strengthen Your Password 🔒"
        }
      </div>

      <div className="emoji-password-subtitle">
        {isLoginMode
          ? "Please enter your username and password to log in."
          : "Please choose a username and enhance your password with emojis to register."
        }
      </div>

      {/* 后端返回信息 */}
      {info && <p style={{ color: "blue" }}>{info}</p>}

      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "800px" }}>
        {/* 用户名输入框 */}
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

        {/* 密码+emoji输入框 */}
        <div className="emoji-password-input-container" style={{ marginBottom: "16px" }}>
          <input
            type="text"
            placeholder="Type or select emojis..."
            value={password}
            onChange={(e) => updatePassword(e.target.value)}
            required
            className="emoji-password-input"
          />
          <button 
            onClick={toggleEmojiPicker} 
            className="emoji-button"
            type="button"
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
          style={{ marginTop: "10px", padding: "10px 20px", cursor: "pointer" }}
        >
          {isLoginMode ? "Log in" : "Register"}
        </button>

        {/* 界面右下角提示链接：登录、注册切换 */}
        <div style={{ textAlign: "right", marginTop: "10px" }}>
          {isLoginMode ? (
            <span style={{ fontSize: "14px" }}>
              Don't have an account?{" "}
              <a 
                href="#createOne"
                onClick={switchToRegister}
                style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
              >
                Create one
              </a>
            </span>
          ) : (
            <span style={{ fontSize: "14px" }}>
              Already have an account?{" "}
              <a 
                href="#goLogin"
                onClick={switchToLogin}
                style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
              >
                Log in
              </a>
            </span>
          )}
        </div>
      </form>

      {/* 密码强度条 */}
      <div className="emoji-password-strength-container">
        <div className="strength-bar-wrapper">
          <div className="emoji-password-strength-bar">
            <div
              className={`emoji-password-strength-fill ${strength.label.toLowerCase()}`}
              style={{ width: `${strength.percentage}%` }}
            ></div>
          </div>
          <span className="emoji-password-strength-label">
            {strength.label}
          </span>
        </div>
      </div>

      {/* 两张卡片 */}
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
