# Rohit Health Care — Project Analysis Report
> Generated: 2026-03-23 | Analysed by: Antigravity AI

---

## 🐛 BUGS (Fixed in this session)

### 1. Admin Login — 401 Unauthorized on All Protected Routes ✅ FIXED
- **Root cause:** `AuthController::login()` set `admin_session` cookie to literal `"true"` instead of a secure session token. `AdminAuth` middleware expected a SHA-256 hashed token in the `session_token` DB column, which was never populated.
- **Fix:** Login now generates a 64-char random token (`Str::random(64)`), stores SHA-256 hash in DB, and raw token in cookie.
- **Files:** `AuthController.php`, `AdminAuth.php`, `AdminUser.php`

### 2. `/api/doctors` and `/api/blogs` — HTTP 500 Error ✅ FIXED
- **Root cause:** Subtle PHP null bug — `$request->query('orderDir')` returns `null` when not present in URL; `null` was passed to `orderBy()` causing `InvalidArgumentException: Order direction must be "asc" or "desc"`.
- **Fix:** `$orderDir = in_array($raw = strtolower($request->query('orderDir', 'asc')), ['asc', 'desc']) ? $raw : 'asc';`
- **Files:** `DoctorController.php`, `BlogController.php`

### 3. Homepage and All Pages Showing Default/Hardcoded Content ✅ FIXED
- **Root cause:** `HomeBundleController` did not include `content` or `settings` in its API response. `getHomeBundle()` on the frontend received `raw.content = undefined → {}` → all pages fell back to hardcoded TS defaults.
- **Fix:** `HomeBundleController` now fetches `SiteContent` and `SiteSetting` tables, merges them, and returns `content` key in the bundle.
- **Files:** `HomeBundleController.php`, `content.ts` (CONTENT_DEFAULTS updated to match DB)

### 4. Hardcoded Web.php Redirect URL ✅ FIXED
- **Root cause:** Laravel fallback route redirected to hardcoded `https://rhc.imakshay.in`.
- **Fix:** Now reads `site_domain` from `site_settings` table, falls back to `FRONTEND_URL` env variable.

---

## 🎨 DESIGN / UI IMPROVEMENTS (Done)

### 5. Brand Color Updated to `#4e66b3` (Blue)
- All 27 source files updated via batch replace.
- Old hardcoded hex values (`#015851`, `#013f39`, `#012e28`, `#014d43`, `#017a6a`, `#018a7e`) replaced.
- CSS variables in `globals.css` updated.

### 6. About Page Hero Matched to Other Pages
- About page used a custom dark `#012e28` bg with teal glows.
- Now uses same `bg-brand-green` with `opacity-10` medical photo overlay as Services/Doctors/Gallery/Blogs pages.

---

## ⚠️ REMAINING ISSUES / NEEDS IMPROVEMENT

### HIGH PRIORITY

#### A. Doctor Profile Images — Placeholder for Most Doctors
- Only 1 of 12 doctors has an uploaded image. The rest show initial-avatars.
- **Action needed:** Upload real doctor photos via Admin Panel → Doctors → Edit.

#### B. `stat_3_value` Not Read in HomePage
- The stats strip hardcodes `content['years_experience']` for stat 3 but the DB key is `stat_3_value`.
- If `stat_3_value` is `5+` in DB and `years_experience` is also `5+`, it works coincidentally — but they can diverge.
- **Action needed:** Audit `HomePage.tsx` stats rendering and standardise to `stat_3_value`.

#### C. Hero Slides — Background Still Shows Old Teal
- The hero slider background gradient uses inline Tailwind classes on the `<section>` element that still reference the old gradient formula (`from-[#014d43] via-[#4e66b3]`). While the middle color is now blue, the start/end tones may look inconsistent.
- **Action needed:** Verify hero section gradient looks correct on all screen sizes.

#### D. `home_whyus_image` Uses Unsplash External URL
- The "Why Us" section image is loaded from Unsplash CDN (not self-hosted).
- This is a privacy/GDPR concern and can slow load times.
- **Action needed:** Upload a real clinic photo and update via Admin → Site Content → Home Why Us.

### MEDIUM PRIORITY

