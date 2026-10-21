/** @type {import('tailwindcss').Config} */
// Semantic tokens are CSS variables (RGB channels) defined in src/app/globals.css.
// Use bg-surface, text-ink, bg-primary ... in components. See frontend/DESIGN.md.
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: v('bg'),
        surface: { DEFAULT: v('surface'), 2: v('surface-2') },
        border: v('border'),
        ink: { DEFAULT: v('ink'), soft: v('ink-soft'), muted: v('ink-muted') },
        primary: {
          DEFAULT: v('primary'),
          hover: v('primary-hover'),
          soft: v('primary-soft'),
          ink: v('primary-ink'),
          fg: v('primary-fg'),
        },
        accent: { DEFAULT: v('accent'), soft: v('accent-soft'), ink: v('accent-ink') },
        ok: { DEFAULT: v('ok'), soft: v('ok-soft') },
        warn: { DEFAULT: v('warn'), soft: v('warn-soft') },
        crit: { DEFAULT: v('crit'), soft: v('crit-soft') },
        ring: v('ring'),

        // Deprecated aliases so not-yet-migrated components degrade gracefully.
        // Remove once components use semantic tokens.
        brand: { DEFAULT: v('primary'), dark: v('primary-hover'), 50: v('primary-soft'), 100: v('primary-soft') },
        navy: { DEFAULT: v('surface-2'), light: v('surface'), lighter: v('surface-2'), border: v('border') },
        page: v('bg'),
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
        card: '20px',
        pill: '999px',
      },
      boxShadow: {
        soft: '0 1px 2px rgb(var(--shadow) / .05), 0 4px 12px rgb(var(--shadow) / .05)',
        lift: '0 2px 4px rgb(var(--shadow) / .05), 0 12px 32px rgb(var(--shadow) / .10)',
        float: '0 4px 8px rgb(var(--shadow) / .06), 0 24px 56px rgb(var(--shadow) / .16)',
      },
      keyframes: {
        'fade-up': { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'none' } },
        'pop-in': { from: { opacity: 0, transform: 'scale(.96)' }, to: { opacity: 1, transform: 'none' } },
      },
      animation: {
        'fade-up': 'fade-up .4s ease-out both',
        'pop-in': 'pop-in .18s ease-out both',
      },
    },
  },
  plugins: [],
}
