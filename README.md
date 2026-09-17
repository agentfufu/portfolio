# bryanmaillet.com

Portfolio site. Static HTML, CSS and JavaScript, no build step. Hosted on GitHub Pages.

## Editing

All content lives in `assets/js/data.js`: projects, gallery, timeline, skills, services,
reviews, contact details. The pages render from it at load.

| What | Where |
|---|---|
| Content | `assets/js/data.js` |
| Page titles and meta | `<head>` of each `.html` |
| Section headings | the `.html` file for that page |
| Colours, type, spacing | `:root` in `assets/css/style.css` |
| Rendering and interactions | `assets/js/site.js` |

Projects get their own page at `project.html?p=slug`, posts at `post.html?id=slug`.
Gallery images tagged with a project's exact title show up on that project's page.
Empty lists (posts, reviews, social links) hide their section.

## Tools

Run from the repo root. The Python ones need `pip install Pillow`.

```
python tools/stamp-dims.py     # write real image sizes into data.js (run after adding images)
python tools/make-og.py        # link preview card -> assets/img/og.png
python tools/make-icons.py     # app icons from the initials
python tools/make-banner.py    # LinkedIn cover image
python tools/make-cards.py     # placeholder cover for a project with no screenshot
python tools/make-cv.py        # resume.html -> assets/cv/cv.pdf (headless Edge/Chrome)
node   tools/gen-sitemap.mjs   # sitemap.xml + robots.txt
```

## Deploy

Push to `main`. GitHub Pages serves it; the domain is set in `CNAME`.

```
git add -A
git commit -m "..."
git push
```

## Layout

```
index.html  about.html  projects.html  project.html  gallery.html
devlog.html  post.html  services.html  resume.html  contact.html  404.html

assets/css/style.css
assets/js/data.js        content
assets/js/site.js        rendering
assets/img/              images, icons, og.png
assets/cv/cv.pdf         generated
tools/                   scripts above
```
