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
  { name: "lion", emoji: "🦁" },
  { name: "tigre", emoji: "🐅" },
  { name: "girafe", emoji: "🦒" },
  { name: "elephant", emoji: "🐘" },
  { name: "crocodile", emoji: "🐊" },
  { name: "tortue", emoji: "🐢" },
];

export default function TabSidebar({ selections, onSelectPart }) {
  const [active, setActive] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: 14,
        transform: "translateY(-50%)",
        zIndex: 9000,
      }}
    >
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          width: 240,
          padding: "10px 18px",
          background: "linear-gradient(180deg, #1268e8 0%, #0039a8 100%)",
          color: "#fff",
          border: "3px solid white",
          borderRadius: 16,
          fontWeight: 900,
          cursor: "pointer",
          marginBottom: 12,
          boxShadow: "0 4px 0 #00256f, 0 6px 12px rgba(0,0,0,.35)",
          fontSize: 18,
          textTransform: "uppercase",
          lineHeight: 1.1,
          fontFamily: "Arial Black, system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <div style={{ color: "white" }}>CHOISIS</div>
        <div
          style={{
            color: "#ffcc00",
            display: "flex",
            justifyContent: "center",
            gap: 10,
            
          }}
        >
          LES ÉLÉMENTS <span style={{ color: "white" }}>➜</span>
        </div>
      </button>

      {menuOpen && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {CATEGORIES.map(({ label, key }) => {
            const isActive = active === key;

            return (
              <div key={key}>
                <button
                  onClick={() => setActive(isActive ? null : key)}
                  style={{
                    width: 120,
                    padding: "8px 12px",
                    background: isActive ? "#FFC524" : "linear-gradient(180deg, #1268e8 0%, #0039a8 100%)",
                    color: isActive ? "#0c1e4a" : "#fff",
                    border: "2px solid #FFC524",
                    borderRadius: 12,
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {label}
                </button>

                {isActive && (
                  <div
                    style={{
                      marginTop: 4,
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 4,
                      background: "linear-gradient(180deg, #1268e8 0%, #0039a8 100%)",
                      borderRadius: 20,
                      padding: 6,
                      width: 120,
                      marginLeft: 55,
                    }}
                  >
                    {ANIMAUX.map(({ name, emoji }) => {
                      const selected = selections?.[key] === name;

                      return (
                        <button
                          key={name}
                          onClick={() => onSelectPart(key, name)}
                          title={name}
                          style={{
                            height: 38,
                            borderRadius: 10,
                            background: selected ? "#FFC524" : "transparent",
                            color: selected ? "#0c1e4a" : "#fff",
                            border: selected
                              ? "2px solid #0c1e4a"
                              : "1px solid #FFC524",
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
      )}
    </div>
  );
}