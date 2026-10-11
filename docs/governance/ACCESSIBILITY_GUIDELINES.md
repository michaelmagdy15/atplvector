# ATPLVector Universal Accessibility Guidelines
## WCAG 2.2 Level AA Standard for Aviation Cockpit & Engineering Simulators

**Document Version:** 1.0.0  
**Effective Date:** 2026-10-12  
**Target Conformance:** W3C WCAG 2.2 Level AA / Section 508 / EN 301 549  
**Governance Scope:** Web Platform (`atplvector.com`), iOS/iPadOS Shell (`com.atplvector01.app`), Interactive Aerodynamic & Avionics Canvas Modules  
**Authority:** ATPLVector Authoring Governance & Quality Review Board  

---

## 1. Overview & Core Principles (POUR)

Aviation training applications must be exceptionally reliable, clear, and universally operable. Pilots, student cadets, and flight instructors include individuals with color vision proficiencies, motor control requirements, vestibular considerations, and diverse screen-magnification needs.

Every interactive component in ATPLVector must satisfy the four POUR principles:
1. **Perceivable:** Visual gauges, graphs, dials, and aerofoil animations must have high-contrast text alternatives, ARIA live region readouts, and clear structural cues.
2. **Operable:** All cockpit controls (rotary knobs, thrust sliders, altimeter subscale calibration) must be 100% operable via keyboard alone and support direct numeric entry.
3. **Understandable:** Units of measure, error states, and control behaviors must be predictable and clearly labeled.
4. **Robust:** Compatible with assistive technologies (NVDA, VoiceOver, JAWS, screen magnifiers) across Chrome, Safari, iOS WKWebView, and iPadOS.

---

## 2. Keyboard Accessibility for Sliders, Dials & Rotary Knobs

### 2.1 Slider Standards (`<input type="range">` and Custom Sliders)

Range inputs (e.g. Altimeter subscale, Constriction ratio, Flap settings, Center of Gravity ballast sliders) must meet these specifications:

#### Mandatory Attributes:
```html
<div className="range-control-group">
  <label htmlFor="indicated-alt-input" className="text-sm font-semibold text-slate-200">
    Indicated Altitude
  </label>
  <div className="flex items-center gap-3">
    <input
      id="indicated-alt-input"
      type="range"
      min={0}
      max={45000}
      step={100}
      value={indicatedAlt}
      onChange={(e) => setIndicatedAlt(Number(e.target.value))}
      aria-label="Indicated Altitude in feet"
      aria-valuemin={0}
      aria-valuemax={45000}
      aria-valuenow={indicatedAlt}
      aria-valuetext={`${indicatedAlt} feet`}
      className="focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
    />
    <input
      type="number"
      min={0}
      max={45000}
      step={100}
      value={indicatedAlt}
      onChange={(e) => setIndicatedAlt(Number(e.target.value))}
      aria-label="Direct Indicated Altitude entry in feet"
      className="w-24 px-2 py-1 text-sm bg-slate-900 border border-slate-700 text-white rounded font-mono focus-visible:ring-2 focus-visible:ring-cyan-400"
    />
  </div>
</div>
```

#### Keyboard Key Event Matrix:
| Key | Action | Example (Altimeter Sub-Scale $940\text{–}1060\text{ hPa}$) |
| :--- | :--- | :--- |
| `ArrowRight` / `ArrowUp` | Increment by 1 step | $1013\text{ hPa} \to 1014\text{ hPa}$ ($+1\text{ hPa}$) |
| `ArrowLeft` / `ArrowDown` | Decrement by 1 step | $1013\text{ hPa} \to 1012\text{ hPa}$ ($-1\text{ hPa}$) |
| `PageUp` | Coarse increment (10x step) | $1013\text{ hPa} \to 1023\text{ hPa}$ ($+10\text{ hPa}$) |
| `PageDown` | Coarse decrement (10x step) | $1013\text{ hPa} \to 1003\text{ hPa}$ ($-10\text{ hPa}$) |
| `Home` | Jump to minimum value | $940\text{ hPa}$ |
| `End` | Jump to maximum value | $1060\text{ hPa}$ |

