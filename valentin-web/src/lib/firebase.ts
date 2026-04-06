import { initializeApp, getApps } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyCEhuAMJsr50upmbTOLAm9Q9e-oBfpb8_w",
  authDomain: "valentin-app-08032026.firebaseapp.com",
  databaseURL: "https://valentin-app-08032026-default-rtdb.firebaseio.com",
  projectId: "valentin-app-08032026",
  storageBucket: "valentin-app-08032026.firebasestorage.app",
  messagingSenderId: "1089419617003",
  appId: "1:1089419617003:web:67a7c19a170016e38a54ae"
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const db = getDatabase(app)
