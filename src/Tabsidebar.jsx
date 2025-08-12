import React, { useState } from "react";

const CATEGORIES = [
  { label: "Corps", key: "buste" },
  { label: "Tête", key: "tete" },
  { label: "Jambe Gauche", key: "jambe_lft" },
  { label: "Jambe Droite", key: "jambe_rg" },
  { label: "Bras Gauche", key: "bras_lft" },
  { label: "Bras Droite", key: "bras_rg" },
  { label: "Queue", key: "queue" },
];

const ANIMAUX = [
  { name: "lion", emoji: "🦁" }, { name: "hippopotame", emoji: "🦛" },
  { name: "corbeau", emoji: "🐦" }, { name: "tigre", emoji: "🐅" },
  { name: "girafe", emoji: "🦒" }, { name: "perroquet", emoji: "🦜" },
  { name: "mouton", emoji: "🐑" }, { name: "vache", emoji: "🐄" },
  { name: "elephant", emoji: "🐘" }, { name: "dauphin", emoji: "🐬" },
  { name: "requin", emoji: "🦈" }, { name: "cameleon", emoji: "🦎" },
  { name: "crocodile", emoji: "🐊" }, { name: "tortue", emoji: "🐢" },
  { name: "cochon", emoji: "🐖" },
];

const PANEL_W = 300; // largeur du tiroir
const TAB_W = 44;   // largeur de l’onglet

export default function TabSidebar({ selections, onSelectPart }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(CATEGORIES[0].key);

  const toggle = () => setOpen(v => !v);

  return (
    <>
      {/* --- TIROIR (panneau coulissant) --- */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: PANEL_W,
          height: "100vh",
          background: "#0c1e4a",
          color: "#fff",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform .30s ease-in-out",
          boxShadow: open ? "6px 0 16px rgba(0,0,0,.25)" : "none",
          zIndex: 9000,
          overflowY: "auto",
          borderRight: open ? "5px solid #FFC524" : "none",
        }}
      >
        {/* En-tête */}
        <div style={{ position: "sticky", top: 0, background: "#0c1e4a", padding: "12px 14px", borderBottom: "2px solid #29407a" }}>
          <div style={{ fontWeight: "bold", fontSize: 18, color:"#f7bd00ff"}}>Choisis chaques Parties de ton Minglemates</div>
        </div>

        {/* Accordéon catégories -> emojis */}
        <div style={{ padding: 12 }}>
          {CATEGORIES.map(({ label, key }) => {
            const isActive = active === key;
            return (
              <div key={key} style={{ marginBottom: 20}}>
                <button
                  onClick={() => setActive(key)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 10px",
                    background: isActive ? "#f7bd00ff" : "transparent",
                    border: "1px solid #adc4ffff",
                    color: "#ffffffff",
                    borderRadius: 20,
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {label}
                </button>

                {isActive && (
                  <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                    {ANIMAUX.map(({ name, emoji }) => {
                      const selected = selections?.[key] === name;
                      return (
                        <button
                          key={name}
                          onClick={() => onSelectPart(key, name)}
                          title={name[0].toUpperCase() + name.slice(1)}
                          style={{
                            height: 40,
                            borderRadius: 20,
                            background: selected ? "#ffcc00" : "transparent",
                            color: selected ? "#0c1e4a" : "#fff",
                            border: selected ? "2px solid #0c1e4a" : "1px solid #29407a",
                            fontSize: 25,
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
      </div>

      {/* --- ONGLET UNIQUE (suit le tiroir) --- */}
      <button
        onClick={toggle}
        title={open ? "Fermer" : "Ouvrir"}
        style={{
          position: "fixed",
          top: "40%",
          left: open ? PANEL_W : 0,  // 👉 suit le panneau
          transform: "translateY(-50%)",
          width: TAB_W,
          height: 150,
          background: "#ffcc00",
          color: "#ffffffff",
          border: "none",
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
          cursor: "pointer",
          fontWeight: "bold",
          writingMode: "vertical-rl",
          textOrientation: "upright",
          boxShadow: "2px 2px 6px rgba(0,0,0,0.25)",
          transition: "left .28s ease-in-out",
          zIndex: 9500,
        }}
      >
        {open ? "ELEMENTS" : "ELEMENTS"}
      </button>
    </>
  );
}
