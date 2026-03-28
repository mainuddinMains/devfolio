```markdown
# Design System Document: The Kinetic Darkroom

## 1. Overview & Creative North Star: "The Kinetic Darkroom"
This design system is built to transform a digital portfolio from a static gallery into a high-end editorial experience. The "Kinetic Darkroom" concept treats the screen as a physical space—a dimly lit studio where light is used sparingly and intentionally to guide the eye. 

Unlike generic "Dark Mode" templates that rely on grey boxes and heavy outlines, this system utilizes **Tonal Depth** and **Asymmetric Breathing Room**. We break the traditional grid by allowing elements to overlap, using extreme typographic scale shifts, and replacing structural lines with shifts in surface luminance. The goal is a "Quiet Luxury" aesthetic: sophisticated, confident, and meticulously polished.

---

## 2. Colors & Surface Philosophy
The palette is rooted in deep obsidian and charcoal, punctuated by a high-energy "Electric Neon" accent. 

### The Palette (Material Convention)
*   **Background (Base):** `#131313` (The void)
*   **Surface Tiers:**
    *   `surface_container_lowest`: `#0e0e0e` (Recessed elements/Deep shadows)
    *   `surface_container`: `#201f1f` (Standard cards)
    *   `surface_container_highest`: `#353534` (Floating elements/Elevated status)
*   **Primary Accent:** `#b8c3ff` (The "Neon Electric Blue" glow)
*   **On-Surface (Text):** `#e5e2e1` (Crisp White/Off-white for readability)
*   **Outline-Variant:** `#434656` (Subtle boundary)

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment. 
*   **How to define space:** Use background shifts. A `surface_container_low` section sitting on a `surface` background is the only "border" allowed. 
*   **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., input fields), use the `outline_variant` token at **20% opacity**. Never use 100% opaque borders.

### Glass & Gradient Rule
Main CTAs and high-impact hero elements should use a subtle linear gradient from `primary` (`#b8c3ff`) to `primary_container` (`#2e5bff`) at a 135-degree angle. For floating navigation or overlays, use **Glassmorphism**: 
*   **Fill:** `surface_variant` at 60% opacity.
*   **Effect:** Backdrop-blur of 12px to 20px. 

---

## 3. Typography: Editorial Authority
We use **Inter** as a single-family system, relying on extreme weight and scale contrast to create a hierarchy that feels like a premium fashion magazine.

*   **Display-LG (3.5rem):** Reserved for "Hero" statements. Tracking should be set to -0.02em to feel tight and intentional.
*   **Headline-SM (1.5rem):** Used for project titles. 
*   **Body-LG (1.0rem):** The workhorse for descriptions. Use a line height of 1.6 for maximum "breathing room."
*   **Label-MD (0.75rem):** All-caps with +0.1em letter spacing for metadata (e.g., "YEAR / 2024").

**Hierarchy Note:** Pair a `Display-LG` heading with a `Label-MD` tag immediately above it. The massive scale difference creates the "premium" feel.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "software-like" for this system. We use **Ambient Glows** and **Surface Stacking**.

*   **The Layering Principle:** Place a `surface_container_lowest` card on a `surface` background to create a "sunken" effect. Place a `surface_container_high` card on a `surface` background to create a "lifted" effect.
*   **Ambient Shadows:** For floating modals, use a shadow with a blur of `32px`, `0px` offset, and an opacity of `8%` using the `primary` color token. This creates a soft neon "aura" rather than a dirty grey shadow.
*   **Visual Soul:** Use the `24` (8.5rem) spacing token between major sections. If it feels like "too much" whitespace, you are doing it correctly.

---

## 5. Components

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary_container`), `DEFAULT` (0.25rem) roundedness. Text is `on_primary_fixed_variant`.
*   **Secondary:** No background. `Ghost Border` (20% opacity `outline_variant`).
*   **Interaction:** On hover, the primary button should "glow"—add an outer shadow using the `primary` color at 30% opacity.

### Cards & Projects
*   **Rule:** Forbid divider lines. 
*   **Layout:** Use `surface_container` for the card body. Use `16` (5.5rem) vertical padding between the image and the text description to force a minimalist, gallery-like rhythm.

### Input Fields
*   **State:** Default state is `surface_container_low` with no border.
*   **Focus State:** Transition background to `surface_container_highest` and add a bottom-only 2px stroke of the `primary` neon blue.

### Navigation (The Floating Dock)
*   Instead of a top bar, use a centered "Dock" at the bottom of the screen.
*   **Style:** `Glassmorphism` (60% opacity `surface_container_highest` + 16px blur).
*   **Roundedness:** `full` (9999px).

---

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical layouts. Place text on the left at 2 columns width and the image on the right at 8 columns width.
*   **Do** use the `primary` accent color for *interaction only* (links, buttons, active states).
*   **Do** embrace "The Void"—allow large areas of the `#131313` background to remain empty.

### Don't:
*   **Don't** use pure `#000000` for backgrounds; it kills the tonal depth of the `surface_container` system.
*   **Don't** use standard "cards" with 4-sided borders. 
*   **Don't** use icons unless absolutely necessary. Rely on high-quality typography first.
*   **Don't** use "Grey" for secondary text. Use `on_surface_variant` at 70% opacity to maintain the color temperature of the system.

### Accessibility Note:
Ensure all text on `primary` accents meets a contrast ratio of 4.5:1. Since our primary is a light neon (`#b8c3ff`), use dark text (`on_primary_fixed`) for labels inside buttons.```