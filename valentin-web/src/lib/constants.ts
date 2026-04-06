import { Mood, ColorOption, NestCategory } from './types'

export const COLORS: ColorOption[] = [
  { c: '#ff6b9d', bg: 'linear-gradient(135deg,#ff6b9d,#c44569)' },
  { c: '#ffd93d', bg: 'linear-gradient(135deg,#ffd93d,#f9a825)' },
  { c: '#6bcb77', bg: 'linear-gradient(135deg,#6bcb77,#27ae60)' },
  { c: '#a29bfe', bg: 'linear-gradient(135deg,#a29bfe,#6c5ce7)' },
  { c: '#74b9ff', bg: 'linear-gradient(135deg,#74b9ff,#0984e3)' },
  { c: '#fd79a8', bg: 'linear-gradient(135deg,#fd79a8,#e84393)' },
  { c: '#81ecec', bg: 'linear-gradient(135deg,#81ecec,#00cec9)' },
  { c: '#ff7675', bg: 'linear-gradient(135deg,#ff7675,#d63031)' },
  { c: '#fdcb6e', bg: 'linear-gradient(135deg,#fdcb6e,#e17055)' },
  { c: '#a8e6cf', bg: 'linear-gradient(135deg,#a8e6cf,#3d9970)' },
]

export const defaultMoods: Record<string, Mood[]> = {
  mujer: [
    { emoji: '🦋', label: 'Enamorada', color: '#ff6b9d', bg: 'linear-gradient(135deg,#ff6b9d,#c44569)' },
    { emoji: '🐰', label: 'Feliz', color: '#ffd93d', bg: 'linear-gradient(135deg,#ffd93d,#f9a825)' },
    { emoji: '🦊', label: 'Tranquila', color: '#6bcb77', bg: 'linear-gradient(135deg,#6bcb77,#27ae60)' },
    { emoji: '🐨', label: 'Necesito abrazo', color: '#a29bfe', bg: 'linear-gradient(135deg,#a29bfe,#6c5ce7)' },
    { emoji: '🦥', label: 'Cansada', color: '#74b9ff', bg: 'linear-gradient(135deg,#74b9ff,#0984e3)' },
    { emoji: '🐼', label: 'Pensativa', color: '#fd79a8', bg: 'linear-gradient(135deg,#fd79a8,#e84393)' },
    { emoji: '🐳', label: 'Triste', color: '#81ecec', bg: 'linear-gradient(135deg,#81ecec,#00cec9)' },
    { emoji: '🐯', label: 'Enojada', color: '#ff7675', bg: 'linear-gradient(135deg,#ff7675,#d63031)' },
    { emoji: '🦄', label: 'Emocionada', color: '#fdcb6e', bg: 'linear-gradient(135deg,#fdcb6e,#e17055)' },
    { emoji: '🐱', label: 'Coqueta', color: '#fd79a8', bg: 'linear-gradient(135deg,#fd79a8,#6c5ce7)' },
  ],
  hombre: [
    { emoji: '🦁', label: 'Enamorado', color: '#ff6b9d', bg: 'linear-gradient(135deg,#ff6b9d,#c44569)' },
    { emoji: '🐶', label: 'Feliz', color: '#ffd93d', bg: 'linear-gradient(135deg,#ffd93d,#f9a825)' },
    { emoji: '🐻', label: 'Tranquilo', color: '#6bcb77', bg: 'linear-gradient(135deg,#6bcb77,#27ae60)' },
    { emoji: '🐼', label: 'Necesito abrazo', color: '#a29bfe', bg: 'linear-gradient(135deg,#a29bfe,#6c5ce7)' },
    { emoji: '🦥', label: 'Cansado', color: '#74b9ff', bg: 'linear-gradient(135deg,#74b9ff,#0984e3)' },
    { emoji: '🦉', label: 'Pensativo', color: '#fd79a8', bg: 'linear-gradient(135deg,#fd79a8,#e84393)' },
    { emoji: '🐬', label: 'Triste', color: '#81ecec', bg: 'linear-gradient(135deg,#81ecec,#00cec9)' },
    { emoji: '🐯', label: 'Enojado', color: '#ff7675', bg: 'linear-gradient(135deg,#ff7675,#d63031)' },
    { emoji: '🦊', label: 'Emocionado', color: '#fdcb6e', bg: 'linear-gradient(135deg,#fdcb6e,#e17055)' },
    { emoji: '🐺', label: 'Coqueto', color: '#fd79a8', bg: 'linear-gradient(135deg,#fd79a8,#6c5ce7)' },
  ],
  otro: [
    { emoji: '🦋', label: 'Enamorade', color: '#ff6b9d', bg: 'linear-gradient(135deg,#ff6b9d,#c44569)' },
    { emoji: '🐰', label: 'Feliz', color: '#ffd93d', bg: 'linear-gradient(135deg,#ffd93d,#f9a825)' },
    { emoji: '🦊', label: 'Tranquile', color: '#6bcb77', bg: 'linear-gradient(135deg,#6bcb77,#27ae60)' },
    { emoji: '🐨', label: 'Necesito abrazo', color: '#a29bfe', bg: 'linear-gradient(135deg,#a29bfe,#6c5ce7)' },
    { emoji: '🦥', label: 'Cansade', color: '#74b9ff', bg: 'linear-gradient(135deg,#74b9ff,#0984e3)' },
    { emoji: '🦉', label: 'Pensative', color: '#fd79a8', bg: 'linear-gradient(135deg,#fd79a8,#e84393)' },
    { emoji: '🐳', label: 'Triste', color: '#81ecec', bg: 'linear-gradient(135deg,#81ecec,#00cec9)' },
    { emoji: '🐯', label: 'Enojade', color: '#ff7675', bg: 'linear-gradient(135deg,#ff7675,#d63031)' },
    { emoji: '🦄', label: 'Emocionade', color: '#fdcb6e', bg: 'linear-gradient(135deg,#fdcb6e,#e17055)' },
    { emoji: '🐱', label: 'Coquete', color: '#fd79a8', bg: 'linear-gradient(135deg,#fd79a8,#6c5ce7)' },
  ],
}

export const nestCategories: NestCategory[] = [
  { id: 'pareja', emoji: '💑', label: 'Pareja' },
  { id: 'familia', emoji: '🏠', label: 'Familia' },
  { id: 'amigos', emoji: '🫂', label: 'Amigos' },
  { id: 'trabajo', emoji: '💼', label: 'Trabajo' },
  { id: 'secreto', emoji: '🤫', label: 'Secreto' },
]

export const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']

export const DEFAULT_PHRASES = [
  'Cada estado tuyo es una carta de amor 💌',
  'Contigo los días grises tienen flores 🌷',
  'Tu corazón y el mío, siempre sincronizados 💕',
  'Eres la mejor parte de mis días 🌸',
  'Hasta tu enojo me recuerda cuánto te quiero 🦋',
  'Gracias por existir en mi mundo 🌟',
  'Hoy y siempre, contigo 💕',
]
