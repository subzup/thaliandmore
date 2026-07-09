# Deploying Thali & More

This is a standard Node.js/Express app with no build step, no database, and file-based lead storage. Below is the setup for a Linux VPS (Ubuntu 22.04+) with PM2 + Nginx + HTTPS, which is the most common way to self-host a small Express app. A PaaS alternative is at the bottom if you'd rather not manage a server.

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
- [ ] Swap `public/images/og/thali-and-more-og.svg` for a branded 1200x630 JPG/PNG — some platforms (iMessage, some Facebook/Twitter crawlers) don't render SVG `og:image`
- [ ] Replace the `storage/leads.json` file-append logic in `controllers/leadController.js` with a real integration (CRM, Google Sheets, email via a transactional provider) — a flat JSON file is fine for launch-week volume but isn't durable at scale and won't survive redeploys unless the `storage/` folder persists outside the app directory
- [ ] Back up or persist `storage/leads.json` outside the deploy path if you keep the file-based approach (a `git pull` won't touch it since it's gitignored, but a fresh clone or container rebuild will lose it)
- [ ] Confirm `helmet`'s relaxed CSP (`contentSecurityPolicy: false` in `app.js`) is acceptable, or tighten it now that the final set of external resources (Google Fonts) is known
- [ ] Set up log rotation for PM2 (`pm2 install pm2-logrotate`) so logs don't grow unbounded
- [ ] Confirm `sitemap.xml` and `robots.txt` resolve at the live domain and submit the sitemap in Google Search Console

## Alternative: PaaS (Render, Railway, Fly.io)

If you'd rather not manage a VPS, this app deploys to any Node-friendly PaaS with zero changes:

- **Build command:** `npm install`
- **Start command:** `npm start` (runs `node app.js`)
- **Environment variables:** same keys as `.env.example`, set in the platform's dashboard
- **Persistent storage:** most PaaS platforms use ephemeral filesystems, so `storage/leads.json` will reset on every redeploy there — replace the lead storage with an external integration first if you go this route (see checklist above)
