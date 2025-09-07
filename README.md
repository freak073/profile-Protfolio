# Portfolio (Reference Inspired)

Clean, accessible, fast portfolio site built with semantic HTML, modern CSS (no framework), and a pinch of vanilla JS. Layout & aesthetics are inspired by the provided reference (dark monospace minimalist style with electric‑blue accent + subtle background pattern).

## Features

- Responsive (mobile → large desktop)
- Theme toggle (dark / light) persisted in `localStorage`
- Accessible navigation (skip link, focus styles, reduced motion friendly)
- Semantic sections: Hero, About, Projects, Notes, Contact
- Progressive enhancement (JS only for nav toggle, theme, intersection animations)
- Print friendly (navigation / UI chrome removed)
- Minimal bundle (no external JS deps; Google Fonts only external resource)

## Structure

```text
index.html
assets/
  css/
    style.css
  js/
    main.js
```

## Customization Steps

1. Replace `your name` occurrences with your real name.
2. Update social links (GitHub, LinkedIn, X/Twitter) in the hero section.
3. Provide a real `cv.pdf` at site root or adjust/remove the CV link.
4. Replace project list items under `#projects` with your real projects (anchor `href` to live demos or case studies).
5. Update notes/blog entries in `#notes` or integrate a static site generator later.
6. Configure the contact form:
   - Replace `action="https://example.com/form"` with your backend endpoint or a service (Netlify Forms / Formspree / Basin / GetForm / etc.).
   - Consider adding an anti‑spam honeypot hidden field or CAPTCHA if needed.
7. Swap accent color by changing `--color-accent` in `:root` and `.light` theme overrides.
8. Replace Open Graph meta tags (`og:url`, `og:image`, etc.) with your deployed site info.
9. Add an actual favicon / app icons for better branding.
10. (Optional) Add analytics (Plausible, Umami, etc.) via a small `<script>` at end of `<body>`.

## Accessibility Notes

- Heading hierarchy: `h1` (hero) then `h2` per section; blog note titles use `h3`.
- Sufficient contrast ratios (verify with tooling if you modify colors).
- Focus outlines preserved & improved (`:focus-visible`).
- Skip link for keyboard users.
- Reduced motion users: animations are subtle (you can further gate behind `(prefers-reduced-motion: reduce)` media query if desired).

## Performance Tips

- Self‑host the Google Fonts or use `font-display: swap` (already default) for better CLS.
- Inline critical CSS for faster first paint if you want to optimize further.
- Compress images (when you add them) with modern formats (WebP / AVIF).

## Deployment

Any static host works:

- GitHub Pages
- Netlify (`drag & drop` or `git push`)
- Vercel (just import repo)
- Cloudflare Pages

## Development

Open `index.html` directly or serve locally (for example with `npx serve .` or a VS Code Live Server extension). No build tooling required.

## Future Enhancements (Ideas)

- Integrate MD→HTML build pipeline for notes (Eleventy / Astro / Next.js SSG later)
- Add RSS feed for notes
- Add JSON-LD structured data (Person + BlogPosting)
- Add unit tests for any future interactive components
- Introduce service worker for offline support (simple static asset cache)

## License

Your preferred license (MIT recommended). Currently unlicensed – add one if you plan to open source.

---

Feel free to ask for a React / Next.js variant or MDX blog integration later.