### 2.2 Rotary Dials & Heading Cards (VOR OBS, ADF Card, Compass)

Custom interactive circular dials (e.g. VOR Omni Bearing Selector, ADF Heading card, Directional Gyro) that currently rely on mouse drag (`handleMouseMove`) **must** implement keyboard event listeners:

1. **Role & Focusability:** Set `role="slider"`, `tabIndex={0}`, and appropriate ARIA attributes.
2. **Keyboard Handler:**
```typescript
const handleDialKeyDown = (e: React.KeyboardEvent) => {
  let delta = 0;
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = 1;
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = -1;
  else if (e.key === 'PageUp') delta = 10;
  else if (e.key === 'PageDown') delta = -10;
  else if (e.key === 'Home') { setBearing(0); return; }
  else if (e.key === 'End') { setBearing(359); return; }
  else return;

  e.preventDefault();
  setBearing((prev) => (prev + delta + 360) % 360);
};
```
3. **Screen Reader Announcement:**
   Provide `aria-valuetext={`${bearing}° Magnetic Inbound`}` so screen reader users hear the current aviation heading rather than an arbitrary raw number.
4. **Direct Numeric Fallback:**
   Always place a compact numeric stepper or input adjacent to the dial allowing direct typing of the desired radial/heading (e.g., typing `270` directly).

---

## 3. Reduced-Motion Fallbacks for Aerodynamic & Atmospheric Animations

### 3.1 Vestibular Safety Requirement (WCAG 2.2 SC 2.2.2 & SC 2.3.3)
Continuous spinning vortices, rotating rotor blades, turbulent air particles, and pulsing weather radar sweeps can induce severe nausea, dizziness, and disorientation in vestibular-sensitive pilots.

