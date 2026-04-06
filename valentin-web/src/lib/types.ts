export interface User {
  name: string
  gender: 'mujer' | 'hombre' | 'otro'
  userId: string
  color: string
}

export interface NestState {
  code: string | null
  role: 'creator' | 'guest' | 'member' | null
  name: string
  cat: string
  maxM: number
  members: Record<string, Member>
  mood: number | null
  img: string | null
}

export interface Member {
  name: string
  gender: string
  userId: string
  color: string
  role: string
}

export interface MoodData {
  emoji: string
  label: string
  color: string
  bg: string
  timestamp: number
  timeStr: string
  dateStr: string
  senderName: string
  senderColor: string
}

export interface ImageData {
  img: string
  timestamp: number
}

export interface Mood {
  emoji: string
  label: string
  color: string
  bg: string
}

export interface SavedNest {
  code: string
  name: string
  cat: string
  role: string
}

export interface RequestData {
  name: string
  gender: string
  userId: string
  color: string
  status: string
}

export interface ColorOption {
  c: string
  bg: string
}

export interface NestCategory {
  id: string
  emoji: string
  label: string
}
