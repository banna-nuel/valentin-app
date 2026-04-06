<div align="center">

# 💕 Valentin

### *donde dos corazones se encuentran*

<img src="public/logo.jpg" alt="Valentin Logo" width="120" />

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06b6d4?logo=tailwindcss)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Realtime_DB-ffca28?logo=firebase)](https://firebase.google.com/)

</div>

---

## 📖 Descripción

**Valentin** es una aplicación web progresiva (PWA) diseñada para parejas, familias y amigos que quieren compartir sus estados de ánimo en tiempo real. Cada usuario puede crear o unirse a un *"nido"* — un espacio privado donde los miembros comparten cómo se sienten usando emojis animados, mensajes personalizados y fotos.

La app tiene un diseño visual estilo *sketch/cuaderno* con bordes asimétricos, fuentes manuscritas y una paleta cálida rosa/crema que transmite cercanía y afecto.

## ✨ Características

- 🏡 **Nidos** — Crea espacios compartidos por categoría (Pareja, Familia, Amigos, Trabajo, Secreto)
- 💕 **Estados de ánimo en tiempo real** — Comparte cómo te sientes con emojis animados
- 🖼️ **Fotos opcionales** — Adjunta imágenes comprimidas a tu estado
- 📱 **Widget Android** — Muestra el estado de tu persona especial en la pantalla de inicio
- 💌 **Sistema de invitaciones** — Comparte códigos para que otros se unan a tu nido
- ✏️ **Moods personalizables** — Crea, edita y elimina estados de ánimo
- 💬 **Frases del día** — Personaliza mensajes para cada día de la semana
- 🖥️ **Dashboard desktop** — Layout responsivo de 3 columnas para pantallas grandes
- 📲 **PWA instalable** — Se puede instalar como app nativa en cualquier dispositivo

## 🖥️ Layout

### Mobile
Diseño vertical con scroll, optimizado para uso con una mano.

### Desktop (≥768px)
Dashboard de tres columnas:

```
┌─────────────────────────────────────────────────────────┐
│  💕 Valentin        [Nombre del nido 🏡]      [⚙️] [👤] │
├──────────────┬────────────────────────┬─────────────────┤
│  MIS NIDOS   │  CORAZONES DEL NIDO   │  ENVIAR SENTIR  │
│              │                        │                 │
│ [nido 1]     │  ┌──────┐  ┌──────┐   │  [mood grid]    │
│ [nido 2]     │  │ 🦋   │  │ 🐶   │   │                 │
│              │  │ amor  │  │ feliz│   │  [subir foto]   │
│ [+ Crear]    │  └──────┘  └──────┘   │                 │
│ [Unirme]     │  "frase del día..." ✏️ │  [Enviar 💕]    │
└──────────────┴────────────────────────┴─────────────────┘
```

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **Next.js 14** | Framework React con App Router |
| **React 18** | UI con componentes y hooks |
| **TypeScript** | Tipado estático |
| **Tailwind CSS 4** | Estilos utilitarios |
| **Firebase Realtime DB** | Base de datos en tiempo real |
| **Google Fonts** | Caveat + DM Sans |

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── globals.css         → Tema, animaciones, patrón de fondo
│   ├── layout.tsx          → Fuentes, PWA meta, doodles animados
│   └── page.tsx            → Entry point con splash + routing
├── components/
│   ├── Splash.tsx          → Pantalla de carga con logo bounce
│   ├── screens/
│   │   ├── LoginScreen.tsx → Registro (nombre + género + color)
│   │   ├── HomeScreen.tsx  → Lista de nidos
│   │   ├── CreateNest.tsx  → Crear nuevo nido
│   │   ├── WaitingScreen   → Esperando aprobación
│   │   ├── CreatedScreen   → Nido creado + código
│   │   └── AppScreen.tsx   → Dashboard principal (3 columnas)
│   ├── modals/
│   │   ├── AddMoodModal    → Crear/editar estados
│   │   ├── NestConfigModal → Ajustes del nido
│   │   ├── UserConfigModal → Perfil de usuario
│   │   └── PhrasesModal    → Frases por día
│   └── ui/                 → Componentes reutilizables
├── hooks/
│   ├── usePartners.ts      → Listener realtime de moods
│   ├── useRequests.ts      → Listener realtime de solicitudes
│   └── useNestMeta.ts      → Listener realtime de metadata
└── lib/
    ├── firebase.ts         → Configuración Firebase
    ├── types.ts            → Interfaces TypeScript
    ├── constants.ts        → Moods, categorías, colores
    ├── storage.ts          → Helpers de localStorage
    └── AppContext.tsx       → Estado global (Context + Reducer)
```

## 🚀 Instalación y Ejecución

```bash
# Clonar el repositorio
git clone https://github.com/bannanuel/valentin-app.git
cd valentin-app

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build de producción
npm run build
```

La app estará disponible en `http://localhost:3000`

## 📱 App Android

Este proyecto incluye una **app Android companion** que envuelve la webapp en un WebView y añade un widget de pantalla de inicio. El widget muestra el estado de ánimo más reciente de tu persona especial.

El código de la app Android se encuentra en el repositorio [`valentin-widget`](https://github.com/bannanuel/valentin-widget).

## 🎨 Diseño Visual

- **Estilo sketch/cuaderno** con bordes asimétricos estilo dibujo a mano
- **Fuente Caveat** para títulos y labels (manuscrita)
- **Fuente DM Sans** para texto base (moderna y limpia)  
- **Paleta rosa/crema** (#ff6b9d, #fff8f0, #2d1b1b)
- **Doodles animados** flotando en el fondo (🌸 💕 🌷 ✨ 🦋)
- **Patrón de líneas** tipo cuaderno en el fondo
- **Sombras tipo tinta** con offset sólido

## 🌐 Deploy

La aplicación está lista para desplegarse en **Vercel**:

```bash
npx vercel deploy
```

No requiere variables de entorno — la configuración de Firebase está incluida en el código.

## 👤 Autor

**Manuel Banna** — [@bannanuel](https://github.com/bannanuel)

---

<div align="center">

*Hecho con 💕 para quienes aman compartir sus sentimientos*

</div>
