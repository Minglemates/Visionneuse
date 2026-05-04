// src/animals.js
export const ANIMALS = [
  { name: 'Lion', emoji: '🦁' },
  { name: 'Hippopotame', emoji: '🦛' },
  { name: 'Corbeau', emoji: '🐦' },
  { name: 'Tigre', emoji: '🐅' },
  { name: 'Girafe', emoji: '🦒' },
  { name: 'Perroquet', emoji: '🦜' },
  { name: 'Mouton', emoji: '🐑' },
  { name: 'Vache', emoji: '🐄' },
  { name: 'Elephant', emoji: '🐘' },
  { name: 'Dauphin', emoji: '🐬' },
  { name: 'Requin', emoji: '🦈' },
  { name: 'Cameleon', emoji: '🦎' },
  { name: 'Crocodile', emoji: '🐊' },
  { name: 'Tortue', emoji: '🐢' },
  { name: 'Cochon', emoji: '🐖' },
]

// mapping nom → emoji
export const emojiByName = Object.fromEntries(
  ANIMALS.map(a => [a.name.toLowerCase(), a.emoji])
)
