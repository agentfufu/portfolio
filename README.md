# Portfolio website

A static portfolio site: plain HTML, CSS and JavaScript. No build step, no dependencies,
no framework. Double-click `index.html` to open it, or host it anywhere that serves files.

## Editing the content

**Almost everything lives in one file: `assets/js/data.js`.**
Projects, devlog posts, gallery images, services, skills, experience, your name and links,
all of it. Search that file for `<<EDIT>>` to find every placeholder.

Things that are *not* in `data.js`:

| What | Where |
|---|---|
| Page `<title>` and meta description | The `<head>` of each `.html` file |
| Favicon initials | `assets/img/favicon.svg` |
| Section headings and intro copy | The `.html` file for that page |
| Colours, spacing, type | `assets/css/style.css` (the `:root` block at the top) |

### Adding a project

Add an entry to the `PROJECTS` array in `data.js`. It shows up on the projects page
automatically, and gets its own page at `project.html?p=your-slug`.
Set `featured: true` on three of them to control what appears on the home page.

### Adding a devlog post

Add an entry to `POSTS`. Newest `date` sorts first. The post reads at `post.html?id=your-slug`.
The `body` field is plain HTML, so use `<h3>`, `<p>`, `<ul>`, `<code>`.

### Adding gallery images

Drop your screenshots in `assets/img/gallery/` and add them to the `GALLERY` array. Save
them as `.jpg` or `.webp` and resize to ~1600px wide. Huge screenshots are the main thing
that makes a portfolio feel slow. Then run:

```
python tools/stamp-dims.py
```

That measures every gallery image and project cover and writes its real pixel size into
`data.js` (`w`/`h`, and `coverW`/`coverH`). The gallery is a masonry layout where each shot
keeps its own shape, so without those numbers the browser reserves no space and the whole
grid jumps around as the images land. Re-run it whenever you add or replace an image. While `GALLERY` is empty the page says so and points
visitors at the projects page instead.

Two things run off each image's `tags`:

- The **filter chips** at the top of the gallery page are built from every tag in use.
- A **project page shows its own screenshots** automatically: any gallery image tagged
  with a project's exact `title` appears in a strip near the bottom of that project page.
  So `tags: ["Wildlife Warfare", "Level Design"]` puts a shot in both places at once.

The 16 shots in there now are the official Steam store screenshots for the three shipped
titles, resized and re-compressed. They show the games, not specifically your own work, so
**swap in your own captures whenever you have them**, and rewrite the captions to say what
you did in that shot rather than what the shot is.

### Project cover images

Each project's `cover` is its card image, currently a screenshot from that game's Steam
page. To change one, drop a `.jpg` in `assets/img/projects/` and point `cover` at it.

There's also a generator for placeholder cards, for a project with no screenshot yet:

```
python tools/make-cards.py            # only draws covers that don't exist yet
python tools/make-cards.py --force    # redraws all of them (don't, it overwrites real shots)
```

It skips any cover file that already exists, so the real screenshots are safe unless you
pass `--force`.

### The "At a glance" table

Each project can carry a `facts` list of `{ label, value }` pairs shown as a small table on
its page (released, studio, engine, platform, modes, what you did). Leave the field out and
the table doesn't render. It's the fastest way for someone skimming to work out what the
project actually was.

## Colours

The whole palette is CSS variables at the top of `assets/css/style.css`.
`--accent` is the orange; change that one line and the entire site follows.
Dark is the default; the light palette is in the `[data-theme="light"]` block.
The toggle in the header remembers the visitor's choice.

## The contact form

Out of the box the form opens the visitor's email client with the message pre-filled.
Nothing is sent through the site and nothing is stored. That works everywhere with zero setup.

**To get real submissions in your inbox:**

