<div align="center">

# 🏥 Rohit Health Care

**Modern Full-Stack Clinic Management Website**

A responsive, feature-rich healthcare website and admin panel for **Rohit Health Care** - a diagnostic healthcare facility. Built with a modern tech stack for performance, usability, and easy content management.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?logo=laravel&logoColor=white)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.3-777BB4?logo=php&logoColor=white)](https://php.net)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)](https://mysql.com)

🌐 **Live**: [rhc.imakshay.in](https://rhc.imakshay.in)

</div>

---

## ✨ Features

### 🌍 Public Website

- **Home Page** - Hero slider, services overview, doctor highlights, stats strip, blog previews, CTA section
- **About Page** - Clinic information, highlights, and why-choose-us section
- **Services Page** - Dynamic service listings with health-themed icons
- **Doctors Page** - Doctor profiles with photos, specialties, and qualifications
- **Blog & News** - Full blog system with YouTube video embed support
- **Gallery** - Photo gallery with lightbox/masonry display
- **Contact Page** - Contact form with smart enquiry system, Google Maps embed
- **Floating Buttons** - Always-visible WhatsApp & phone quick-contact buttons
- **SEO Optimized** - Per-page meta tags, Open Graph support

### 🔐 Admin Panel (`/admin`)

- **Dashboard** - At-a-glance statistics for all content
- **Doctors Management** - Add/edit/delete doctor profiles, drag-to-reorder display order
- **Services CRUD** - Icon picker (30+ health icons), reorder, visibility toggle
- **Blog Management** - Rich content editor, draft/publish, YouTube embed
- **Gallery Manager** - Upload and manage clinic photos
- **Hero Slides** - Configure homepage carousel images
- **Enquiries Dashboard** - Conversation-style lead management with reply via email, IP geolocation, device/browser detection, response analytics
- **Site Content** - Edit every text on the website from one panel with per-page/section organization, toggle visibility, image uploads
- **Navigation Manager** - Dynamically manage navbar/footer links with drag-reorder
- **Site Settings** - General settings, SMTP email config, per-page SEO, database configuration, logo upload, password management
- **Toast Notifications** - Minimalist floating toasts with sound feedback across all admin pages
- **Scroll Animations** - Professional viewport-triggered reveal animations across all public pages
- **Mobile Responsive** - Full admin panel functionality on mobile devices

---

## 🛠 Tech Stack

| Layer         | Technology                                        |
| ------------- | ------------------------------------------------- |
| **Frontend**  | React 19, TypeScript 5.7, Tailwind CSS v4, Vite 6 |
| **Backend**   | Laravel 11, PHP 8.3                               |
| **Database**  | MySQL 8                                           |
| **Hosting**   | Hostinger Shared Hosting                          |
| **API Style** | RESTful JSON API with session-based auth          |

---

## 📁 Project Structure

```
rohithealthcare/
├── src/                        # React frontend
│   ├── components/             # Reusable UI components
│   │   ├── Toast.tsx           # Global toast notification system
│   │   ├── Navbar.tsx          # Public navigation bar
│   │   ├── Footer.tsx          # Public footer
│   │   ├── HeroSlider.tsx      # Homepage hero carousel
│   │   ├── FloatingButtons.tsx # WhatsApp & phone buttons
│   │   ├── ContactForm.tsx     # Enquiry form
│   │   ├── DoctorCard.tsx      # Doctor profile card
│   │   ├── GalleryGrid.tsx     # Photo gallery grid
│   │   └── ...
│   ├── pages/                  # Page components
│   │   ├── HomePage.tsx        # Landing page
│   │   ├── AboutPage.tsx       # About us
│   │   ├── ServicesPage.tsx    # Services listing
│   │   ├── DoctorsPage.tsx     # Doctors listing
│   │   ├── BlogsPage.tsx       # Blog index
│   │   ├── BlogPostPage.tsx    # Individual blog post
│   │   ├── GalleryPage.tsx     # Photo gallery
│   │   ├── ContactPage.tsx     # Contact page
│   │   └── admin/              # Admin panel pages
│   │       ├── AdminDashboardPage.tsx
│   │       ├── AdminDoctorsPage.tsx
│   │       ├── AdminServicesPage.tsx
│   │       ├── AdminBlogsPage.tsx
│   │       ├── AdminGalleryPage.tsx
│   │       ├── AdminContentPage.tsx
│   │       ├── AdminSettingsPage.tsx
│   │       ├── AdminEnquiriesPage.tsx
│   │       ├── AdminNavLinksPage.tsx
│   │       └── AdminHeroPage.tsx
│   ├── hooks/                  # Custom React hooks
│   │   ├── useContent.ts       # Site content accessor
│   │   ├── useSEO.ts           # Per-page meta tag manager
│   │   └── useScrollReveal.ts  # IntersectionObserver scroll animations
│   ├── services/               # API client & content config
│   ├── App.tsx                 # Root component with routing
│   ├── main.tsx                # Entry point
│   └── globals.css             # Global styles
├── backend/                    # Laravel API
│   ├── app/
│   │   ├── Models/             # Eloquent models
│   │   ├── Http/
│   │   │   ├── Controllers/Api/  # API controllers
│   │   │   └── Middleware/       # Auth middleware
│   │   └── Providers/
│   ├── database/
│   │   ├── migrations/         # Database schema
│   │   └── seeders/            # Data seeders
│   ├── routes/api.php          # API route definitions
│   └── config/                 # Laravel configuration
├── public/                     # Static assets & uploads
├── dist/                       # Production build output
├── index.html                  # SPA entry point
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS configuration
└── package.json                # Node.js dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ & npm
- **PHP** 8.3+ with extensions: `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`
- **Composer** 2.x
- **MySQL** 8.0+

### 1. Clone the Repository

```bash
git clone https://github.com/MrAkshay143/rohithealthcare.git
cd rohithealthcare
```

### 2. Frontend Setup

```bash
npm install
cp .env.example .env  # Configure VITE_BACKEND_ORIGIN as needed
npm run dev          # Start dev server at http://localhost:5173
```

### 3. Backend Setup

```bash
cd backend
composer install
cp .env.example .env  # Configure your local DB credentials here
php artisan key:generate
```

Configure your `.env` file with database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=rohit_healthcare
DB_USERNAME=root
DB_PASSWORD=your_password
```

Then run migrations and seed data:

```bash
php artisan migrate --seed
php artisan serve    # Start API server at http://localhost:8000
```

### 4. Build for Production

```bash
npx vite build       # Outputs to dist/
```

---

## 🚢 Deployment

The project is structured to be hosted on any modern environment including Virtual Private Servers (AWS, DigitalOcean), managed hosting (Hostinger, cPanel), or decentralized CDNs (Vercel, Netlify) for the frontend alongside a dedicated backend. Must require **PHP 8.3+**.

### Option A: Shared Hosting / cPanel / Hostinger (via SSH)

Deploying to a shared hosting environment via SSH simplifies updates and minimizes FTP overhead.

**1. Build Local Assets:**
Compile the React code into static files:

```bash
npm run build
```

**2. Upload via SCP (SSH File Copy):**
Use `scp` to securely copy your compiled `dist` directory and backend files to your remote server. Ensure you have the SSH port (`-P 65002` for Hostinger, standard `-p 22` for typical Linux servers).

_Upload Frontend Assets:_

```bash
scp -P 65002 -r dist/assets/* u_your_user@your_ip:domains/yourdomain.com/public_html/assets/
scp -P 65002 dist/index.html u_your_user@your_ip:domains/yourdomain.com/public_html/
```

_Upload Backend API Code:_

```bash
scp -P 65002 -r backend/app/* backend/routes/* backend/database/* u_your_user@your_ip:domains/yourdomain.com/public_html/backend/
```

**3. Run Remote Migrations via SSH:**
Execute artisan commands dynamically without leaving your terminal by piping them through ssh:

```bash
ssh -p 65002 u_your_user@your_ip "cd domains/yourdomain.com/public_html/backend && /opt/alt/php83/usr/bin/php artisan migrate"
```

### Option B: Cloud Architecture (Vercel Frontend + AWS Backend)

1. **Frontend (Vercel):** Create a new Vercel project, link the GitHub repository, set the Root Directory to the base folder (or `src`), and configure the Vercel branch environment variable `VITE_BACKEND_ORIGIN` to point toward your deployed API endpoint.
2. **Backend (AWS EC2 / DigitalOcean):** Clone the repository onto your Ubuntu server, install PHP 8.3+, Nginx/Apache, Composer, and MySQL. Configure your `backend/.env` with production RDS/MySQL credentials, run `php artisan migrate`, and expose the Laravel entry point `/public` to the web server routing.

## 📡 API Overview

All API endpoints are prefixed with `/api`. Authentication uses session-based cookies.

### Public Endpoints

| Method | Endpoint       | Description               |
| ------ | -------------- | ------------------------- |
| GET    | `/doctors`     | List all doctors          |
| GET    | `/blogs`       | List blog posts           |
| GET    | `/gallery`     | List gallery photos       |
| GET    | `/hero-slides` | List hero carousel slides |
| GET    | `/content`     | Get site content          |
| GET    | `/settings`    | Get site settings         |
| GET    | `/services`    | List active services      |
| POST   | `/enquiries`   | Submit contact enquiry    |
| POST   | `/auth/login`  | Admin login               |

### Admin Endpoints (Authenticated)

| Method | Endpoint                   | Description              |
| ------ | -------------------------- | ------------------------ |
| POST   | `/doctors`                 | Create doctor            |
| PUT    | `/doctors/{id}`            | Update doctor            |
| DELETE | `/doctors/{id}`            | Delete doctor            |
| POST   | `/doctors/reorder`         | Reorder doctors          |
| POST   | `/services`                | Create service           |
| PUT    | `/services/{id}`           | Update service           |
| DELETE | `/services/{id}`           | Delete service           |
| POST   | `/services/reorder`        | Reorder services         |
| POST   | `/blogs`                   | Create blog post         |
| PUT    | `/blogs/{id}`              | Update blog post         |
| DELETE | `/blogs/{id}`              | Delete blog post         |
| POST   | `/content/bulk`            | Bulk update site content |
| POST   | `/settings`                | Update setting           |
| POST   | `/upload`                  | Upload image file        |
| GET    | `/enquiries`               | List all enquiries       |
| POST   | `/enquiries/{id}/messages` | Reply to enquiry         |

---

## 🎨 Design Highlights

- **Mobile-first** responsive design throughout public and admin pages
- **Consistent admin UI** with gradient icon badges, search/filter, collapsible forms
- **Toast notifications** with Web Audio API sound effects (success chirp, error tone)
- **Drag-and-drop** reordering for doctors, services, and navigation links
- **Dark header** with transparent-to-solid scroll transition
- **Scroll-reveal animations** – professional viewport-triggered fade/slide animations on all public pages using IntersectionObserver (only once per element, staggered per section)

---

## 🔐 Admin Panel — Full User Guide

Access the admin panel at `/admin/login`. Default credentials are set during seeding.

---

### 🖥️ Dashboard

**URL:** `/admin`

The overview page showing live statistics at a glance.

| Stat Card | Description |
|---|---|
| New Enquiries | Unread/unanswered contact leads (pulsing badge) |
| Doctors | Total doctor profiles in the system |
| Blog Posts | Total published + draft posts |
| Gallery Photos | Total uploaded gallery images |
| Hero Slides | Carousel images on the homepage |
| Customer Leads | Total enquiry submissions ever |

**Quick Actions** link directly to: Publish Blog, Add Gallery Photos, Manage Doctors, Manage Hero Slides, Edit Site Text, Change Password.

---

### 👨‍⚕️ Doctors Management

**URL:** `/admin/doctors`

Manage all doctor profiles displayed on the Doctors page and Homepage team section.

#### Form Fields

| Field | Type | Notes |
|---|---|---|
| Full Name | Text | Required |
| Specialty | Text | e.g. "Cardiologist", "Pathologist" |
| Qualifications | Text | e.g. "MBBS, MD, DM" |
| Doctor Photo | Image Upload | Optional — shows initials if blank |

#### Features
- **Drag-and-drop reorder** — grab the handle icon to change display order
- **Up/Down arrow buttons** — keyboard-friendly reordering
- **Search bar** — filter by name, specialty, or qualifications
- **Edit/Delete** — inline with confirmation dialog on delete
- **Auto-initials avatar** — if no photo uploaded, shows initials in a styled circle
- Doctor count badge visible in page header

---

### 🧪 Services Management

**URL:** `/admin/services`

Manage the diagnostic services shown on the Services page and Homepage.

#### Form Fields

| Field | Type | Notes |
|---|---|---|
| Title | Text | Required |
| Icon | Icon Picker | Grid of 30+ health-themed icons |
| Description | Textarea | Shown under icon on cards |
| Visible on Website | Checkbox | Toggle public visibility |

#### Available Icons
`Activity`, `Droplet`, `TestTube`, `Microscope`, `HeartPulse`, `Stethoscope`, `Heart`, `Brain`, `Bone`, `Baby`, `Pill`, `Syringe`, `Thermometer`, `Scan`, `Cross`, `ShieldPlus`, `Zap`, `Ear`, `Eye`, `Dna`, `Radiation`, `Bandage`, `CircleDot`, `Sparkles`, `Waves`, `Flame`, `Wind`, `Gauge`, `Beaker`, `Briefcase`

#### Features
- **Icon picker** — visual dropdown grid to select from 30+ health icons
- **Visibility toggle** — eye icon to show/hide without deleting
- **Drag reorder** — Up/Down arrows to change display order
- 6 rotating color themes auto-assigned to cards
- Hidden services shown at reduced opacity

---

### 📝 Blog & News Management

**URL:** `/admin/blogs`

Manage news updates, health camp announcements, and YouTube video posts.

#### Form Fields

| Field | Type | Notes |
|---|---|---|
| Post Title | Text | Required |
| YouTube Video URL | Text | Optional — auto-detects video ID |
| Content / Description | Textarea | Required |
| Cover Image | Image Upload | Auto-filled from YouTube thumbnail |
| Save as Draft | Toggle | Draft = hidden from public |

#### Features
- **YouTube integration** — paste any YouTube URL; video ID is auto-detected, thumbnail auto-populates as cover image
- **Draft/Publish toggle** — save without making public
- **Filter tabs** — All / Published / Drafts
- **Search** — live filter by title or content
- Blog slug (URL path) auto-generated from title
- Date shown in locale format
- Video posts display a YouTube badge on the card

---

### 🖼️ Gallery Management

**URL:** `/admin/gallery`

Manage photos displayed on the Gallery page with lightbox support.

#### Form Fields

| Field | Type | Notes |
|---|---|---|
| Image Title | Text | Required — shown as caption |
| Photo | Image Upload | Required |

#### Features
- Responsive grid (2 → 3 → 4 → 5 columns by screen size)
- Hover zoom preview
- Edit state highlighted with colored ring
- Photo count badge

---

### 🎠 Hero Slides Management

**URL:** `/admin/hero`

Manage the carousel images on the Homepage hero section.

#### Form Fields

| Field | Type | Notes |
|---|---|---|
| Slide Image | Image Upload | Required — use landscape/wide images |
| Alt Text | Text | Optional — screen reader description |
| Order | Number | Optional — lower = shown first |

#### Features
- 16:9 aspect ratio preview cards
- Slide number badge (#1, #2 …)
- Edit/Delete with confirmation
- Tips panel about recommended image dimensions

---

### 📬 Enquiries & Lead Management

**URL:** `/admin/enquiries`

Full CRM-style lead management with conversation threading.

#### Layout
- **Left panel** — scrollable list of all enquiries with status badges
- **Right panel** — conversation view with reply area

#### Status Types

| Status | Colour | Meaning |
|---|---|---|
| New | Blue pulse | Just submitted, not yet read |
| Read | Gray | Opened/viewed |
| Replied | Green | Admin has responded |

#### Per-Enquiry Details Captured
- Name, phone, email, message
- IP address, city, region, country
- Browser name, device type (Mobile/Desktop/Tablet)
- Submission timestamp

#### Reply Features
- Type reply in textarea (Shift+Enter for new line)
- **Send via Email checkbox** — optionally email the reply to the visitor
- Each message shows sent-via-email indicator
- Auto-scroll to latest message

#### Quick Contact Buttons
- **WhatsApp** — opens WhatsApp chat to the enquirer's phone
- **Call** — direct phone call link

#### Analytics Dashboard (toggle-able)
- Total enquiries, new/read/replied counts
- Response rate %
- Average response time
- 7-day enquiry bar chart
- Top locations breakdown (horizontal chart)

#### Filters & Search
- Filter: All / New / Read / Replied
- Search: by name, phone, email, or message content

---

### ✏️ Site Content Editor

**URL:** `/admin/content`

Edit **every text, image, and toggle** on the public website — no code needed.

#### Page Groups

| Tab | Sections Inside |
|---|---|
| **General** | General, Navbar, Footer, Floating Buttons |
| **Home Page** | Hero, Stats Strip, Services, Why Us, Team, Blog, CTA |
| **About Page** | About Page, Highlights, Why Us block |
| **Services** | Services Page header, Services CTA |
| **Doctors** | Doctors Page header, Doctor Card labels |
| **Contact** | Contact Info, Contact Page header, Contact Form labels |
| **Blogs** | Blogs Page header, empty state text |
| **Gallery** | Gallery Page header, empty state text |
| **NotFound** | 404 error page text |

#### Field Types

| Type | Description |
|---|---|
| Text | Single-line text (titles, labels, badges) |
| Textarea | Multi-line text (descriptions, body copy) |
| Image | URL + upload button for photos |
| Pill | Comma-separated list items (shown as tag previews) |
| Toggle | Desktop/Mobile visibility switch per field |

#### Features
- **Split-panel layout** — left table-of-contents, right scrollable form
- **Scroll spy** — TOC highlights active section as you scroll
- **Desktop/Mobile toggles** — control which fields appear on each screen size
- **Bulk save** — one Save button commits all changes at once
- **Reset All** — revert all content to factory defaults (with countdown confirmation)
- Image fields show live preview and upload button

---

### 🔗 Navigation Manager

**URL:** `/admin/nav-links`

Manage navbar and footer links dynamically without touching code.

#### Tabs
- **Navbar** — links shown in the top navigation bar
- **Footer** — links shown in the website footer

#### Form Fields

| Field | Type | Notes |
|---|---|---|
| Link Label | Text | Required — display text |
| URL / Path | Text | Required — e.g. `/about` or `https://…` |
| Visible on Site | Toggle | Show/hide without deleting |
| Open in New Tab | Toggle | Adds `target="_blank"` |
| Show on Desktop | Toggle | Navbar only |
| Show on Mobile | Toggle | Navbar only |

#### Features
- **Drag-and-drop reorder** with grip handle
- **Up/Down arrow** buttons for keyboard reorder
- **Inline delete confirmation** — confirms before removing
- Visibility badges on card (Hidden, Desktop only, Mobile only)
- "Opens in new tab" indicator badge
- Tab count badges showing total links per section

---

### ⚙️ Settings

**URL:** `/admin/settings`

Four-tab configuration panel for global site settings.

---

#### Tab 1 — General

| Field | Description |
|---|---|
| Site Name | Used in browser tab titles and meta tags |
| Website URL | Canonical domain (e.g. `https://rhc.imakshay.in`) |
| Google Maps Embed URL | iframe src for the map on Contact page |
| Logo | Upload clinic logo (shown in Navbar & Footer) |
| Change Password | Current password → New password → Confirm |

---

#### Tab 2 — Email (SMTP)

Configure outgoing email for enquiry reply notifications.

| Field | Description |
|---|---|
| SMTP Host | Mail server hostname (e.g. `smtp.gmail.com`) |
| SMTP Port | Usually `587` (TLS) or `465` (SSL) |
| SMTP Username | Email account username |
| SMTP Password | Email account password or app password |
| From Name | Sender display name (e.g. "Rohit Health Care") |

---

#### Tab 3 — SEO

Per-page SEO metadata + global social/analytics settings.

**Page tabs:** Home, About, Services, Doctors, Contact, Blogs, Gallery, 404, Global

| Field | Limit | Description |
|---|---|---|
| Meta Title | 60 chars | Browser tab title + Google result title |
| Meta Description | 160 chars | Google search result snippet |
| Meta Keywords | — | Comma-separated keywords |
| Social Share Image | — | OG image URL for WhatsApp/Facebook previews |
| Google Analytics ID | — | Format: `G-XXXXXXXXXX` |

- **Live SERP preview** — see exactly how the page appears in Google search results as you type
- Character count indicators turn red when limit exceeded

---

#### Tab 4 — Database

> ⚠️ **Warning:** Changing database settings requires a server restart to take effect.

| Field | Description |
|---|---|
| Connection Driver | MySQL, SQLite, or PostgreSQL |
| DB Host | Database server hostname |
| DB Port | Usually `3306` for MySQL |
| DB Database | Database/schema name |
| DB Username | Database user |
| DB Password | Database password |

---

### 🔑 Login Page

**URL:** `/admin/login`

| Field | Type |
|---|---|
| Username | Text |
| Password | Password |

- Shows error messages for invalid credentials
- Redirects to `/admin` on success
- Split-screen branding layout on desktop

---

### 🔔 Toast Notifications

All admin actions trigger floating toast notifications:

| Type | Colour | Sound |
|---|---|---|
| Success | Green | Short chirp |
| Error | Red | Low error tone |
| Warning | Amber | — |
| Info | Blue | — |

Toasts auto-dismiss after a few seconds and stack if multiple fire simultaneously.

---

---

## 📄 License

This project is proprietary software. See [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with care for the community.**

</div>

---

<div align="center">

**Developed by Akshay Mondal**  
📧 [contact@imakshay.in](mailto:contact@imakshay.in)  
🌐 [www.imakshay.in](https://www.imakshay.in)

</div>
