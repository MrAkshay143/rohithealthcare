<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // AdminUser - seeded with hashed password
        DB::table('admin_users')->insertOrIgnore([
            ['id' => 2, 'username' => 'admin', 'password' => Hash::make(env('ADMIN_DEFAULT_PASSWORD', 'ChangeMe@2025'))],
        ]);

        // Team / Consulting Doctors - clears and reseeds on every deployment
        DB::table('doctors')->delete();
        DB::table('doctors')->insert([
            ['name' => 'Dr. K.K. Gupta',             'specialty' => 'General Physician',        'qualifications' => 'MBBS, MD',   'imageUrl' => null, 'order' => 1],
            ['name' => 'Dr. Anwar Jamal',            'specialty' => 'General Physician',        'qualifications' => 'MBBS',       'imageUrl' => null, 'order' => 2],
            ['name' => 'Dr. Arpan Singha',           'specialty' => 'General Physician',        'qualifications' => 'MBBS',       'imageUrl' => null, 'order' => 3],
            ['name' => 'Dr. Anu Priya',              'specialty' => 'General Physician',        'qualifications' => 'MBBS',       'imageUrl' => null, 'order' => 4],
            ['name' => 'Dr. Aniruddha Mandal',       'specialty' => 'General Physician',        'qualifications' => 'MBBS',       'imageUrl' => null, 'order' => 5],
            ['name' => 'Dr. Chandan Seth',           'specialty' => 'General Physician',        'qualifications' => 'MBBS',       'imageUrl' => null, 'order' => 6],
            ['name' => 'Dr. Neha Agarwala',          'specialty' => 'Dietitian & Nutritionist', 'qualifications' => 'BHMS, DDHN', 'imageUrl' => null, 'order' => 7],
            ['name' => 'Dr. Sanjay Mandal',          'specialty' => 'General Physician',        'qualifications' => 'MBBS',       'imageUrl' => null, 'order' => 8],
            ['name' => 'Dr. Sabhyasachi Chatterjee', 'specialty' => 'General Physician',        'qualifications' => 'MBBS',       'imageUrl' => null, 'order' => 9],
            ['name' => 'Dr. Tamajit Chakraborty',    'specialty' => 'General Physician',        'qualifications' => 'MBBS',       'imageUrl' => null, 'order' => 10],
            ['name' => 'Dr. Sandeep Prasad',         'specialty' => 'General Physician',        'qualifications' => 'MBBS',       'imageUrl' => null, 'order' => 11],
        ]);

        // Blogs - exact data from SQLite (IDs preserved)
        $blogs = [
            [
                'id' => 1,
                'slug' => 'free-health-checkup-camp-april-2026',
                'title' => 'Free Health Check-up Camp – 15th April 2026',
                'content' => 'Rohit Health Care is organising a free health check-up camp on 15th April 2026. Services include blood pressure monitoring, blood sugar screening, eye check-up, and BMI assessment. All residents are welcome. No prior appointment needed. Camp will be held from 9 AM to 2 PM at our main centre.',
                'imageUrl' => 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&w=800',
                'draft' => false,
                'createdAt' => '2026-03-17 00:00:00',
            ],
            [
                'id' => 2,
                'slug' => 'world-blood-donor-day-awareness',
                'title' => 'World Blood Donor Day – Awareness & Drive',
                'content' => 'On the occasion of World Blood Donor Day, our team organised a community awareness drive and blood donation camp. Over 120 units of blood were collected, benefiting patients across the region. We thank all volunteers and donors for their selfless contribution.',
                'imageUrl' => 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=800',
                'draft' => false,
                'createdAt' => '2026-03-17 00:00:00',
            ],
            [
                'id' => 3,
                'slug' => 'home-sample-collection-24x7',
                'title' => 'New: Home Sample Collection Now Available 24×7',
                'content' => 'We are delighted to announce that our home sample collection service is now available round-the-clock, 7 days a week. Our trained phlebotomists will arrive at your doorstep at a time of your choosing. Book via WhatsApp or call us directly. Same-day results guaranteed for most tests.',
                'imageUrl' => 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
                'draft' => false,
                'createdAt' => '2026-03-17 00:00:00',
            ],
            [
                'id' => 4,
                'slug' => 'thyroid-awareness-month',
                'title' => 'Thyroid Awareness Month – Get Tested',
                'content' => 'January is Thyroid Awareness Month. Did you know that over 42 million people in India suffer from thyroid disorders? We are offering a 30% discount on TSH, T3, and T4 tests throughout this month. Early detection leads to better outcomes. Book your test today.',
                'imageUrl' => 'https://images.unsplash.com/photo-1579684453423-f84349ef60b0?auto=format&fit=crop&q=80&w=800',
                'draft' => false,
                'createdAt' => '2026-03-17 00:00:00',
            ],
        ];
        foreach ($blogs as $blog) {
            DB::table('blogs')->insertOrIgnore($blog);
        }

        // Gallery - no dummy photos (users can upload from admin panel)
        // Keeping table empty for user-uploaded content

        // HeroSlides - exact data from SQLite (IDs preserved)
        $heroSlides = [
            ['id' => 1, 'imageUrl' => 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200', 'alt' => 'Healthcare professionals at work', 'order' => 1, 'createdAt' => '2026-03-17 00:00:00'],
            ['id' => 2, 'imageUrl' => 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=1200', 'alt' => 'Modern diagnostic laboratory', 'order' => 2, 'createdAt' => '2026-03-17 00:00:00'],
            ['id' => 3, 'imageUrl' => 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&w=1200', 'alt' => 'Patient care and consultation', 'order' => 3, 'createdAt' => '2026-03-17 00:00:00'],
        ];
        foreach ($heroSlides as $slide) {
            DB::table('hero_slides')->insertOrIgnore($slide);
        }

        // ─── SiteContent - all CONTENT_DEFAULTS (insertOrIgnore = safe to re-run) ───
        $siteContent = [
            // General
            ['key' => 'site_name',            'value' => 'Rohit Health Care'],
            ['key' => 'site_tagline',         'value' => 'Precision diagnostics with care you can trust.'],
            ['key' => 'site_logo',            'value' => ''],
            ['key' => 'years_experience',     'value' => '10+'],
            ['key' => 'google_maps_url',      'value' => 'https://maps.app.goo.gl/N5KrFWzKUspjw1YD6'],
            ['key' => 'google_maps_embed',    'value' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14647.23432717014!2d86.2215444!3d23.1027786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f697446700c25d%3A0xe67c1e550c608bfa!2sBalarampur%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1711111111111!5m2!1sen!2sin'],
            // Navbar
            ['key' => 'navbar_logo_desktop',   'value' => 'true'],
            ['key' => 'navbar_logo_mobile',    'value' => 'true'],
            ['key' => 'navbar_cta_label',      'value' => 'Call Now'],
            ['key' => 'navbar_cta_desktop',    'value' => 'true'],
            ['key' => 'navbar_cta_mobile',     'value' => 'true'],
            ['key' => 'navbar_link_1_label',   'value' => 'Home'],
            ['key' => 'navbar_link_1_desktop', 'value' => 'true'],
            ['key' => 'navbar_link_1_mobile',  'value' => 'true'],
            ['key' => 'navbar_link_2_label',   'value' => 'About'],
            ['key' => 'navbar_link_2_desktop', 'value' => 'true'],
            ['key' => 'navbar_link_2_mobile',  'value' => 'true'],
            ['key' => 'navbar_link_3_label',   'value' => 'Our Team'],
            ['key' => 'navbar_link_3_desktop', 'value' => 'true'],
            ['key' => 'navbar_link_3_mobile',  'value' => 'true'],
            ['key' => 'navbar_link_4_label',   'value' => 'Services'],
            ['key' => 'navbar_link_4_desktop', 'value' => 'true'],
            ['key' => 'navbar_link_4_mobile',  'value' => 'true'],
            ['key' => 'navbar_link_5_label',   'value' => 'Gallery'],
            ['key' => 'navbar_link_5_desktop', 'value' => 'true'],
            ['key' => 'navbar_link_5_mobile',  'value' => 'true'],
            ['key' => 'navbar_link_6_label',   'value' => 'News & Camps'],
            ['key' => 'navbar_link_6_desktop', 'value' => 'true'],
            ['key' => 'navbar_link_6_mobile',  'value' => 'true'],
            ['key' => 'navbar_link_7_label',   'value' => 'Contact'],
            ['key' => 'navbar_link_7_desktop', 'value' => 'true'],
            ['key' => 'navbar_link_7_mobile',  'value' => 'true'],
            // Footer
            ['key' => 'footer_tagline',            'value' => 'Your trusted partner for comprehensive medical services, diagnostics, and daycare.'],
            ['key' => 'footer_address_short',      'value' => 'Masjid Road, Balarampur, West Bengal, India'],
            ['key' => 'footer_logo_desktop',       'value' => 'true'],
            ['key' => 'footer_logo_mobile',        'value' => 'true'],
            ['key' => 'footer_quicklinks_heading', 'value' => 'Quick Links'],
            ['key' => 'footer_quicklinks_desktop', 'value' => 'true'],
            ['key' => 'footer_quicklinks_mobile',  'value' => 'true'],
            ['key' => 'footer_link_1_label',       'value' => 'Home'],
            ['key' => 'footer_link_1_visible',     'value' => 'true'],
            ['key' => 'footer_link_2_label',       'value' => 'Medical Team'],
            ['key' => 'footer_link_2_visible',     'value' => 'true'],
            ['key' => 'footer_link_3_label',       'value' => 'Gallery'],
            ['key' => 'footer_link_3_visible',     'value' => 'true'],
            ['key' => 'footer_link_4_label',       'value' => 'News & Camps'],
            ['key' => 'footer_link_4_visible',     'value' => 'true'],
            ['key' => 'footer_link_5_label',       'value' => 'About Us'],
            ['key' => 'footer_link_5_visible',     'value' => 'true'],
            ['key' => 'footer_link_6_label',       'value' => 'Services'],
            ['key' => 'footer_link_6_visible',     'value' => 'true'],
            ['key' => 'footer_link_7_label',       'value' => 'Contact'],
            ['key' => 'footer_link_7_visible',     'value' => 'true'],
            ['key' => 'footer_contact_heading',    'value' => 'Get in Touch'],
            ['key' => 'footer_contact_desktop',    'value' => 'true'],
            ['key' => 'footer_contact_mobile',     'value' => 'true'],
            ['key' => 'footer_call_label',         'value' => 'Call Us'],
            ['key' => 'footer_email_label',        'value' => 'Email'],
            ['key' => 'footer_location_label',     'value' => 'Location'],
            ['key' => 'footer_hours_heading',      'value' => 'Operating Hours'],
            ['key' => 'footer_hours_desktop',      'value' => 'true'],
            ['key' => 'footer_hours_mobile',       'value' => 'true'],
            ['key' => 'footer_social_whatsapp',    'value' => 'true'],
            ['key' => 'footer_social_phone',       'value' => 'true'],
            ['key' => 'footer_copyright',          'value' => 'All rights reserved.'],
            ['key' => 'footer_credit',             'value' => 'Designed with care for the community.'],
            // Floating Buttons
            ['key' => 'floating_whatsapp_visible', 'value' => 'true'],
            ['key' => 'floating_phone_visible',    'value' => 'true'],
            // Hero Section
            ['key' => 'hero_badge',          'value' => 'Associated with Apollo Diagnostics'],
            ['key' => 'hero_heading',        'value' => 'Accurate Diagnostics.'],
            ['key' => 'hero_accent',         'value' => 'Trusted Care.'],
            ['key' => 'hero_subtext',        'value' => 'Your trusted partner for accurate diagnostics and home sample collection. Fast, reliable and right at your doorstep.'],
            ['key' => 'hero_btn_call',       'value' => 'Call Us Now'],
            ['key' => 'hero_btn_directions', 'value' => 'Directions'],
            ['key' => 'hero_pills',          'value' => 'NABL Accredited, Same Day Reports, Home Collection, 10+ Years'],
            // Stats Strip
            ['key' => 'stat_1_value', 'value' => '50,000+'],
            ['key' => 'stat_1_label', 'value' => 'Happy Patients'],
            ['key' => 'stat_2_value', 'value' => '3,000+'],
            ['key' => 'stat_2_label', 'value' => 'Diagnostic Tests'],
            ['key' => 'stat_3_label', 'value' => 'Years of Service'],
            ['key' => 'stat_4_value', 'value' => '100%'],
            ['key' => 'stat_4_label', 'value' => 'Same-Day Reports'],
            // Home Services
            ['key' => 'home_services_badge',   'value' => 'What We Offer'],
            ['key' => 'home_services_heading', 'value' => 'Comprehensive Healthcare Services'],
            ['key' => 'home_services_subtext', 'value' => 'Comprehensive healthcare services delivered through expert consultation, diagnostics, and patient-focused care.'],
            ['key' => 'home_services_visible', 'value' => 'true'],
            ['key' => 'home_services_btn',     'value' => 'View All Services'],
            ['key' => 'home_svc_1_title',      'value' => 'Polyclinic & Doctor Consultation'],
            ['key' => 'home_svc_1_desc',       'value' => 'Experienced physicians and specialist consultants available seven days a week for routine check-ups and expert medical advice.'],
            ['key' => 'home_svc_1_visible',    'value' => 'true'],
            ['key' => 'home_svc_2_title',      'value' => 'Pathology'],
            ['key' => 'home_svc_2_desc',       'value' => 'Complete laboratory diagnostic services covering blood, urine, stool, sputum, and semen analysis with reliable, precise reporting.'],
            ['key' => 'home_svc_2_visible',    'value' => 'true'],
            ['key' => 'home_svc_3_title',      'value' => 'Day Care'],
            ['key' => 'home_svc_3_desc',       'value' => 'Clinical support including IV saline, wound care, and diabetic foot dressing, attended by trained male and female nursing staff.'],
            ['key' => 'home_svc_3_visible',    'value' => 'true'],
            ['key' => 'home_svc_4_title',      'value' => 'ECG'],
            ['key' => 'home_svc_4_desc',       'value' => 'Accurate 12-lead electrocardiogram testing by trained technicians, with male and female staff available for patient comfort.'],
            ['key' => 'home_svc_4_visible',    'value' => 'true'],
            ['key' => 'home_svc_5_title',      'value' => 'Dental Clinic'],
            ['key' => 'home_svc_5_desc',       'value' => 'Comprehensive oral healthcare from preventive check-ups and restorative treatments to advanced dental procedures using modern practices.'],
            ['key' => 'home_svc_5_visible',    'value' => 'true'],
            ['key' => 'home_svc_6_title',      'value' => 'Homeopathy & Nutrition Clinic'],
            ['key' => 'home_svc_6_desc',       'value' => 'Holistic healing through personalised homeopathic treatment and expert nutrition planning for weight management and long-term wellness.'],
            ['key' => 'home_svc_6_visible',    'value' => 'true'],
            // Home Why Us
            ['key' => 'home_whyus_visible',    'value' => 'true'],
            ['key' => 'home_whyus_badge',      'value' => 'Why Choose Us'],
            ['key' => 'home_whyus_heading',    'value' => 'Precision You Can'],
            ['key' => 'home_whyus_accent',     'value' => 'Trust Every Time'],
            ['key' => 'home_whyus_items',      'value' => 'NABL Accredited Laboratory, Same-day digital reports via WhatsApp, Experienced & trained phlebotomists, Hygienic safe and clean environment, Confidential patient data always'],
            ['key' => 'home_whyus_btn1_label', 'value' => 'About Us'],
            ['key' => 'home_whyus_btn2_label', 'value' => 'Our Services'],
            ['key' => 'home_whyus_image',      'value' => 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1000'],
            // Home Team
            ['key' => 'home_team_visible', 'value' => 'true'],
            ['key' => 'home_team_badge',   'value' => 'Our Healthcare Team'],
            ['key' => 'home_team_heading', 'value' => 'Meet Our Team'],
            ['key' => 'home_team_link',    'value' => 'View Our Full Team'],
            // Home Blog
            ['key' => 'home_blog_visible',   'value' => 'true'],
            ['key' => 'home_blog_badge',     'value' => 'Latest Updates'],
            ['key' => 'home_blog_heading',   'value' => 'News & Health Camps'],
            ['key' => 'home_blog_link',      'value' => 'All Posts'],
            ['key' => 'home_blog_read_more', 'value' => 'Read More'],
            // CTA Section
            ['key' => 'cta_visible',     'value' => 'true'],
            ['key' => 'cta_title',       'value' => 'Ready to prioritise your health?'],
            ['key' => 'cta_subtitle',    'value' => 'Walk in, call, or send a WhatsApp. We are open 7 days a week.'],
            ['key' => 'cta_btn_call',    'value' => 'Call Now'],
            ['key' => 'cta_btn_inquiry', 'value' => 'Send an Inquiry'],
            // Contact Info
            ['key' => 'contact_phone',         'value' => '918597215824'],
            ['key' => 'contact_phone_display', 'value' => '+91 8597215824'],
            ['key' => 'contact_whatsapp',      'value' => '918597215824'],
            ['key' => 'contact_email',         'value' => 'rohithealthcare1@gmail.com'],
            ['key' => 'contact_address',       'value' => 'Masjid Road, Balarampur, West Bengal, India'],
            ['key' => 'contact_hours_weekday', 'value' => 'Mon–Sat: 7:00 AM – 9:00 PM'],
            ['key' => 'contact_hours_sunday',  'value' => 'Sunday: 7:00 AM – 2:00 PM'],
            // About Page
            ['key' => 'about_page_badge',       'value' => 'Our Story'],
            ['key' => 'about_page_heading',     'value' => 'Built on Trust, Driven by Accuracy'],
            ['key' => 'about_page_subtext',     'value' => 'Rohit Health Care is committed to delivering swift, accessible, and precise diagnostics to our community - with full NABL backing.'],
            ['key' => 'about_excellence_badge', 'value' => 'Committed to Excellence'],
            ['key' => 'about_section_heading',  'value' => 'The Right Diagnosis Changes Everything'],
            ['key' => 'about_body_1',           'value' => 'At Rohit Health Care, we understand that an accurate diagnosis is the cornerstone of effective medical treatment. That is why we have partnered to bring world-class, NABL-accredited diagnostic testing facilities right to your neighbourhood.'],
            ['key' => 'about_body_2',           'value' => 'Our modern collection centre is staffed by trained phlebotomists who prioritise your comfort and safety. Every sample is handled with utmost care, processed using precision technology, and reported with unparalleled accuracy - whether it is a routine blood test or a complex clinical profile.'],
            ['key' => 'about_hero_bg',          'value' => ''],
            ['key' => 'about_image',            'value' => ''],
            ['key' => 'about_years_label',      'value' => 'Years serving the community'],
            // About Highlights
            ['key' => 'about_hl_1_label', 'value' => 'NABL Accredited'],
            ['key' => 'about_hl_1_desc',  'value' => 'National quality standards on every report.'],
            ['key' => 'about_hl_2_label', 'value' => 'Trusted Partner'],
            ['key' => 'about_hl_2_desc',  'value' => "Part of India's most trusted diagnostic brand."],
            ['key' => 'about_hl_3_label', 'value' => '3,000+ Tests'],
            ['key' => 'about_hl_3_desc',  'value' => 'Comprehensive catalog of assays and profiles.'],
            ['key' => 'about_hl_4_label', 'value' => '50,000+ Patients'],
            ['key' => 'about_hl_4_desc',  'value' => 'Trusted by families across the community.'],
            ['key' => 'about_hl_5_label', 'value' => 'Same-Day Reports'],
            ['key' => 'about_hl_5_desc',  'value' => 'Fast turnaround so you never wait for clarity.'],
            // About Why Us
            ['key' => 'about_whyus_heading', 'value' => 'Why Rohit Health Care?'],
            ['key' => 'about_whyus_items',   'value' => 'NABL Accredited testing, 100% data confidentiality and secure digital reports, Minimum waiting time - walk-in friendly, Home sample collection at your schedule, Hygienic sterile and modern collection facility'],
            ['key' => 'about_cta_title',     'value' => 'Experience Care Like Never Before'],
            ['key' => 'about_cta_subtitle',  'value' => 'Walk in today or arrange a home collection. Your health remains our top priority.'],
            ['key' => 'about_cta_btn',       'value' => 'Get in Touch'],
            // Services Page
            ['key' => 'services_page_badge',   'value' => 'What We Offer'],
            ['key' => 'services_page_heading', 'value' => 'Our Comprehensive Services'],
            ['key' => 'services_page_subtext', 'value' => 'Comprehensive care across consultations, diagnostics, dental, home services, and pharmacy in one place.'],
            // Service Cards (reference only — live data served from services table)
            ['key' => 'svc_1_title', 'value' => 'Polyclinic & Doctor Consultation'],
            ['key' => 'svc_1_desc',  'value' => 'Experienced physicians and specialist consultants available seven days a week for routine check-ups and expert medical advice.'],
            ['key' => 'svc_2_title', 'value' => 'Pathology'],
            ['key' => 'svc_2_desc',  'value' => 'Complete laboratory diagnostic services covering blood, urine, stool, sputum, and semen analysis with reliable, precise reporting.'],
            ['key' => 'svc_3_title', 'value' => 'Day Care'],
            ['key' => 'svc_3_desc',  'value' => 'Clinical support including IV saline administration, wound care, and diabetic foot dressing, attended by trained male and female nursing staff.'],
            ['key' => 'svc_4_title', 'value' => 'ECG'],
            ['key' => 'svc_4_desc',  'value' => 'Accurate 12-lead electrocardiogram testing performed by trained technicians, with both male and female staff available for patient comfort.'],
            ['key' => 'svc_5_title', 'value' => 'Dental Clinic'],
            ['key' => 'svc_5_desc',  'value' => 'Comprehensive oral healthcare from preventive check-ups and restorative treatments to advanced dental procedures using modern practices.'],
            ['key' => 'svc_6_title', 'value' => 'Homeopathy & Nutrition Clinic'],
            ['key' => 'svc_6_desc',  'value' => 'Holistic healing through personalised homeopathic treatment and expert nutrition planning for weight management and long-term wellness.'],
            // Services CTA
            ['key' => 'services_cta_heading',      'value' => 'Need a specific test?'],
            ['key' => 'services_cta_subtext',      'value' => 'We offer a vast catalog of advanced tests. Contact us directly to check availability and pricing for any test.'],
            ['key' => 'services_cta_btn_call',     'value' => 'Call Now'],
            ['key' => 'services_cta_btn_whatsapp', 'value' => 'WhatsApp'],
            ['key' => 'services_cta_btn_book',     'value' => 'Book Appointment'],
            // Doctors Page
            ['key' => 'doctors_page_badge',       'value' => 'Our Healthcare Professionals'],
            ['key' => 'doctors_page_heading',     'value' => 'Meet Our Team'],
            ['key' => 'doctors_page_subtext',     'value' => 'A team of dedicated doctors and specialists committed to delivering compassionate, quality care to every patient.'],
            ['key' => 'doctors_empty_text',       'value' => 'No team members found. Add from admin panel.'],
            ['key' => 'doctors_cta_heading',      'value' => 'Book a Consultation'],
            ['key' => 'doctors_cta_subtext',      'value' => 'Our team is available 7 days a week. Walk in or call us to schedule at your convenience.'],
            ['key' => 'doctors_cta_btn_call',     'value' => 'Call Now'],
            ['key' => 'doctors_cta_btn_whatsapp', 'value' => 'WhatsApp'],
            ['key' => 'doctors_cta_btn_message',  'value' => 'Send a Message'],
            // Contact Page
            ['key' => 'contact_page_badge',    'value' => 'We are here for you'],
            ['key' => 'contact_page_heading',  'value' => 'Get in Touch'],
            ['key' => 'contact_page_subtext',  'value' => 'Reach out via phone, WhatsApp, or email. Our team is available 7 days a week to assist you.'],
            ['key' => 'contact_btn_call',      'value' => 'Call Now'],
            ['key' => 'contact_btn_whatsapp',  'value' => 'WhatsApp'],
            ['key' => 'contact_whatsapp_sub',  'value' => 'Chat instantly'],
            ['key' => 'contact_visit_label',   'value' => 'Visit Our Clinic'],
            ['key' => 'contact_email_label',   'value' => 'Email Us'],
            ['key' => 'contact_hours_label',   'value' => 'Operating Hours'],
            // Contact Form
            ['key' => 'form_heading',             'value' => 'Send an Inquiry'],
            ['key' => 'form_subtext',             'value' => 'We typically respond within a few hours'],
            ['key' => 'form_name_label',          'value' => 'Full Name'],
            ['key' => 'form_name_placeholder',    'value' => 'e.g. Rahul Sharma'],
            ['key' => 'form_phone_label',         'value' => 'Phone Number'],
            ['key' => 'form_phone_placeholder',   'value' => '+91 98765 43210'],
            ['key' => 'form_message_label',       'value' => 'Message or Query'],
            ['key' => 'form_message_placeholder', 'value' => 'I would like to know more about...'],
            ['key' => 'form_submit_label',        'value' => 'Send Message'],
            ['key' => 'form_consent_text',        'value' => 'By submitting you agree to be contacted via phone or WhatsApp.'],
            ['key' => 'form_success_title',       'value' => 'Message Received!'],
            ['key' => 'form_success_text',        'value' => 'Thank you for reaching out. Our team will get back to you shortly via phone or WhatsApp.'],
            ['key' => 'form_success_again',       'value' => 'Send another message'],
            ['key' => 'form_email_label',          'value' => 'Email'],
            ['key' => 'form_email_placeholder',    'value' => 'your@email.com'],
            // Blogs Page
            ['key' => 'blogs_page_badge',    'value' => 'Stay Informed'],
            ['key' => 'blogs_page_heading',  'value' => 'News & Health Camps'],
            ['key' => 'blogs_page_subtext',  'value' => 'Updates on free outdoor checkup camps, community events, and medical advice.'],
            ['key' => 'blogs_empty_title',   'value' => 'No updates yet'],
            ['key' => 'blogs_empty_subtext', 'value' => 'Check back soon for news and health camp announcements.'],
            ['key' => 'blogs_read_more',     'value' => 'Read More'],
            ['key' => 'blogs_back_link',     'value' => 'Back to News'],
            ['key' => 'blogs_all_link',      'value' => 'All News'],
            ['key' => 'blogs_share_btn',     'value' => 'Share on WhatsApp'],
            ['key' => 'blogs_notfound',      'value' => 'Post not found'],
            ['key' => 'blogs_cta_heading',   'value' => 'Have a health concern?'],
            ['key' => 'blogs_cta_subtext',   'value' => 'Our team is ready to help you today.'],
            ['key' => 'blogs_cta_btn',       'value' => 'Call Us Now'],
            // Gallery Page
            ['key' => 'gallery_page_badge',    'value' => 'Our Facility & Events'],
            ['key' => 'gallery_page_heading',  'value' => 'Photo Gallery'],
            ['key' => 'gallery_page_subtext',  'value' => 'A glimpse into our modern diagnostics center and community health camps.'],
            ['key' => 'gallery_empty_title',   'value' => 'No photos yet'],
            ['key' => 'gallery_empty_subtext', 'value' => 'Check back soon for updates from our events and facility.'],
            // Doctor Card
            ['key' => 'doctor_default_qual', 'value' => 'MBBS'],
            ['key' => 'doctor_availability', 'value' => 'Available'],
            // 404 Page
            ['key' => 'notfound_heading',     'value' => 'Page Not Found'],
            ['key' => 'notfound_text',        'value' => "Sorry, the page you're looking for doesn't exist or may have been moved. Let us help you find your way back."],
            ['key' => 'notfound_home_btn',    'value' => 'Back to Home'],
            ['key' => 'notfound_call_btn',    'value' => 'Call Us'],
            ['key' => 'notfound_links_label', 'value' => 'Quick Links'],
        ];
        foreach ($siteContent as $item) {
            DB::table('site_contents')->updateOrInsert(['key' => $item['key']], ['value' => $item['value']]);
        }

        // ─── SiteSettings - general + SEO (insertOrIgnore = safe to re-run) ───
        $siteSettings = [
            // General settings (shown in Admin > Settings > General tab)
            ['key' => 'site_name',         'value' => 'Rohit Health Care'],
            ['key' => 'google_maps_url',       'value' => 'https://maps.app.goo.gl/N5KrFWzKUspjw1YD6'],
            ['key' => 'allowed_domains',   'value' => 'rohithealthcare.com,rohithealthcare.in,localhost:5173'],
            ['key' => 'google_maps_embed', 'value' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14647.23432717014!2d86.2215444!3d23.1027786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f697446700c25d%3A0xe67c1e550c608bfa!2sBalarampur%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1711111111111!5m2!1sen!2sin'],
            ['key' => 'site_logo',         'value' => ''],
            // SEO - Home page
            ['key' => 'seo_home_title',       'value' => 'Rohit Health Care | Accurate Diagnostics & Home Sample Collection'],
            ['key' => 'seo_home_description', 'value' => 'NABL-accredited diagnostic centre offering pathology, cardiology, biochemistry tests, and 24x7 home sample collection. Fast, accurate reports delivered to WhatsApp.'],
            ['key' => 'seo_home_keywords',    'value' => 'Rohit Health Care, diagnostic centre, NABL, blood test, home sample collection, pathology, ECG'],
            // SEO - About page
            ['key' => 'seo_about_title',       'value' => 'About Rohit Health Care | Our Story & Mission'],
            ['key' => 'seo_about_description', 'value' => 'Learn about Rohit Health Care\'s commitment to accurate diagnostics, NABL accreditation, and delivering quality healthcare to the community.'],
            ['key' => 'seo_about_keywords',    'value' => 'about Rohit Health Care, NABL accredited lab, diagnostic centre history, community health'],
            // SEO - Services page
            ['key' => 'seo_services_title',       'value' => 'Our Services | Rohit Health Care'],
            ['key' => 'seo_services_description', 'value' => 'Explore our comprehensive services: polyclinic consultations, pathology, day care, ECG, dental clinic, homeopathy, home services, and pharmacy.'],
            ['key' => 'seo_services_keywords',    'value' => 'polyclinic, pathology, day care, ECG, dental clinic, homeopathy, nutrition, home services, pharmacy, doctor consultation'],
            // SEO - Doctors page
            ['key' => 'seo_doctors_title',       'value' => 'Our Team | Rohit Health Care'],
            ['key' => 'seo_doctors_description', 'value' => 'Meet the dedicated medical team at Rohit Health Care — experienced doctors and specialists available seven days a week.'],
            ['key' => 'seo_doctors_keywords',    'value' => 'medical team, doctors, general physician, dietitian, specialist, consultation, Rohit Health Care'],
            // SEO - Gallery page
            ['key' => 'seo_gallery_title',       'value' => 'Gallery | Rohit Health Care Facility & Events'],
            ['key' => 'seo_gallery_description', 'value' => 'Explore photos of our modern diagnostic facility, health camps, and community events at Rohit Health Care.'],
            ['key' => 'seo_gallery_keywords',    'value' => 'gallery, health camp, diagnostic facility, lab photos, events, community health'],
            // SEO - Blogs page
            ['key' => 'seo_blogs_title',       'value' => 'News & Health Camps | Rohit Health Care'],
            ['key' => 'seo_blogs_description', 'value' => 'Stay informed with the latest health updates, free check-up camps, and community health news from Rohit Health Care.'],
            ['key' => 'seo_blogs_keywords',    'value' => 'health camps, news, free check-up camp, community health, blood donation, awareness'],
            // SEO - Contact page
            ['key' => 'seo_contact_title',       'value' => 'Contact Us | Rohit Health Care'],
            ['key' => 'seo_contact_description', 'value' => 'Get in touch with Rohit Health Care for appointments, queries, or home sample collection. Call, WhatsApp, or email us anytime.'],
            ['key' => 'seo_contact_keywords',    'value' => 'contact, appointment, phone, WhatsApp, email, health care contact, book test'],
            // SEO - Global
            ['key' => 'seo_og_image',         'value' => ''],
            ['key' => 'google_analytics_id',  'value' => ''],

            // AI Chatbot Info
            ['key' => 'chatbot_enabled',       'value' => 'true'],
            ['key' => 'chatbot_provider',      'value' => 'openrouter'],
            ['key' => 'chatbot_api_key',       'value' => ''],
            ['key' => 'chatbot_model',         'value' => 'stepfun/step-3.5-flash:free'],
            ['key' => 'chatbot_endpoint_url',  'value' => ''],
            ['key' => 'chatbot_bot_name',      'value' => 'Health Assistant'],
            ['key' => 'chatbot_color',         'value' => '#4e66b3'],
            ['key' => 'chatbot_welcome_msg',   'value' => 'Hello! 👋 How can I help you today? Ask me anything about our services, hours, or how to get in touch.'],
            ['key' => 'chatbot_placeholder',   'value' => 'Ask about our services...'],
            ['key' => 'chatbot_suggested_questions', 'value' => "What services do you offer?\nWhat are your opening hours?\nHow do I book an appointment?\nWhere is the clinic located?\nWhich doctors are available?"],
            ['key' => 'chatbot_system_prompt', 'value' => "You are the official AI Assistant for Rohit Health Care.\nYour goal is to be helpful, concise, and professional.\nDo NOT hallucinate medical advice or prices.\nDirect patients to call the clinic for specific quotes or advanced medical questions."],
        ];
        foreach ($siteSettings as $item) {
            DB::table('site_settings')->insertOrIgnore($item);
        }

        // ─── Services - clears and reseeds on every deployment ───
        DB::table('services')->delete();
        DB::table('services')->insert([
            [
                'title'       => 'Polyclinic & Doctor Consultation',
                'description' => 'Our polyclinic brings together experienced physicians and specialist consultants under one roof. Whether it is a routine check-up or an expert second opinion, our doctors are available seven days a week to guide you toward the right diagnosis and treatment.',
                'icon' => 'Stethoscope',
                'order' => 1,
                'visible' => true,
            ],
            [
                'title'       => 'Pathology',
                'description' => 'We provide a complete range of laboratory diagnostic services covering blood, urine, stool, sputum, and semen analysis. Every test is conducted with precision using reliable methods, ensuring accurate reports for informed medical decisions.',
                'icon' => 'TestTube',
                'order' => 2,
                'visible' => true,
            ],
            [
                'title'       => 'Day Care',
                'description' => 'Our day care unit offers essential clinical support services including intravenous saline administration, wound care management, and specialised diabetic foot dressing. Attended by trained male and female nursing professionals for a safe and comfortable experience.',
                'icon' => 'Bandage',
                'order' => 3,
                'visible' => true,
            ],
            [
                'title'       => 'ECG',
                'description' => 'We provide accurate 12-lead electrocardiogram testing conducted by trained staff. With a dedicated focus on patient comfort, our ECG service is available with both male and female technicians to meet every patient\'s preference.',
                'icon' => 'Activity',
                'order' => 4,
                'visible' => true,
            ],
            [
                'title'       => 'Dental Clinic',
                'description' => 'Our in-house dental clinic offers comprehensive oral healthcare, from preventive check-ups and routine care to restorative treatments and advanced dental procedures. We combine modern practices with a patient-friendly approach at every visit.',
                'icon' => 'Sparkles',
                'order' => 5,
                'visible' => true,
            ],
            [
                'title'       => 'Homeopathy & Nutrition Clinic',
                'description' => 'Experience the benefits of holistic care through customised homeopathic treatment and expert nutritional guidance. Our personalised diet plans address weight management, metabolic conditions, and long-term wellbeing tailored to your individual needs.',
                'icon' => 'HeartPulse',
                'order' => 6,
                'visible' => true,
            ],
            [
                'title'       => 'Home Services',
                'description' => 'We bring quality healthcare to your doorstep. Our home services include laboratory sample collection, wound dressing, saline administration, and ECG, all performed by trained professionals at a time and place that suits you.',
                'icon' => 'Heart',
                'order' => 7,
                'visible' => true,
            ],
            [
                'title'       => 'Pharmacy',
                'description' => 'Our pharmacy stocks a wide range of prescription medicines, over-the-counter products, and surgical supplies. Patients can conveniently access the medications and consumables they need on the same visit, ensuring uninterrupted continuity of care.',
                'icon' => 'Pill',
                'order' => 8,
                'visible' => true,
            ],
        ]);

        // ─── Force-update key content entries for existing deployments ───
        $contentUpdates = [
            ['key' => 'site_tagline',             'value' => 'Precision diagnostics with care you can trust.'],
            ['key' => 'footer_address_short',     'value' => 'Masjid Road, Balarampur, West Bengal, India'],
            ['key' => 'services_page_badge',      'value' => 'What We Offer'],
            ['key' => 'services_page_heading',    'value' => 'Our Comprehensive Services'],
            ['key' => 'services_page_subtext',    'value' => 'Comprehensive care across consultations, diagnostics, dental, home services, and pharmacy in one place.'],
            ['key' => 'home_services_heading',    'value' => 'Comprehensive Healthcare Services'],
            ['key' => 'home_services_subtext',    'value' => 'Comprehensive healthcare services delivered through expert consultation, diagnostics, and patient-focused care.'],
            ['key' => 'home_team_badge',          'value' => 'Our Healthcare Team'],
            ['key' => 'home_team_heading',        'value' => 'Meet Our Team'],
            ['key' => 'home_team_link',           'value' => 'View Our Full Team'],
            ['key' => 'doctors_page_badge',       'value' => 'Our Healthcare Professionals'],
            ['key' => 'doctors_page_heading',     'value' => 'Meet Our Team'],
            ['key' => 'doctors_page_subtext',     'value' => 'A team of dedicated doctors and specialists committed to delivering compassionate, quality care to every patient.'],
            ['key' => 'doctors_empty_text',       'value' => 'No team members found. Add from admin panel.'],
            ['key' => 'seo_services_title',       'value' => 'Our Services | Rohit Health Care'],
            ['key' => 'seo_services_description', 'value' => 'Explore our comprehensive services: polyclinic consultations, pathology, day care, ECG, dental clinic, homeopathy, home services, and pharmacy.'],
            ['key' => 'seo_services_keywords',    'value' => 'polyclinic, pathology, day care, ECG, dental clinic, homeopathy, nutrition, home services, pharmacy, doctor consultation'],
            ['key' => 'seo_doctors_title',        'value' => 'Our Team | Rohit Health Care'],
            ['key' => 'seo_doctors_description',  'value' => 'Meet the dedicated medical team at Rohit Health Care — experienced doctors and specialists available seven days a week.'],
            ['key' => 'seo_doctors_keywords',     'value' => 'medical team, doctors, general physician, dietitian, specialist, consultation, Rohit Health Care'],
        ];
        foreach ($contentUpdates as $item) {
            DB::table('site_contents')->updateOrInsert(['key' => $item['key']], ['value' => $item['value']]);
        }

        echo "✅ Database seeded: team, services, and content updated\n";
    }
}