#### E. No Loading / Error State on Gallery Page
- `GalleryPage.tsx` has no error handling if the gallery API fails.
- **Action needed:** Add try/catch and an error UI state.

#### F. Blog Post OG Tags Are Generic
- Blog post pages (detail view `/blogs/:slug`) do not set per-post OG image/title meta tags.
- **Action needed:** `BlogPostPage.tsx` should set `og:image`, `og:title`, `og:description` from blog post data via `useSEO` or direct `document.head` manipulation.

#### G. No `robots.txt` or `sitemap.xml`
- The site has no sitemap or robots file.
- **Action needed:** Generate a static `sitemap.xml` or use a Laravel route to serve it dynamically based on blog slugs.

#### H. Admin Password Reset Has No UI
- Changing the admin password is available in Settings but requires knowing the current password.
- If the password is forgotten there is no email-based reset.
- **Action needed:** Add a server-side CLI command or a secure reset mechanism.

#### I. Image Upload — No File Size / Type Validation on Backend
- `ImageUpload.tsx` validates on the frontend only.
- The backend `upload` endpoint should also reject oversized or non-image files.
- **Action needed:** Add `validate(['image' => 'required|image|max:5120'])` to the upload controller.

### LOW PRIORITY

#### J. No Pagination on Blogs Page
- `BlogsPage.tsx` loads all published blogs at once. With many posts this will degrade performance.
- **Action needed:** Implement offset/cursor-based pagination (e.g., 9 posts per page).

#### K. Admin Panel Has No Role/Permission System
- All admin users have full access. There is no concept of roles (e.g., editor vs superadmin).
- **Action needed:** Add a `role` column to `admin_users` and gate destructive actions.

#### L. No CSRF Protection on API Routes
- Laravel API routes (`routes/api.php`) have CSRF disabled (typical for API-first). However the admin cookie-based auth could benefit from an additional CSRF token per request for XSS-CSRF chaining protection.

#### M. `ContactPage.tsx` Bundle is Very Large (96 KB)
- ContactPage is the largest page chunk (96.61 kB). It likely imports a large map component.
- **Action needed:** Lazy-load the Google Map embed iframe only when scrolled into view.

#### N. `CONTENT_DEFAULTS` Drift Over Time
- If the DB content changes (via admin panel), defaults in `content.ts` will become stale again.
- **Long-term solution:** Consider making defaults a seeder-only concern and fetching full content on demand rather than merging with hardcoded fallbacks.

---

## ✅ WHAT'S WORKING WELL

| Feature | Status |
|---|---|
| Admin Login & Session | ✅ Token-based, secure cookies |
| Home Bundle API | ✅ Content + doctors + blogs + services + hero all in 1 request |
| Doctor management (CRUD + reorder) | ✅ Working |
| Blog management (draft/publish) | ✅ Working |
| Gallery management | ✅ Working |
| Hero Slides management | ✅ Working |
| Services management | ✅ Working |
| Site Content editing | ✅ All keys editable |
| SEO per-page metadata | ✅ Via admin Settings → SEO |
| Enquiry form + listing | ✅ Working |
| Floating WhatsApp/Phone buttons | ✅ Clean circles, transparent bg |
| Image uploads | ✅ Working (frontend validated) |
| Auto-cache-invalidation on model save | ✅ Via AppServiceProvider observers |
| 404 redirect on backend URL access | ✅ Via fallback route in web.php |
| Deploy script (`deploy.py`) | ✅ Automated clean deploy |
| Brand color system | ✅ CSS variables + Tailwind tokens |

---

## 📁 KEY FILE LOCATIONS

| Purpose | File |
|---|---|
| Auth controller | `backend/app/Http/Controllers/Api/AuthController.php` |
| Admin middleware | `backend/app/Http/Middleware/AdminAuth.php` |
| Home bundle API | `backend/app/Http/Controllers/Api/HomeBundleController.php` |
| Doctor API | `backend/app/Http/Controllers/Api/DoctorController.php` |
| Content defaults | `src/services/content.ts` |
| Brand colors | `src/globals.css` |
| Deployment script | `deploy.py` |
| DB seeder | `backend/database/seeders/DatabaseSeeder.php` |
