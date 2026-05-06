import React, { useState } from "react";

const CATEGORIES = [
  { label: "Tête", key: "tete" },
  { label: "Corps", key: "buste" },
  { label: "Bras Gauche", key: "bras_lft" },
  { label: "Bras Droite", key: "bras_rg" },
  { label: "Queue", key: "queue" },
  { label: "Jambe Gauche", key: "jambe_lft" },
  { label: "Jambe Droite", key: "jambe_rg" },
  
];

const ANIMAUX = [
  { name: "lion", emoji: "🦁" }, { name: "tigre", emoji: "🐅" },
  { name: "girafe", emoji: "🦒" }, { name: "elephant", emoji: "🐘" },
  { name: "crocodile", emoji: "🐊" }, { name: "tortue", emoji: "🐢" },
];

export default function TabSidebar({ selections, onSelectPart }) {
  const [active, setActive] = useState(CATEGORIES[0].key);

  return (
    <div style={{
      position: "fixed",
      top: "50%",
      left: 16,
      transform: "translateY(-50%)",
      zIndex: 9000,
      display: "flex",
      flexDirection: "column",
      gap: 8,
      maxHeight: "90vh",
      overflowY: "auto",
    }}>
      {CATEGORIES.map(({ label, key }) => {
        const isActive = active === key;
        return (
          <div key={key}>
            {/* Fiche catégorie */}
            <button
              onClick={() => setActive(isActive ? null : key)}
              style={{
                width: 75,
                padding: "8px 12px",
                background: isActive ? "#FFC524" : "#0c1e4a",
                color: isActive ? "#0c1e4a" : "#fff",
                border: "2px solid #FFC524",
                borderRadius: 12,
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: 13,
                textAlign: "left",
                boxShadow: "2px 2px 6px rgba(0,0,0,0.2)",
              }}
            >
              {label}
            </button>

            {/* Emojis animaux */}
            {isActive && (
              <div style={{
                marginTop: 4,
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 4,
                background: "#0c1e4acc",
                borderRadius: 10,
                padding: 6,
              }}>
                {ANIMAUX.map(({ name, emoji }) => {
                  const selected = selections?.[key] === name;
                  return (
                    <button
                      key={name}
                      onClick={() => onSelectPart(key, name)}
                      title={name[0].toUpperCase() + name.slice(1)}
                      style={{
                        height: 38,
                        borderRadius: 10,
                        background: selected ? "#FFC524" : "transparent",
                        color: selected ? "#0c1e4a" : "#fff",
                        border: selected ? "2px solid #0c1e4a" : "1px solid #FFC524",
                        fontSize: 15,
                        cursor: "pointer",
                      }}
                    >
                      {emoji}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
