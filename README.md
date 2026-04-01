# Kushal Diamonds Profile

Customer-facing digital profile organized into a clear `client` and `server` structure.

## Structure

- `client/`
- `client/index.html`: the single frontend page to review and hand off
- `client/assets/`: all images, SVGs, profile media, gallery files, and downloadable contact cards
- `server/`
- `server/server.js`: lightweight local server for previewing the client app at `/`
- `package.json`: simple local run scripts

## Why This Structure

- The frontend is isolated inside `client/`, so the client-facing deliverable stays clean.
- The page no longer depends on an external `data.json`; profile content is embedded directly inside `client/index.html`.
- The server is intentionally minimal and only exists to serve the page locally in a professional way.

## Run Locally

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

## Deployment

- `netlify.toml` is configured to publish the `client/` folder.
- The site root resolves to `client/index.html`.

## Client Handoff

- Share the `client/` folder as the frontend deliverable.
- The main page is `client/index.html`.
- All required frontend assets are already connected through that page.

## Notes

- Social sharing metadata and profile preview assets are already wired into the frontend.
- Legacy folders and export junk were removed to keep the repository focused on the actual product.
