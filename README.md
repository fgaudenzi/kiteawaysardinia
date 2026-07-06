# Kite Away Sardinia

Single-page multilingual Jekyll website for Kite Away Sardinia.

The site is built with Jekyll layouts and includes, but each language is still a single page: navigation items such as Lessons, Spot, About, FAQ, and Contact link to anchors on the current page instead of opening separate section pages.

## Architecture

```text
_config.yml                 Jekyll and multilingual configuration
index.html                  Single page entry point with section includes
_layouts/default.html       Shared HTML shell, fonts, CSS, header, footer, JS
_includes/site-header.html  Header, anchor navigation, language switcher
_includes/section-*.html    Modular page sections
_includes/site-footer.html  Shared footer
_i18n/en.yml                English strings
_i18n/it.yml                Italian strings
_i18n/fr.yml                French strings
_i18n/de.yml                German strings
assets/css/main.css         Site styles and responsive layout
assets/js/main.js           Mobile menu and sticky header behavior
image.png                   Main hero image
```

## Multilingual Output

Jekyll uses `jekyll-multiple-languages-plugin` and builds one single-page version per language:

```text
_site/index.html       English
_site/it/index.html    Italian
_site/fr/index.html    French
_site/de/index.html    German
```

The section navigation stays on-page in every language:

```text
#lessons
#spot
#about
#faq
#contact
```

There are no generated pages such as `lessons.html`, `spot.html`, `about.html`, `faq.html`, or `contact.html`.

## Image Requirements

Use optimized `.jpg` or `.webp` files for production where possible. Keep the same aspect ratios so the layout stays stable.

| Usage | Current Source | Recommended Size | Aspect Ratio | Notes |
| --- | --- | ---: | ---: | --- |
| Hero background | `image.png` | 1536 x 1024 px minimum | 3:2 | Main first-screen image. Keep the subject centered or slightly right so text remains readable on the left. |
| Lesson card 1 | Unsplash placeholder | 900 x 650 px | ~4:3 | Beginner lesson image. Replace with a real lesson/action photo. |
| Lesson card 2 | Unsplash placeholder | 900 x 650 px | ~4:3 | Equipment, beach setup, or instructor image. |
| Lesson card 3 | Unsplash placeholder | 900 x 650 px | ~4:3 | Lifestyle, turquoise water, or private coaching image. |
| Spot feature | `assets/images/spot-feature.jpg` | 960 x 720 px | 4:3 | Spot/location photo used in the dark section. |
| Gallery images | `assets/images/gallery/01.jpg` to `04.jpg` | 700 x 520 px minimum | flexible, cropped square in CSS | The grid crops these to square thumbnails with `object-fit: cover`. |

External placeholder images currently come from Unsplash URLs in `_includes/section-lessons.html`. For production, download licensed final images and store them locally under `assets/images/`.

## Color Palette

```text
Primary:                #005D73
Secondary:              #0FA3B1
Accent Orange:          #F97316
Accent Yellow:          #FBBF24
Background:             #FFFFFF
Alternative Background: #FAFAFA
Text:                   #102A43
Borders:                #E2E8F0
```

These tokens are defined at the top of `assets/css/main.css`.

## Build

Install Ruby gems once:

```bash
bundle install
```

Build the multilingual static site:

```bash
bundle exec jekyll build
```

The generated site is written to `_site/`.

## Run Locally

With Jekyll:

```bash
bundle exec jekyll serve --host 127.0.0.1 --port 4000
```

Then open:

```text
http://127.0.0.1:4000/
```

You can also preview the generated `_site` folder with a simple static server:

```bash
cd _site
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:8000/
```

## Editing Notes

- Add or reorder sections in `index.html` by changing the include list.
- Edit section markup in `_includes/section-*.html`.
- Edit translations in `_i18n/en.yml`, `_i18n/it.yml`, `_i18n/fr.yml`, and `_i18n/de.yml`.
- Change layout shell in `_layouts/default.html`.
- Change colors, spacing, and responsive rules in `assets/css/main.css`.
- Update the WhatsApp number in `_includes/site-header.html` and `_includes/section-contact.html`.
