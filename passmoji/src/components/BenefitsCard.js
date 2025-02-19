import { CheckCircle } from "lucide-react";
import React, { Component } from "react";
import "../styles/BenefitsCard.css"; // Import CSS file

class BenefitsCard extends Component {
  static BENEFITS = [
    { emoji: "🔐", text: "Increased password complexity" },
    { emoji: "🧠", text: "Better memorability" },
    { emoji: "🎯", text: "Larger character set for security" },
    { emoji: "👁️", text: "Visual representation aids recall" },
  ];

  render() {
    return (
      <div className="benefits-card">
        <h2 className="benefits-heading">
          <CheckCircle className="w-5 h-5 text-green-500" />
          Benefits
        </h2>
        <ul className="benefits-list">
          {BenefitsCard.BENEFITS.map((benefit) => (
            <li key={benefit.text} className="benefits-item">
              <span className="text-xl">{benefit.emoji}</span>
              <span>{benefit.text}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default BenefitsCard;
