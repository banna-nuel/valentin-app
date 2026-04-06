import { User, SavedNest, Mood } from './types'

export function loadSession(): { name: string; gender: string; uid: string; color: string; code: string | null; role: string | null } | null {
  if (typeof window === 'undefined') return null
  const sv = localStorage.getItem('val_sess')
  if (!sv) return null
  try {
    return JSON.parse(sv)
  } catch {
    localStorage.removeItem('val_sess')
    return null
  }
}

export function saveSession(user: User, code: string | null, role: string | null) {
  localStorage.setItem('val_sess', JSON.stringify({
    name: user.name,
    gender: user.gender,
    uid: user.userId,
    color: user.color,
    code: code || null,
    role: role || null,
  }))
}

export function loadSavedNests(userId: string): SavedNest[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem('val_nests_' + userId) || '[]')
  } catch { return [] }
}

export function saveSavedNests(userId: string, nests: SavedNest[]) {
  localStorage.setItem('val_nests_' + userId, JSON.stringify(nests))
}

export function loadCustomMoods(userId: string): Mood[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem('val_custom_' + userId) || '[]')
  } catch { return [] }
}

export function saveCustomMoods(userId: string, moods: Mood[]) {
  localStorage.setItem('val_custom_' + userId, JSON.stringify(moods))
}

export function loadCustomPhrases(userId: string): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem('val_phrases_' + userId) || '{}')
  } catch { return {} }
}

export function saveCustomPhrases(userId: string, phrases: Record<string, string>) {
  localStorage.setItem('val_phrases_' + userId, JSON.stringify(phrases))
}

export function loadCustomDefaultMoods(userId: string): Record<string, { emoji: string; label: string }> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem('val_defmoods_' + userId) || '{}')
  } catch { return {} }
}

export function saveCustomDefaultMoods(userId: string, moods: Record<string, { emoji: string; label: string }>) {
  localStorage.setItem('val_defmoods_' + userId, JSON.stringify(moods))
}
