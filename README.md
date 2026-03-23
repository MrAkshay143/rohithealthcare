# Rohit Health Care — Full-Stack Web Application

A modern, production-ready healthcare website for **Rohit Health Care**, a diagnostic clinic in Balarampur, West Bengal, India — associated with Apollo Diagnostics.

🌐 **Live Site:** [rhc.imakshay.in](https://rhc.imakshay.in)

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, TailwindCSS v4 |
| **Backend** | Laravel 12, PHP 8.2 |
| **Database** | MySQL (Hostinger shared) |
| **Deployment** | Hostinger shared hosting, Python deploy script |
| **Auth** | Custom cookie-based session (SHA-256 token) |

---

## 📄 Pages

### Public (Patient-Facing)
| Route | Description |
|---|---|
| `/` | Homepage — hero slider, stats bar, services, doctors, blogs, CTA |
| `/about` | About the clinic — highlights, story, why us |
| `/services` | Diagnostic services grid |
| `/doctors` | Medical team with availability badges |
| `/gallery` | Photo gallery of clinic & events |
| `/blogs` | News & health camp articles |
| `/blogs/:slug` | Individual blog post / article |
| `/contact` | Contact form, map, hours, directions |

### Admin Panel (`/admin`)
| Route | Description |
|---|---|
| `/admin/login` | Secure admin login |
| `/admin` | Dashboard with stats summary |
| `/admin/doctors` | Doctor CRUD + drag-to-reorder |
| `/admin/blogs` | Blog post editor with draft/publish toggle |
| `/admin/gallery` | Gallery photo management |
| `/admin/hero` | Hero slide management |
| `/admin/services` | Diagnostic services CRUD + reorder |
| `/admin/enquiries` | Enquiry / lead management |
| `/admin/content` | Site content editor (all text keys) |
| `/admin/settings` | Password change, logo, SEO per-page |

---

## 🔑 Key Features

- **Single API call home bundle** — fetches all homepage data (content, doctors, blogs, hero slides, services) in one request with server-side 1-hour cache
- **Content management system** — every text string on the site is editable via admin panel without touching code
- **Token-based admin auth** — SHA-256 hashed session tokens stored in DB, raw token in httpOnly secure cookie
- **Auto cache invalidation** — model observers clear home bundle cache on any content update
- **Image uploads** — self-hosted on `/backend/uploads/`
- **SEO management** — per-page title, description, keywords, global OG image via admin settings
- **Drag-to-reorder** — doctors and services support drag-and-drop reordering
- **Floating contact buttons** — WhatsApp and Call buttons with admin toggle control
- **Brand color system** — single CSS variable `--brand-green: #4e66b3` controls all brand accents

---

## 🚀 Local Development

### Prerequisites
- Node.js 20+, PHP 8.2+, Composer, MySQL

### Frontend
```bash
cd "c:/Projects/Rohit Health Care/new-version"
npm install
npm run dev            # starts Vite dev server at http://localhost:5173
```

### Backend
```bash
cd backend
composer install
cp .env.example .env   # set DB_* and FRONTEND_URL
php artisan key:generate
php artisan migrate --seed
php artisan serve      # starts at http://localhost:8000
```

### Environment Variables (frontend `.env`)
```
VITE_BACKEND_ORIGIN=http://localhost:8000
VITE_BACKEND_PATH=/api
```

---

## 📦 Deployment

A Python deploy script handles the full deployment pipeline:

```bash
python deploy.py
```

What it does:
1. Builds frontend (`npm run build`)
2. SSH connects to Hostinger server
3. Cleans old frontend and backend files (preserves `.env`, `vendor/`, `storage/`)
4. Uploads new frontend (`dist/`) and backend files
5. Runs Laravel artisan: `cache:clear`, `config:cache`, `route:cache`, `migrate --force`

**Server:** `u581617111@145.79.213.57` (port 65002)

---

## 🗄️ Database Schema (Key Tables)

| Table | Purpose |
|---|---|
| `admin_users` | Admin credentials + session token |
| `site_contents` | All CMS text key-value pairs |
| `site_settings` | App settings (SEO, logo, domain) |
| `doctors` | Doctor profiles |
| `services` | Diagnostic services |
| `blogs` | Blog posts / news articles |
| `hero_slides` | Homepage hero carousel slides |
| `gallery` | Gallery photos |
| `enquiries` | Contact form submissions |

---

## 📊 Admin Default Credentials

| Field | Value |
|---|---|
| Username | `admin` |
| Password | `Admin@rhc2026` |

> ⚠️ Change the password immediately after first login via Admin → Settings

---

## 📁 Project Structure

```
new-version/
├── src/                    # React frontend
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin panel pages
│   │   └── *.tsx           # Public pages
│   ├── components/         # Shared UI components
│   ├── services/           # API client + content defaults
│   ├── hooks/              # React hooks (useContent, useSEO, etc.)
│   └── globals.css         # Global styles + brand color tokens
├── backend/                # Laravel API
│   ├── app/Http/Controllers/Api/  # API controllers
│   ├── app/Http/Middleware/       # AdminAuth middleware
│   ├── app/Models/               # Eloquent models
│   ├── database/                 # Migrations + seeders
│   └── routes/                   # api.php + web.php
├── deploy.py               # Automated deployment script
├── PROJECT_ANALYSIS.md     # Bug tracking + improvement notes
└── dist/                   # Built frontend (generated)
```

---

## 🔒 Security Notes

- Admin cookies: `httpOnly`, `secure`, `SameSite=Lax`
- Session tokens: SHA-256 hash in DB, raw in cookie (never stored in plain text)
- CORS: configured to allow only `rhc.imakshay.in` and `localhost:5173`
- Rate limiting: Login (5/min), Enquiry (3/min)

---

## 📝 Known Issues & Roadmap

See [PROJECT_ANALYSIS.md](./PROJECT_ANALYSIS.md) for a detailed bug report and improvement roadmap.
