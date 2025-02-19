import { Info } from "lucide-react"
import React, { Component } from 'react';
import "../styles/TipsCard.css";

class TipsCard extends Component {
  static TIPS = [
    { emoji: "🔤", text: "Mix with letters, numbers, and symbols" },
    { emoji: "🎭", text: "Use unique emoji combinations" },
    { emoji: "🔀", text: "Place emojis in unexpected positions" },
    { emoji: "📏", text: "Aim for 12+ characters" },
  ];

  render() {
    return (
      <div className="tips-card">
        <h2 className="tips-heading">
          <Info className="w-5 h-5 text-blue-500" />
          Tips
        </h2>
        <ul className="tips-list">
          {TipsCard.TIPS.map((tip) => (
            <li key={tip.text} className="tips-item">
              <span className="text-xl">{tip.emoji}</span>
              <span>{tip.text}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default TipsCard;
