---
name: animejs
description: Best practices, animations, and motion design patterns using anime.js in web applications (React, TypeScript, vanilla JS). Use when building rich animated UIs, page entrances, staggered lists, spring physics, and numeric count-ups.
---

# Anime.js Animation Skill

A comprehensive guide for implementing fluid, modern micro-interactions, entrance choreography, counter animations, and morphing physics using Anime.js in web applications.

## Core Setup in React / TypeScript

```bash
npm install animejs @types/animejs
```

In `tsconfig.app.json`:
```json
"compilerOptions": {
  "allowSyntheticDefaultImports": true,
  "esModuleInterop": true
}
```

Import syntax:
```typescript
import anime from 'animejs';
```

## Best Practice Patterns

### 1. Staggered Entrance (Cards, Lists, Pills)
```typescript
anime({
  targets: selectorOrNodeList,
  opacity: [0, 1],
  translateY: [20, 0],
  delay: anime.stagger(60, { start: 100 }),
  duration: 600,
  easing: 'easeOutQuad',
});
```

### 2. Animated Counter (KPIs, Numbers, Metrics)
```typescript
const obj = { val: 0 };
anime({
  targets: obj,
  val: targetNumber,
  duration: 1500,
  easing: 'easeOutExpo',
  round: 1,
  update() {
    element.textContent = obj.val.toLocaleString();
  },
});
```

### 3. Spring Entrance (Modals, Badges, Hero Elements)
```typescript
anime({
  targets: elementRef.current,
  opacity: [0, 1],
  scale: [0.85, 1],
  duration: 1000,
  easing: 'easeOutElastic(1, .6)',
});
```

### 4. Continuous Ambient Glow / Pulse
```typescript
anime({
  targets: glowElement,
  opacity: [0.2, 0.5],
  scale: [1, 1.08],
  duration: 2500,
  direction: 'alternate',
  loop: true,
  easing: 'easeInOutSine',
});
```
