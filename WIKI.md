# Rohit Health Care - Project Wiki

Welcome to the official documentation for the Rohit Health Care website. This project is a modern, full-stack healthcare platform designed for clinics and diagnostic centers.

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Local Development](#local-development)
4. [Deployment Guide](#deployment-guide)
5. [Admin Panel Guide](#admin-panel-guide)
6. [Multidomain Support](#multidomain-support)
7. [Database Structure](#database-structure)

---

## 🏥 Project Overview
Rohit Health Care is a comprehensive web solution featuring:
- **Dynamic Content**: All pages (About, Services, Doctors, Blogs) are managed via an admin panel.
- **AI Chatbot**: Integrated OpenRouter-powered medical assistant.
- **Booking/Inquiry System**: Real-time WhatsApp and email notifications for patient inquiries.
- **Multidomain Capabilities**: Support for multiple domains (e.g., .com and .in) sharing a single backend.

## 🛠 Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend**: Laravel 11+ (PHP), MariaDB/MySQL.
- **Deployment**: Custom automated SSH/SFTP workflow.
- **AI**: OpenRouter (LLM integration).

## 💻 Local Development

### Prerequisites
- Node.js 18+
- PHP 8.2+ & Composer
- MySQL/MariaDB

### Setup Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/USER/rohithealthcare.git
   cd rohithealthcare
   ```
2. **Frontend Setup**:
   ```bash
   npm install
   npm run dev
   ```
3. **Backend Setup**:
   ```bash
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate --seed
   php artisan serve
   ```

## 🚀 Deployment Guide
The project uses an automated deployment workflow.

### Configuration
Update the SSH/SFTP credentials in the deployment configuration.

### Selection
The deployment process handles:
1. Building the frontend.
2. Synchronizing files to the server.
3. Clearing application caches.
4. Preserving essential storage and environment files.

## 🔑 Admin Panel Guide
Access the admin panel at `/admin` (or `/backend/public/admin` depending on routing).

**Default Credentials**:
- **Username**: `admin`
- **Password**: `YourSetPassword` (Refer to internal documentation)

### Key Features:
- **Settings**: Manage site domain, metadata, and logo.
- **Content**: Update every piece of text on the website without coding.
- **AI Chatbot**: Configure AI providers (Groq, OpenAI, Gemini, OpenRouter).
- **Enquiries**: View and manage patient inquiries received through the contact forms.

## 🌐 Multidomain Support
This project supports multiple domains pointing to the same backend.
1. Add the additional domain in the **Admin Settings > Allowed Domains** field (comma-separated).
2. The system will automatically update the server's `.env` to allow CORS and Sanctum sessions for those domains.
3. Ensure the hosting provider points both domains to the same `public_html` folder.

## 🗄 Database Structure
Core tables include:
- `site_contents`: Key-value pairs for page text.
- `site_settings`: Global configuration (domain, API keys, etc.).
- `doctors`: Profiles and specialties.
- `services`: Diagnostic test categories.
- `blogs`: News and health camp updates.
- `enquiries`: Patient contact records.

---

For further assistance, please contact the development team or refer to the `SECURITY.md` for vulnerability reports.
