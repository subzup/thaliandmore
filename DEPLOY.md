# Deploying Thali & More

This is a standard Node.js/Express app with no build step and file-based lead storage for the general contact/trial forms. The corporate meal ordering system (`/corporate-order`, `/admin`) additionally needs a Postgres database, see "Database setup" below, since cafeterias, menu items, and bookings are never hardcoded.

This site is currently deployed on **Vercel**. Below is the Vercel setup first, then a Linux VPS (PM2 + Nginx) alternative for self-hosting.

## Database setup (required for /corporate-order and /admin)

1. Create a free Postgres database at [neon.tech](https://neon.tech) (or any Postgres provider).
2. Copy the connection string (`postgresql://user:pass@host/dbname?sslmode=require`).
3. Add it as `DATABASE_URL` in your environment (`.env` locally, or Vercel's Environment Variables for production).
4. Run once against that database:

```bash
npm run db:migrate   # creates tables
npm run db:seed      # loads the initial cafeterias + menu items
```

5. Also set `ADMIN_PASSWORD`, `COOKIE_SECRET`, and `CSRF_SECRET` (see `.env.example`; generate the two secrets with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).

On Vercel specifically: add these four variables in Project → Settings → Environment Variables, then run the migrate/seed commands from your own machine with `DATABASE_URL` set to the same Neon connection string (Vercel's serverless functions don't have a shell to run one-off scripts from).

## Vercel deployment

Vercel auto-deploys on every push to `main` via the GitHub integration already connected to this repo. To configure or update environment variables: Project → Settings → Environment Variables. **Important:** adding or changing an environment variable does not apply to the currently-running deployment — only a fresh deployment (a new git push, not just clicking "Redeploy" on an old build) reliably picks up the new value.

## VPS alternative (self-hosting)

## 1. Prerequisites on the server

```bash
# Node.js 18+ (use nvm or NodeSource; example via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git nginx

node -v   # confirm >= 18
```

## 2. Get the code onto the server

```bash
cd /var/www
git clone https://github.com/subzup/thaliandmore.git
cd thaliandmore
npm install --omit=dev
```

## 3. Configure environment variables

```bash
cp .env.example .env
nano .env
```

Set real production values:

```
PORT=3000
SITE_URL=https://www.thaliandmore.in
WHATSAPP_NUMBER=91XXXXXXXXXX
CONTACT_PHONE_DISPLAY=+91 XXXXX XXXXX
CONTACT_PHONE_HREF=+91XXXXXXXXXX
CONTACT_EMAIL=hello@thaliandmore.in
RESEND_API_KEY=re_xxxxxxxx
LEAD_NOTIFICATION_EMAIL=legal.thaliandmore@gmail.com
DATABASE_URL=postgresql://...
ADMIN_PASSWORD=choose-a-strong-password
COOKIE_SECRET=generate-with-crypto-randomBytes
CSRF_SECRET=generate-with-crypto-randomBytes
```

`.env` is gitignored, so this step has to happen on every server you deploy to.

## 4. Run the app with PM2 (keeps it alive, restarts on crash/reboot)

```bash
sudo npm install -g pm2

pm2 start app.js --name thali-and-more
pm2 save
pm2 startup   # prints a systemd command — copy/paste and run it as instructed
```

Useful PM2 commands:

```bash
pm2 status
pm2 logs thali-and-more
pm2 restart thali-and-more   # after deploying new code
```

The app listens on `PORT` from `.env` (default 3000) on localhost only — Nginx in front of it handles the public-facing port 80/443.

## 5. Nginx reverse proxy

Create `/etc/nginx/sites-available/thaliandmore`:

```nginx
server {
    listen 80;
    server_name thaliandmore.in www.thaliandmore.in;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable it:

```bash
sudo ln -s /etc/nginx/sites-available/thaliandmore /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 6. Point DNS at the server

Create an `A` record for `thaliandmore.in` and `www.thaliandmore.in` pointing to the server's IP, and wait for propagation before the next step.

## 7. HTTPS with Let's Encrypt

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d thaliandmore.in -d www.thaliandmore.in
```

Certbot edits the Nginx config to add the SSL block and sets up auto-renewal (`certbot renew` runs via a systemd timer/cron already installed with the package).

## 8. Deploying updates

```bash
cd /var/www/thaliandmore
git pull origin main
npm install --omit=dev
pm2 restart thali-and-more
```

## Production checklist

- [ ] Real `.env` values set (WhatsApp number, phone, email, `SITE_URL` matching the live domain)
- [ ] `DATABASE_URL`, `ADMIN_PASSWORD`, `COOKIE_SECRET`, `CSRF_SECRET` set and the database migrated + seeded (see "Database setup" above); without `CSRF_SECRET` set, tokens are regenerated randomly on every restart/redeploy, invalidating any open forms
- [ ] `RESEND_API_KEY` and `LEAD_NOTIFICATION_EMAIL` set so contact/trial/order emails actually send, not just log to console
- [ ] Once thaliandmore.in is a verified domain in Resend, set `RESEND_FROM_EMAIL` to a real address on that domain instead of the shared sandbox sender
- [ ] Swap `public/images/og/thali-and-more-og.svg` for a branded 1200x630 JPG/PNG, some platforms (iMessage, some Facebook/Twitter crawlers) don't render SVG `og:image`
- [ ] Change the default `ADMIN_PASSWORD` to something strong and unique, not reused elsewhere
- [ ] Confirm `helmet`'s relaxed CSP (`contentSecurityPolicy: false` in `app.js`) is acceptable, or tighten it now that the final set of external resources (Google Fonts) is known
- [ ] Set up log rotation for PM2 (`pm2 install pm2-logrotate`) so logs don't grow unbounded (VPS only)
- [ ] Confirm `sitemap.xml` and `robots.txt` resolve at the live domain and submit the sitemap in Google Search Console

## Alternative: PaaS (Render, Railway, Fly.io)

If you'd rather not manage a VPS, this app deploys to any Node-friendly PaaS with zero changes:

- **Build command:** `npm install`
- **Start command:** `npm start` (runs `node app.js`)
- **Environment variables:** same keys as `.env.example`, set in the platform's dashboard
- **Persistent storage:** most PaaS platforms use ephemeral filesystems, so `storage/leads.json` will reset on every redeploy there — replace the lead storage with an external integration first if you go this route (see checklist above)
