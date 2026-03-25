# Rohit Health Care (RHC) — Full-Stack Website

> A fully dynamic, production-ready healthcare website with an AI-powered chatbot, comprehensive admin panel, and modern responsive frontend.

🌐 **Live:** [https://rohithealthcare.com](https://rohithealthcare.com)
🔧 **Admin:** [https://rohithealthcare.com/admin](https://rohithealthcare.com/admin)

📖 **Documentation:** [Wiki](WIKI.md) | [Security Policy](SECURITY.md)

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| Backend | Laravel 11 (PHP 8.2) |
| Database | MySQL via Supabase |
| AI Chatbot | Groq / OpenAI / Gemini / HuggingFace / Custom API |
| Icons | Lucide React |
| Maps | Google Maps Embed |
| Deployment | Custom deploy script (SFTP/SSH) |

---

## 📁 Project Structure

```
new-version/
├── src/                        # React frontend
│   ├── components/             # Shared UI components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── FloatingButtons.tsx # WhatsApp / Phone / AI Chatbot
│   │   ├── PublicLayout.tsx
│   │   └── ...
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── ServicesPage.tsx
│   │   ├── DoctorsPage.tsx
│   │   ├── BlogsPage.tsx
│   │   ├── BlogPostPage.tsx
│   │   ├── GalleryPage.tsx
│   │   ├── ContactPage.tsx
│   │   └── admin/              # Admin panel pages
│   │       ├── AdminLoginPage.tsx
│   │       ├── AdminDashboardPage.tsx
│   │       ├── AdminSettingsPage.tsx   # General / Email / SEO / AI Chatbot tabs
│   │       ├── AdminContentPage.tsx
│   │       ├── AdminHeroPage.tsx
│   │       ├── AdminServicesPage.tsx
│   │       ├── AdminDoctorsPage.tsx
│   │       ├── AdminBlogsPage.tsx
│   │       ├── AdminGalleryPage.tsx
│   │       └── AdminEnquiriesPage.tsx
│   ├── hooks/
│   │   ├── useContent.ts       # Dynamic site content from DB
│   │   ├── useScrollReveal.ts
│   │   └── useSEO.ts
│   └── services/
│       ├── api.ts              # Centralised API client
│       └── content.ts          # Content helper utilities
│
└── backend/                    # Laravel API
    ├── app/Http/Controllers/Api/
    │   ├── AuthController.php
    │   ├── BlogController.php
    │   ├── ChatController.php      # AI Chatbot backend
    │   ├── ContentController.php
    │   ├── DashboardController.php
    │   ├── DoctorController.php
    │   ├── EnquiryController.php
    │   ├── GalleryController.php
    │   ├── HeroSlideController.php
    │   ├── HomeBundleController.php
    │   ├── NavLinkController.php
    │   ├── ServiceController.php
    │   ├── SettingController.php
    │   └── UploadController.php
    └── routes/
        └── api.php
```

---

## 🚀 Features

### 🌐 Public Website

#### Pages
| Page | Description |
|---|---|
| **Home** | Hero slider, Services, Doctors, Stats, Blogs, CTA |
| **About** | Clinic story, values, team overview |
| **Services** | Dynamic service cards with descriptions & icons |
| **Our Team** | Doctor profiles with specialization & images |
| **Blog** | Post listing with category filters |
| **Blog Post** | Full rich-text post page with related posts |
| **Gallery** | Responsive photo gallery |
| **Contact** | Contact form, map embed, WhatsApp/call links |

#### Global Features
- 100% dynamic content from database (no hardcoded text)
- Per-page SEO meta tags (title, description, keywords, OG image)
- Responsive design (mobile, tablet, desktop)
- Smooth scroll-reveal animations
- Google Analytics integration (configurable from admin)
- Dynamic Navbar with configurable links and logo
- Footer with contact details, social links, quick links
- Floating CTA buttons (Call + AI Chatbot)
- WhatsApp button (shown only when AI chatbot is disabled)

---

### 🤖 AI Chatbot

An intelligent, context-aware floating chat assistant integrated into every public page.

#### Features
- Floating chat launcher button (replaces WhatsApp in the button stack when enabled)
- Near-full-screen on mobile, compact panel on desktop/tablet
- Quick action chips for common queries
- Typing indicator with animated dots
- Unread message badge on launcher
- Reset / new conversation button
- Error state with direct call link fallback
- 800-character input limit

#### Supported AI Providers
| Provider | Notes |
|---|---|
| **Groq** | Free tier, llama/Gemma models, very fast |
| **OpenAI** | GPT-4o-mini and other models |
| **Google Gemini** | gemini-1.5-flash and other models |
| **HuggingFace** | Any text-generation model, supports dedicated endpoints |
| **Custom / Self-hosted** | Any OpenAI-compatible `/v1/chat/completions` endpoint (Ollama, LM Studio, Together AI, Mistral, Anyscale etc.) |

#### Dynamic Context
The system prompt is automatically enriched with:
- Clinic name, tagline, address, phone numbers
- Opening hours
- All services (name + description)
- All doctors (name + specialization)
- Active blog post titles
- Page links for navigation suggestions

#### Admin Configuration
- Enable / disable the chatbot widget
- Select AI provider and model
- Paste API key (stored securely, never exposed to browser)
- Set custom endpoint URL (for HuggingFace dedicated endpoints or self-hosted APIs)
- Configure bot display name
- Set accent color
- Customise welcome message and input placeholder text
- Override the system prompt (advanced)

---

### 🛠️ Admin Panel

Accessible at `/admin` — protected with email/password login.

#### Tabs & Modules

| Module | Features |
|---|---|
| **Dashboard** | Stats: Enquiries, Doctors, Services, Blogs, Gallery |
| **Hero Slides** | Add/edit/delete/reorder carousel slides with images |
| **Site Content** | Edit all page text, phone numbers, social links, hours, maps |
| **Services** | Full CRUD with icons and descriptions |
| **Doctors** | Full CRUD with profile images, specialization, order |
| **Blogs** | Rich text editor, categories, featured image, slug, SEO |
| **Gallery** | Image upload and management |
| **Enquiries** | View all contact form submissions, mark as read |
| **Settings → General** | Site name, logo, domain, social links, analytics ID |
| **Settings → Email** | SMTP configuration for contact form emails |
| **Settings → SEO** | Per-page meta title, description, keywords + OG image |
| **Settings → AI Chatbot** | Full chatbot configuration (provider, keys, identity, prompt) |

---

## 🔌 API Reference

### Public Endpoints
```
GET  /api/home-bundle          # Homepage data bundle (hero, services, doctors, blogs)
GET  /api/services             # All services
GET  /api/doctors              # All doctors
GET  /api/blogs                # Blog list
GET  /api/blogs/{slug}         # Single blog post
GET  /api/gallery              # Gallery images
GET  /api/content/public       # All public site content settings
GET  /api/nav-links            # Navigation links
GET  /api/chatbot/config       # Chatbot public config (name, color, welcome msg)
POST /api/chatbot/chat         # Send message to AI chatbot
POST /api/enquiry              # Submit contact form
```

### Admin Endpoints (JWT protected)
```
POST /api/auth/login           # Admin login
POST /api/auth/logout          # Logout
GET  /api/settings             # Get all settings
POST /api/settings             # Save settings
... (full CRUD for all resources)
```

---

## ⚙️ Environment Setup

### Frontend (.env)
```env
VITE_API_BASE_URL=https://your-production-url.com/backend/public
```

### Backend (backend/.env)
```env
APP_NAME="Rohit Health Care"
APP_URL=https://your-production-url.com/backend/public
DB_CONNECTION=mysql
DB_HOST=...
DB_DATABASE=...
DB_USERNAME=...
DB_PASSWORD=...
```

---

## 🏗️ Local Development

```bash
# Install frontend dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:5173

# Build for production
npm run build

# Backend — install PHP dependencies
cd backend
composer install

# Run migrations
php artisan migrate
```

---

## 🚢 Deployment

The project includes an automated production deployment workflow (SFTP/SSH).

**Key Steps:**
1. Builds the React frontend.
2. Synchronizes data to the server.
3. Preserves server-side storage and environment settings.
4. Clears application caches for immediate updates.

---

## 🗄️ Database Tables

| Table | Purpose |
|---|---|
| `site_settings` | All key-value site settings (content, SMTP, SEO, chatbot config) |
| `hero_slides` | Homepage carousel slides |
| `services` | Clinic services |
| `doctors` | Doctor profiles |
| `blogs` | Blog posts |
| `gallery_items` | Gallery images |
| `enquiries` | Contact form submissions |
| `nav_links` | Navbar navigation links |
| `users` | Admin users |

---

## 🔒 Security

- Admin routes protected by Laravel Sanctum JWT tokens
- API keys stored server-side only (never sent to frontend)
- CORS configured for production domain only
- File uploads validated by type and size
- Rate limiting on enquiry and chatbot endpoints

---

## 📱 Responsive Breakpoints

| Breakpoint | Target |
|---|---|
| `< 640px` (mobile) | Single-column layouts, full-screen chatbot |
| `640–1024px` (tablet) | 2-column layouts, medium chat panel |
| `> 1024px` (desktop) | Full multi-column layout, compact floating chat |

---

## 📄 License

Private project — Rohit Health Care. All rights reserved.
