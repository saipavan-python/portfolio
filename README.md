# Sai Pavan Kumar Kistamsetty — Portfolio

Personal portfolio for AI engineering and full-stack work. The site is a static, dependency-free build designed for GitHub Pages.

## What is here

- Semantic single-page portfolio with dark and light themes
- Seven project case studies, with alternating layouts and colors for each project
- Responsive layouts from 360px to 1920px
- Accessible keyboard navigation, focus states, and reduced-motion support
- SEO metadata, JSON-LD, Open Graph image, sitemap, robots, and manifest
- Downloadable one-page resume

## Stack

- HTML5
- Custom CSS
- Vanilla JavaScript
- No framework, package manager, or build step

## Local preview

```powershell
python -m http.server 4173
```

Open `http://127.0.0.1:4173/`.

## Structure

```text
.
├── index.html
├── 404.html
├── styles.css
├── script.js
├── resume.pdf
├── robots.txt
├── sitemap.xml
├── site.webmanifest
└── assets/
    ├── projects/
    └── resume/
```

## Deployment

The repository is served by GitHub Pages from the root of the `main` branch at:

`https://saipavan-python.github.io/portfolio/`

No build command is required. Commit the static files and push to `main`.

## Content notes

- Near Wheels and BookLoop India are private builds. Their case studies describe verified implementation details and do not link to a public deployment.
- Open Competitor Lens is an early public release. Its research library and tests are ready; the full web service and command-line tool are still in progress.
- The contact form does not submit to a server. It validates the fields and opens a pre-filled email draft.

## Contact

- Email: saipavankistamsetty@gmail.com
- LinkedIn: https://www.linkedin.com/in/sai-pavan-kistamsetty-60a755252
- GitHub: https://github.com/saipavan-python
