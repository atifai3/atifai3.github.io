ATIF SADIQ — PORTFOLIO WEBSITE
================================

WHAT'S INSIDE
-------------
portfolio/
  index.html         Main page (all sections)
  style.css           All styling (design tokens, layout, responsive rules)
  script.js           All interactions (menu, reveal animations, modal, nav, form)
  robots.txt           Search engine crawl rules
  sitemap.xml           Sitemap for search engines
  assets/images/        Empty folder reserved for future photos
  assets/icons/          favicon.svg

HOW TO RUN LOCALLY
-------------------
No build step, no install, no dependencies.
Just open index.html directly in any browser, or serve the folder
with any static file server, e.g.:

    python3 -m http.server 8000

then visit http://localhost:8000

HOW TO DEPLOY
-------------
This site is 100% static (HTML/CSS/vanilla JS) and works as-is on:

  - GitHub Pages   -> push this folder to a repo, enable Pages on main branch
  - Netlify         -> drag and drop this folder into Netlify's deploy area
  - Vercel           -> import the folder as a static project
  - Any cPanel/static host -> upload the contents of this folder to public_html

Before deploying, update the placeholder domain
"https://atifsadiq.example.com" in index.html (Open Graph / canonical tags),
robots.txt and sitemap.xml to the real domain.

CUSTOMIZING CONTENT
--------------------
All text content lives directly in index.html, organized by section
with clear HTML comments (HEADER, HERO, ABOUT, EDUCATION, SKILLS,
PROJECTS, ACADEMIC EXPERIENCE, SERVICES, AI TOOLS, CAREER OBJECTIVE,
CONTACT, FOOTER). Project details shown in the pop-up modal are also
duplicated in script.js (projectData object) — update both places if
you change project content.

NOTES
-----
- The "Download CV" button and contact form both use mailto: links
  since there is no backend or file attached. Replace the "Download CV"
  handler in script.js with a real link once a CV PDF is available
  (place it in assets/ and point the href at it).
- Colors, type and spacing are defined as CSS custom properties at the
  top of style.css (:root) for easy adjustment.
- Fonts (DM Serif Display, Manrope) load from Google Fonts;
  Font Awesome icons load from cdnjs. Both require an internet
  connection on first load.