1. Sign up at [Formspree](https://formspree.io) (the free tier is fine) and create a form.
2. Paste the endpoint it gives you into `formEndpoint` in `data.js`:

   ```js
   formEndpoint: "https://formspree.io/f/xdkoblqz",
   ```

That's the whole change. No HTML edit, no code change. The form then submits in the
background, the visitor stays on the page, and they get a confirmation message. If the
service is down or rejects the message, the error is shown along with your email address
so nobody hits a dead end.

Any service that accepts a `POST` of `FormData` and answers with JSON works the same way
(Formspree, Basin, Web3Forms, Getform). The form also carries a honeypot field that silently
drops bot submissions, and validates name/email/message before sending anything.

## Search and filtering

The projects grid and the devlog both have a search box and tag chips. State lives in the
query string, so `projects.html?tag=VR&q=hands` is a link you can send someone and it opens
already filtered. Pressing `/` anywhere on those pages jumps to the search box.

Nothing to configure. The tag chips are built from the `tags` you give each project and
post, so they stay in step as you add content.

## SEO and link previews

- Each page carries a description, Open Graph and Twitter card tags. Project and post pages
  rewrite theirs from `data.js`, so a shared project link previews as *that project*.
- Structured data (schema.org `Person`, `WebSite`, `CreativeWork`, `BlogPosting`) is emitted
  as JSON-LD on every page. This is what lets Google show you as a person rather than a
  page of text.
- **Set `url` in `data.js` once you deploy** (e.g. `"https://yourname.dev"`). That switches on
  canonical tags, `og:url`, and absolute image URLs. Social scrapers reject relative ones.

### The link preview image

`assets/img/og.png` is what appears when the site is pasted into Slack, Discord, LinkedIn,
iMessage or X. It is generated from your name and role in `data.js`:

```
python tools/make-og.py       # needs: pip install Pillow
```

Re-run it after you change your name, role or headline. (The old `og.svg` is unused, since no
social platform renders SVG previews, which is why this is a PNG.)

### App icons and the manifest

`site.webmanifest` plus three PNGs cover the places an SVG favicon doesn't reach: Android's
"add to home screen", iOS's `apple-touch-icon`, and the browser's install prompt. Without
them a saved shortcut gets a screenshot of the page instead of your mark.

```
python tools/make-icons.py    # needs: pip install Pillow
```

It reads `initials` from `data.js` and writes `icon-192.png`, `icon-512.png` and
`apple-touch-icon.png` into `assets/img/`. There's a matching one for the LinkedIn cover
image, drawn in the same visual language so a recruiter jumping from LinkedIn to the site
lands somewhere that looks like the same person:

```
python tools/make-banner.py   # -> assets/img/linkedin-banner.png, 1584x396
```

It leaves the bottom-left corner empty on purpose, because that's where LinkedIn drops the profile
photo, and keeps everything away from the side edges, which mobile crops. Edit `CREDITS`
in the script when you ship something new. Re-run it if you change your initials. If you
change the accent colour, update `ACCENT` in the script and `theme_color` in
`site.webmanifest` to match.

### Sitemap

After adding projects or posts:

```
node tools/gen-sitemap.mjs
```

That writes `sitemap.xml` and `robots.txt` covering every page, project and post. It needs
`url` set in `data.js` first, and will tell you so if it isn't.

## Your CV

`assets/cv/cv.pdf` is generated from `resume.html`, which is print-styled to fit two pages.
Re-run this after changing anything in `TIMELINE`, `EDUCATION`, `SKILLS` or `PROJECTS`:

```
"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="%CD%ssets\cv\cv.pdf" "file:///%CD:\=/%/resume.html"
```

(Or just open `resume.html` in a browser, Ctrl+P, Save as PDF, and save it over `assets/cv/cv.pdf`.)
The path lives in `cv` in `data.js`; set it to `""` and the "Download CV" buttons hide themselves.

## Publishing it

All three of these are free and work with this site as-is:

- **Netlify**: drag the whole folder onto [app.netlify.com/drop](https://app.netlify.com/drop). Done in about ten seconds.
- **GitHub Pages**: push the folder to a repo, then Settings → Pages → deploy from `main` / root.
- **Cloudflare Pages**: connect the repo, leave the build command empty, output directory `/`.

Then point your own domain at it from the host's dashboard.

## Before you go live, checklist

- [x] Real name, email and identity in `data.js` and every page `<head>`
- [x] Real projects, the three shipped Steam titles, with write-ups and fact tables
- [x] Real experience, all five roles
- [x] Education / training, the self-taught entry in `EDUCATION`
- [x] Screenshots, covers and a 16-image gallery, from the Steam store pages
- [ ] **Profile links**: `social` in `data.js` is empty; paste your GitHub and LinkedIn URLs
- [x] Location set in `data.js`
- [ ] Your *own* captures to replace the store screenshots, with captions about your work
- [ ] A real photo at `assets/img/portrait.svg` (About page)
- [ ] `url` set in `data.js`, then `node tools/gen-sitemap.mjs`
- [x] `python tools/make-og.py` re-run so the link preview shows your real name
- [ ] `formEndpoint` set in `data.js`, and a test message actually received
- [x] `cv` set in `data.js`, `assets/cv/cv.pdf` generated from `resume.html`
- [ ] A first devlog post in `POSTS`, the devlog page is empty and hides itself for now
- [ ] Check it on a phone

## Structure

```
index.html      home
404.html        not-found page (served automatically by every host below)
about.html      bio, skills, experience
projects.html   filterable project grid
project.html    single project    (project.html?p=slug)
gallery.html    image grid + lightbox
devlog.html     post list
post.html       single post       (post.html?id=slug)
services.html   what you offer, process, FAQ
resume.html     one-page resume, print-friendly
contact.html    form + details

assets/css/style.css   all styling
assets/js/data.js      ALL CONTENT, edit this
assets/js/site.js      rendering and interactions
assets/img/            images
assets/img/og.png      link preview card (generated)
assets/img/icon-*.png  app icons        (generated)
assets/img/linkedin-banner.png   LinkedIn cover (generated)

site.webmanifest       name, colours and icons for "add to home screen"
robots.txt             regenerated with sitemap.xml once `url` is set

tools/make-og.py       regenerates the link preview image
tools/make-icons.py    regenerates the app icons
tools/make-banner.py   regenerates the LinkedIn cover image
tools/make-cards.py    draws placeholder project covers
tools/stamp-dims.py    writes real image sizes into data.js
tools/gen-sitemap.mjs  regenerates sitemap.xml + robots.txt
```

The two scripts in `tools/` are optional helpers you run by hand, the site itself still
has no build step and no dependencies.