### 3.2 Global CSS Reduced-Motion Reset
In `index.css`:
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  .animate-spin,
  .animate-spin-slow,
  .animate-spin-reverse-slow,
  .animate-pulse,
  .animate-bounce {
    animation: none !important;
  }
}
```

### 3.3 React Hook: `useReducedMotion`
Every component containing animated Canvas, SVG, or Framer Motion visualizers must consume the user's reduced-motion preference:

```typescript
import { useState, useEffect } from 'react';

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return prefersReducedMotion;
}
```

### 3.4 Static Educational Fallbacks
When `prefersReducedMotion === true`:
1. **Wing Tip Vortices (`ThreeDAirflow.tsx`):**
   - Disables `animate-spin-slow` and `animate-spin-reverse-slow`.
   - Renders a clean static vector diagram with clear directional curl arrows ($\circlearrowright$ and $\circlearrowleft$), labeled pressure differentials ($P_{\text{high}}$ beneath wing, $P_{\text{low}}$ above wing), and a downward downwash force vector.
2. **Venturi & Airflow Tube (`AirflowBasics.tsx`):**
   - Disables continuous streamline particle flow.
   - Displays static streamlines with color gradient isobar shading (red = high static pressure/low velocity, blue = low static pressure/high velocity).
3. **Radar Sweeps & Weather Simulators (`WeatherRadar.tsx`):**
   - Replaces the $360^\circ$ continuous rotating phosphor line sweep with an instantaneous display of precipitation reflectivity returns ($Z$ in $\text{dBZ}$).
4. **Pause / Play / Step Controls:**
   - Every simulation with time-dependent physics must offer:
     - `[Pause / Resume]` button (shortcut: `Space`).
     - `[Step Forward]` button (shortcut: `F`).
     - `[Reset]` button (shortcut: `R`).

---

## 4. High-Contrast Dark Theme Compliance

### 4.1 WCAG 2.2 AA Contrast Ratios
- **Normal Text (< 18pt / < 14pt bold):** Minimum contrast ratio of **$4.5:1$** against adjacent background.
- **Large Text ($\ge 18\text{pt}$ / $\ge 14\text{pt}$ bold):** Minimum contrast ratio of **$3.0:1$**.
- **UI Components & Graphical Objects:** Minimum contrast ratio of **$3.0:1$** for borders, icons, and active focus boundaries.

### 4.2 ATPLVector Dark Palette Audit & Remediation

| Token / Color | Hex Code | Tested Against | Raw Ratio | WCAG AA Status | Remediation Required |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`bg-slate-950`** (Base background) | `#020617` | — | — | Baseline | None |
| **`bg-slate-900`** (Card surface) | `#0F172A` | — | — | Surface | None |
| **`text-white`** | `#FFFFFF` | `#0F172A` | **15.8:1** | ✅ PASS | None |
| **`text-slate-100`** | `#F1F5F9` | `#0F172A` | **13.5:1** | ✅ PASS | None |
| **`text-slate-300`** | `#CBD5E1` | `#0F172A` | **9.1:1** | ✅ PASS | Excellent secondary text |
| **`text-slate-400`** | `#94A3B8` | `#0F172A` | **5.4:1** | ✅ PASS | Acceptable for captions |
| **`text-slate-500`** | `#64748B` | `#0F172A` | **3.3:1** | ❌ **FAIL** (Normal text) | **Replace with `text-slate-400` or `#94A3B8`** |
| **`text-slate-600`** | `#475569` | `#0F172A` | **2.0:1** | ❌ **FAIL** | Prohibited for text |
| **`text-emerald-400`** (Correct answer) | `#34D399` | `#0F172A` | **9.5:1** | ✅ PASS | Highly visible |
| **`text-cyan-400`** (Primary accent) | `#22D3EE` | `#0F172A` | **10.2:1** | ✅ PASS | Highly visible |
| **`text-amber-400`** (Caution / Warning) | `#FBBF24` | `#0F172A` | **10.5:1** | ✅ PASS | Highly visible |
| **`text-red-400`** (Error / Alert) | `#F87171` | `#0F172A` | **5.8:1** | ✅ PASS | Compliant |
| **`border-slate-800`** | `#1E293B` | `#020617` | **1.3:1** | ⚠️ Border only | Upgrade active card borders to `#334155` |

### 4.3 Focus Visible Rule (WCAG 2.2 SC 2.4.7 & SC 2.4.11)
Browsers must never have `outline: none` without a high-contrast replacement.
All focusable elements in ATPLVector must use the global focus visible ring:
```css
:focus-visible {
  outline: 2px solid #22D3EE !important; /* Cyan-400: contrast 10.2:1 against dark surface */
  outline-offset: 2px !important;
}
```

---

## 5. Mobile & Touch Accessibility (Apple HIG / WCAG SC 2.5.8)

1. **Target Size Minimum:**
   - Every button, tab, and card interactive target must measure at least **$44 \times 44\text{ pt}$** ($48 \times 48\text{ px}$).
   - On compact mobile headers (such as the `h-13` / 52px top header on iPhone), icons must have surrounding touch padding (`p-2.5` to `p-3`).
2. **Viewport Scaling Gracefulness:**
   - While `user-scalable=no` is enforced in the native iOS app shell to prevent accidental double-tap gesture misfires during simulator manipulation, the layout must scale cleanly up to 200% text zoom via iOS Dynamic Type and browser font scaling (`rem` and `clamp()` units, no hardcoded `px` text heights).
3. **Safe Area Clearance:**
   - No interactive button may sit within $12\text{ px}$ of the Dynamic Island or Home Indicator.
   - All floating action buttons (Pomodoro timer, Scratchpad) float above the bottom tab bar with dynamic bottom offsets: `bottom-[calc(max(env(safe-area-inset-bottom,0px),var(--sab,0px))+5.5rem)]`.
