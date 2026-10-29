# ArrowMaze 🎮⚡

A premium cybernetic logic & escape puzzle mobile game built with **Expo**, **React Native**, and **React Native Reanimated**.

---

## 🧩 Gameplay Concept

Arrow Maze is an interlocking escape puzzle where each arrow forms a snake-like path winding across a dense grid:
- **Tapping an Arrow**: Checks the forward ray from the arrow's head to the board boundary.
- **Clear Ray**: The arrow slithers forward cell-by-cell out of the maze.
- **Blocked Ray**: If another arrow blocks its path, it recoils with spring physics and collision haptic feedback.
- **Goal**: Clear every single arrow from the maze to solve the puzzle.

---

## ✨ Features

- **Strict Collision Engine**: Multi-turn 90-degree winding paths with 0 overlapping cells.
- **Dynamic Difficulty Scaling**: Progressive difficulty scaling from introductory 5x5 grids up to dense 12x12 labyrinths.
- **Cyberpunk Neon Dark Aesthetic**: Deep navy midnight backgrounds, electric cyan glow accents, and isometric 3D glowing graphics.
- **Reanimated Slithering Animations**: 60fps native-driven snake-like exit trajectories without React JS thread re-renders.
- **Complete Screen Flow**: Splash, Home, Level Selection (1–25+), Gameplay, and Settings.

---

## 🛠 Tech Stack

- **Framework**: [Expo SDK 58](https://expo.dev/) (React Native 0.88)
- **Animation**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Graphics**: [React Native SVG](https://github.com/software-mansion/react-native-svg) & [Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)
- **Typography**: [Google Fonts Sora](https://fonts.google.com/specimen/Sora) (`@expo-google-fonts/sora`)
- **Language**: TypeScript 6

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or bun
- Expo Go or Expo Development Build

### Installation

```bash
# Clone the repository
git clone https://github.com/Samama-Mumraiz/ArrowMaze.git
cd ArrowMaze

# Install dependencies
npm install
```

### Running the App

```bash
# Start Metro bundler
npx expo start

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios
```

### Quality Assurance

```bash
# TypeScript Typecheck
npx tsc --noEmit

# Automated Unit Tests
npm test
```

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

