// src/animals.js
export const ANIMALS = [
  { name: 'Lion', emoji: '🦁' },
  { name: 'Tigre', emoji: '🐅' },
  { name: 'Girafe', emoji: '🦒' },
  { name: 'Elephant', emoji: '🐘' },
  { name: 'Crocodile', emoji: '🐊' },
  { name: 'Tortue', emoji: '🐢' },
]

// mapping nom → emoji
export const emojiByName = Object.fromEntries(
  ANIMALS.map(a => [a.name.toLowerCase(), a.emoji])
)
