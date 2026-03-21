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

## � Deployment (Hostinger / SSH)

Deploying to a shared hosting environment (like Hostinger) via SSH simplifies updates and minimizes FTP overhead.

### 1. Build Local Assets

Compile the React code into static files:

```bash
npm run build
```

### 2. Upload via SCP (SSH File Copy)

Use `scp` to securely copy your compiled `dist` directory and backend files to your remote server. Ensure you have the SSH port (`-P 65002` for Hostinger) and user details handy.

**Upload Frontend Assets:**

```bash
scp -P 65002 -r dist/assets/* u_your_user@your_ip:domains/rhc.imakshay.in/public_html/assets/
scp -P 65002 dist/index.html u_your_user@your_ip:domains/rhc.imakshay.in/public_html/
```

**Upload Backend API Code:**

```bash
scp -P 65002 -r backend/app/* backend/routes/* backend/database/* u_your_user@your_ip:domains/rhc.imakshay.in/public_html/backend/
```

### 3. Run Remote Migrations via SSH

Execute artisan commands dynamically without leaving your terminal by piping them through ssh:

```bash
ssh -p 65002 u_your_user@your_ip "cd domains/rhc.imakshay.in/public_html/backend && /opt/alt/php83/usr/bin/php artisan migrate"
```

_Note: You may need to replace `/opt/alt/php83/usr/bin/php` with your specific hosting provider's PHP executable path if the default `php` falls back to an older version._

---

## �📡 API Overview

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
- **Smooth animations** including hero slider, page transitions, and micro-interactions

---

## 📄 License

This project is proprietary software. See [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ❤️ for Rohit Health Care**

</div>

---

Built with care for the community.
