# Natural Resources Pest Control — Website

A modern, mobile-friendly marketing site for [Natural Resources Pest Control](https://naturalresourcesfl.com/) in Miami, FL.

## Preview locally

```bash
# From this folder — Python
python -m http.server 8080

# Or Node
npx serve .
```

Open http://localhost:8080

## Deploy

Upload these files to your web host (or replace your current site files):

- `index.html`
- `css/styles.css`
- `js/main.js`

### Options

| Platform | Steps |
|----------|--------|
| **Netlify / Vercel** | Drag this folder into the dashboard, or connect your Git repo |
| **cPanel / FTP** | Upload to `public_html` |
| **Cloudflare Pages** | Connect repo, build command: none, output: `.` |

## Forms

Quote and contact forms currently show a success message in the browser. To receive submissions:

1. **[Formspree](https://formspree.io)** — add `action="https://formspree.io/f/YOUR_ID"` and `method="POST"` to each form
2. **Netlify Forms** — add `data-netlify="true"` to forms when hosted on Netlify
3. **Your CRM** — wire to GorillaDesk or your existing booking system

## Customize

- **Colors**: edit CSS variables at the top of `css/styles.css`
- **Phone / email / address**: search `305-754-4460` and `nrpcfl@gmail.com` in `index.html`
- **Customer portal**: update the top-bar link when you have the portal URL

## Structure

```
naturalresources/
├── index.html      # Single-page site (all sections)
├── css/styles.css  # Design system & layout
├── js/main.js      # Menu, quote wizard, carousel
└── README.md
```
