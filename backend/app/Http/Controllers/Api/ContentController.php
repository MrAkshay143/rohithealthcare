<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteContent;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class ContentController extends Controller
{
    /**
     * Merged site content: content defaults + DB overrides + site settings.
     * Matches the getSiteContent() function from the original Next.js app.
     */
    public function index()
    {
        $defaults = $this->getContentDefaults();

        $dbMap = [];
        try {
            $items = SiteContent::all();
            foreach ($items as $item) {
                $dbMap[$item->key] = $item->value;
            }
        } catch (\Exception $e) {
            // DB unavailable - fall through to defaults
        }

        try {
            $settings = SiteSetting::all();
            foreach ($settings as $s) {
                $dbMap[$s->key] = $s->value;
            }
        } catch (\Exception $e) {
            // table may not exist yet
        }

        $result = [];
        foreach ($defaults as $key => $meta) {
            $result[$key] = $dbMap[$key] ?? $meta['value'];
        }

        // Include any extra DB keys not in defaults (auto-visibility, pills, etc.)
        foreach ($dbMap as $key => $value) {
            if (!isset($result[$key])) {
                $result[$key] = $value;
            }
        }

        return response()->json($result);
    }

    /**
     * List raw site content items (for admin content page).
     */
    public function list()
    {
        return response()->json(SiteContent::all());
    }

    /**
     * Upsert a site content item.
     */
    public function upsert(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string|max:255',
            'value' => 'nullable|string',
        ]);
        $validated['value'] = $validated['value'] ?? '';

        $item = SiteContent::updateOrCreate(
            ['key' => $validated['key']],
            ['value' => $validated['value']]
        );

        return response()->json(['success' => 'Content saved', 'item' => $item]);
    }

    /**
     * Bulk upsert multiple content items at once.
     */
    public function bulkUpsert(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.key' => 'required|string|max:255',
            'items.*.value' => 'nullable|string',
        ]);

        foreach ($validated['items'] as $item) {
            SiteContent::updateOrCreate(
                ['key' => $item['key']],
                ['value' => $item['value'] ?? '']
            );
        }

        return response()->json(['success' => 'Bulk content saved', 'count' => count($validated['items'])]);
    }

    /**
     * Reset all content - delete all rows from site_content table.
     */
    public function resetAll()
    {
        $count = SiteContent::count();
        SiteContent::truncate();
        return response()->json(['success' => 'All content reset to defaults', 'deleted' => $count]);
    }

    public function count()
    {
        return response()->json(['count' => SiteContent::count()]);
    }

    /**
     * Return content defaults with labels and groups (for admin panel).
     */
    public function defaults()
    {
        return response()->json($this->getContentDefaults());
    }

    /**
     * Content defaults matching the original CONTENT_DEFAULTS from content.ts
     */
    private function getContentDefaults(): array
    {
        return [
            // ─── General ──────────────────────────────────────────────────────────
            'site_name'        => ['value' => 'Rohit Health Care',                                      'label' => 'Site / Brand Name',              'group' => 'General'],
            'site_domain'      => ['value' => 'https://rohithealthcare.com',                             'label' => 'Site URL',                       'group' => 'General'],
            'site_tagline'     => ['value' => 'Precision diagnostics with care you can trust.',          'label' => 'Site Tagline',                   'group' => 'General'],
            'site_logo'        => ['value' => '',                                                        'label' => 'Custom Logo URL',                'group' => 'General'],
            'years_experience' => ['value' => '5',                                                       'label' => 'Years of Experience',            'group' => 'General'],
            'facebook_url'     => ['value' => 'https://www.facebook.com/p/Rohit-Health-Care-100092529805396/', 'label' => 'Facebook URL',             'group' => 'General'],
            'youtube_url'      => ['value' => 'http://www.youtube.com/@rohithealthcare',                 'label' => 'YouTube URL',                    'group' => 'General'],
            'google_maps_url'  => ['value' => 'https://maps.app.goo.gl/N5KrFWzKUspjw1YD6',              'label' => 'Google Maps Directions URL',     'group' => 'General'],
            'google_maps_embed' => ['value' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d839.8748787948425!2d86.21762830764052!3d23.09263661044418!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f5d9e094e2ca17%3A0x4a91deca3f7decf1!2sRohit%20Health%20Care!5e1!3m2!1sen!2sin!4v1774070592440!5m2!1sen!2sin', 'label' => 'Google Maps Embed URL', 'group' => 'General'],

            // ─── Navbar ───────────────────────────────────────────────────────────
            'navbar_cta_label' => ['value' => 'Call Now', 'label' => 'Navbar CTA Button Text', 'group' => 'Navbar'],

            // ─── Contact Info ─────────────────────────────────────────────────────
            'contact_phone'         => ['value' => '918597215824',                           'label' => 'Phone (with country code 91)', 'group' => 'Contact Info'],
            'contact_phone_display' => ['value' => '+91 8597215824',                         'label' => 'Phone Display Text',           'group' => 'Contact Info'],
            'contact_whatsapp'      => ['value' => '918597215824',                           'label' => 'WhatsApp (with country code)', 'group' => 'Contact Info'],
            'contact_email'         => ['value' => 'rohithealthcare1@gmail.com',             'label' => 'Email Address',                'group' => 'Contact Info'],
            'contact_address'       => ['value' => 'Masjid Road, Balarampur, West Bengal, India', 'label' => 'Clinic Address',         'group' => 'Contact Info'],
            'contact_hours_weekday' => ['value' => 'Mon–Sat: 7:00 AM – 9:00 PM',            'label' => 'Weekday Hours',                'group' => 'Contact Info'],
            'contact_hours_sunday'  => ['value' => 'Sunday: 7:00 AM – 2:00 PM',             'label' => 'Sunday Hours',                 'group' => 'Contact Info'],

            // ─── Footer ───────────────────────────────────────────────────────────
            'footer_tagline'       => ['value' => 'Comprehensive healthcare for your whole family, right in your neighbourhood.', 'label' => 'Footer Tagline',       'group' => 'Footer'],
            'footer_address_short' => ['value' => 'Masjid Road, Balarampur, West Bengal, India',                                  'label' => 'Footer Address (short)', 'group' => 'Footer'],

            // ─── Hero Section ─────────────────────────────────────────────────────
            'hero_badge'          => ['value' => 'Associated with Apollo Diagnostics',                           'label' => 'Hero Badge Text',         'group' => 'Hero Section'],
            'hero_heading'        => ['value' => 'Accurate Diagnostics.',                                        'label' => 'Hero Main Heading',       'group' => 'Hero Section'],
            'hero_accent'         => ['value' => 'Trusted Care.',                                                'label' => 'Hero Accent Text',        'group' => 'Hero Section'],
            'hero_subtext'        => ['value' => 'Complete healthcare and diagnostics under one roof, at our clinic or at your doorstep.', 'label' => 'Hero Sub-text', 'group' => 'Hero Section'],
            'hero_btn_call'       => ['value' => 'Call Us Now',                                                  'label' => 'Hero Call Button Label',  'group' => 'Hero Section'],
            'hero_btn_directions' => ['value' => 'Directions',                                                   'label' => 'Hero Directions Button',  'group' => 'Hero Section'],
            'hero_pills'          => ['value' => 'NABL Accredited, Same Day Reports, Home Collection, 5 Years', 'label' => 'Hero Trust Pills',        'group' => 'Hero Section'],

            // ─── Stats ────────────────────────────────────────────────────────────
            'stat_1_value' => ['value' => '50,000+',      'label' => 'Stat 1 - Number', 'group' => 'Stats Strip'],
            'stat_1_label' => ['value' => 'Happy Patients', 'label' => 'Stat 1 - Label', 'group' => 'Stats Strip'],
            'stat_2_value' => ['value' => '3,000+',        'label' => 'Stat 2 - Number', 'group' => 'Stats Strip'],
            'stat_2_label' => ['value' => 'Diagnostic Tests', 'label' => 'Stat 2 - Label', 'group' => 'Stats Strip'],
            'stat_3_value' => ['value' => '5+',            'label' => 'Stat 3 - Number', 'group' => 'Stats Strip'],
            'stat_3_label' => ['value' => 'Years of Service', 'label' => 'Stat 3 - Label', 'group' => 'Stats Strip'],
            'stat_4_value' => ['value' => '100+',          'label' => 'Stat 4 - Number', 'group' => 'Stats Strip'],
            'stat_4_label' => ['value' => 'Same-Day Reports', 'label' => 'Stat 4 - Label', 'group' => 'Stats Strip'],

            // ─── CTA Section ──────────────────────────────────────────────────────
            'cta_title'       => ['value' => 'Ready to prioritise your health?',                           'label' => 'CTA Section Title',       'group' => 'CTA Section'],
            'cta_subtitle'    => ['value' => 'Walk in, call, or send a WhatsApp. We are open 7 days a week.', 'label' => 'CTA Sub-text',          'group' => 'CTA Section'],
            'cta_btn_call'    => ['value' => 'Call Now',                                                   'label' => 'CTA Call Button Label',   'group' => 'CTA Section'],
            'cta_btn_inquiry' => ['value' => 'Send an Inquiry',                                            'label' => 'CTA Inquiry Button Label', 'group' => 'CTA Section'],

            // ─── About Page ───────────────────────────────────────────────────────
            'about_page_badge'      => ['value' => 'Our Story',                                   'label' => 'About Hero Badge',          'group' => 'About Page'],
            'about_page_heading'    => ['value' => 'Built on Trust, Driven by Accuracy',          'label' => 'About Hero Heading',        'group' => 'About Page'],
            'about_page_subtext'    => ['value' => 'Quality care, delivered with precision and genuine compassion.', 'label' => 'About Hero Sub-text', 'group' => 'About Page'],
            'about_section_heading' => ['value' => 'The Right Diagnosis Changes Everything',      'label' => 'About Main Section Heading', 'group' => 'About Page'],
            'about_body_1'          => ['value' => 'At Rohit Health Care, we believe good treatment starts with an accurate diagnosis. In partnership with Apollo Diagnostics, we bring NABL-accredited testing facilities right to your neighbourhood.', 'label' => 'About Body 1', 'group' => 'About Page'],
            'about_body_2'          => ['value' => 'Our centre is staffed by trained professionals who put your comfort first. Every sample is processed with care and every report is delivered accurately.', 'label' => 'About Body 2', 'group' => 'About Page'],
            'about_hero_bg'         => ['value' => '', 'label' => 'About Hero Background Image URL', 'group' => 'About Page'],
            'about_image'           => ['value' => '', 'label' => 'About Section Photo URL',         'group' => 'About Page'],
            'about_years_label'     => ['value' => 'Years serving the community',                    'label' => 'About Years Badge Label',   'group' => 'About Page'],
            'about_cta_title'       => ['value' => 'We are here whenever you need us.',              'label' => 'About CTA Heading',         'group' => 'About Page'],
            'about_cta_subtitle'    => ['value' => 'Walk in today or book a home visit. Your health comes first.', 'label' => 'About CTA Sub-text', 'group' => 'About Page'],

            // ─── Services Page ────────────────────────────────────────────────────
            'services_page_badge'      => ['value' => 'What We Offer',                          'label' => 'Services Page Badge',   'group' => 'Services Page'],
            'services_page_heading'    => ['value' => 'Our Comprehensive Services',             'label' => 'Services Page Heading', 'group' => 'Services Page'],
            'services_page_subtext'    => ['value' => 'Comprehensive care across consultations, diagnostics, dental, home services, and pharmacy in one place.', 'label' => 'Services Page Sub-text', 'group' => 'Services Page'],
            'services_cta_heading'     => ['value' => 'Need a specific test?',                  'label' => 'Services CTA Heading',  'group' => 'Services Page'],
            'services_cta_subtext'     => ['value' => 'We cover a wide range of tests. Call or message us to confirm availability and pricing.', 'label' => 'Services CTA Sub-text', 'group' => 'Services Page'],

            // ─── Doctors Page ─────────────────────────────────────────────────────
            'doctors_page_badge'   => ['value' => 'Our Healthcare Professionals',               'label' => 'Doctors Page Badge',   'group' => 'Doctors Page'],
            'doctors_page_heading' => ['value' => 'Meet Our Team',                              'label' => 'Doctors Page Heading', 'group' => 'Doctors Page'],
            'doctors_page_subtext' => ['value' => 'A team of dedicated doctors and specialists committed to delivering compassionate, quality care.', 'label' => 'Doctors Page Sub-text', 'group' => 'Doctors Page'],
            'doctors_cta_heading'  => ['value' => 'Book a Consultation',                        'label' => 'Doctors CTA Heading',  'group' => 'Doctors Page'],
            'doctors_cta_subtext'  => ['value' => 'Our team is available 7 days a week. Walk in or call us to schedule at your convenience.', 'label' => 'Doctors CTA Sub-text', 'group' => 'Doctors Page'],

            // ─── Contact Page ─────────────────────────────────────────────────────
            'contact_page_badge'   => ['value' => 'We are here for you',                       'label' => 'Contact Page Badge',   'group' => 'Contact Page'],
            'contact_page_heading' => ['value' => 'Get in Touch',                               'label' => 'Contact Page Heading', 'group' => 'Contact Page'],
            'contact_page_subtext' => ['value' => 'Reach out via phone, WhatsApp, or email. Our team is available 7 days a week to assist you.', 'label' => 'Contact Page Sub-text', 'group' => 'Contact Page'],

            // ─── SEO – Per-page ───────────────────────────────────────────────────
            'seo_home_title'           => ['value' => 'Rohit Health Care | Trusted Diagnostics & Healthcare, Balarampur', 'label' => 'Home – Meta Title',          'group' => 'SEO'],
            'seo_home_description'     => ['value' => 'Rohit Health Care is a NABL accredited diagnostic centre in Balarampur, West Bengal. Blood tests, pathology, ECG, dental clinic, home sample collection and comprehensive healthcare services.', 'label' => 'Home – Meta Description', 'group' => 'SEO'],
            'seo_home_keywords'        => ['value' => 'Rohit Health Care, diagnostic centre, NABL, blood test, home sample collection, pathology, ECG, Balarampur, West Bengal', 'label' => 'Home – Keywords', 'group' => 'SEO'],
            'seo_about_title'          => ['value' => 'About Rohit Health Care | Our Story & Mission',            'label' => 'About – Meta Title',        'group' => 'SEO'],
            'seo_about_description'    => ['value' => 'Learn about Rohit Health Care\'s commitment to accurate diagnostics, NABL accreditation, and delivering quality healthcare to the community of Balarampur, West Bengal.', 'label' => 'About – Meta Description', 'group' => 'SEO'],
            'seo_about_keywords'       => ['value' => 'about Rohit Health Care, NABL accredited lab, diagnostic centre history, community health, Balarampur', 'label' => 'About – Keywords', 'group' => 'SEO'],
            'seo_services_title'       => ['value' => 'Our Services | Rohit Health Care',                        'label' => 'Services – Meta Title',     'group' => 'SEO'],
            'seo_services_description' => ['value' => 'Explore comprehensive services at Rohit Health Care: polyclinic, pathology, day care, ECG, dental clinic, homeopathy, home sample collection and pharmacy.', 'label' => 'Services – Meta Description', 'group' => 'SEO'],
            'seo_services_keywords'    => ['value' => 'polyclinic, pathology, day care, ECG, dental clinic, homeopathy, nutrition, home services, pharmacy, doctor consultation, Balarampur', 'label' => 'Services – Keywords', 'group' => 'SEO'],
            'seo_doctors_title'        => ['value' => 'Our Medical Team | Rohit Health Care',                    'label' => 'Doctors – Meta Title',      'group' => 'SEO'],
            'seo_doctors_description'  => ['value' => 'Meet the dedicated medical team at Rohit Health Care — experienced doctors and specialists available seven days a week in Balarampur.', 'label' => 'Doctors – Meta Description', 'group' => 'SEO'],
            'seo_doctors_keywords'     => ['value' => 'medical team, doctors, general physician, dietitian, specialist, consultation, Rohit Health Care, Balarampur', 'label' => 'Doctors – Keywords', 'group' => 'SEO'],
            'seo_gallery_title'        => ['value' => 'Gallery | Rohit Health Care Facility & Events',           'label' => 'Gallery – Meta Title',      'group' => 'SEO'],
            'seo_gallery_description'  => ['value' => 'Photos of our modern diagnostic facility, health camps, and community events at Rohit Health Care, Balarampur, West Bengal.', 'label' => 'Gallery – Meta Description', 'group' => 'SEO'],
            'seo_gallery_keywords'     => ['value' => 'gallery, health camp, diagnostic facility, lab photos, community health, Balarampur', 'label' => 'Gallery – Keywords', 'group' => 'SEO'],
            'seo_blogs_title'          => ['value' => 'News & Health Camps | Rohit Health Care',                 'label' => 'Blogs – Meta Title',        'group' => 'SEO'],
            'seo_blogs_description'    => ['value' => 'Latest health updates, free check-up camps, and community health news from Rohit Health Care, Balarampur.', 'label' => 'Blogs – Meta Description', 'group' => 'SEO'],
            'seo_blogs_keywords'       => ['value' => 'health camps, news, free check-up camp, community health, blood donation, awareness, Balarampur', 'label' => 'Blogs – Keywords', 'group' => 'SEO'],
            'seo_contact_title'        => ['value' => 'Contact Us | Rohit Health Care',                          'label' => 'Contact – Meta Title',      'group' => 'SEO'],
            'seo_contact_description'  => ['value' => 'Get in touch with Rohit Health Care for appointments, queries, or home sample collection in Balarampur. Call, WhatsApp, or email us today.', 'label' => 'Contact – Meta Description', 'group' => 'SEO'],
            'seo_contact_keywords'     => ['value' => 'contact, appointment, phone, WhatsApp, email, health care contact, book test, Balarampur', 'label' => 'Contact – Keywords', 'group' => 'SEO'],

            // ─── SEO – Global ─────────────────────────────────────────────────────
            'seo_og_image'        => ['value' => '',                'label' => 'Social Share Image (OG)',      'group' => 'SEO'],
            'google_analytics_id' => ['value' => '',                'label' => 'Google Analytics ID (GA4)',   'group' => 'SEO'],
            'seo_robots'          => ['value' => 'index, follow',   'label' => 'Robots Directive',            'group' => 'SEO'],
            'seo_twitter_handle'  => ['value' => '',                'label' => 'Twitter / X Handle',         'group' => 'SEO'],

            // ─── SEO – Local Business Structured Data ─────────────────────────────
            'seo_geo_region'    => ['value' => 'IN-WB',      'label' => 'Geo Region (ISO)',     'group' => 'SEO Local'],
            'seo_geo_lat'       => ['value' => '23.092637',  'label' => 'Latitude',             'group' => 'SEO Local'],
            'seo_geo_lng'       => ['value' => '86.217628',  'label' => 'Longitude',            'group' => 'SEO Local'],
            'seo_local_street'  => ['value' => 'Masjid Road', 'label' => 'Street Address',       'group' => 'SEO Local'],
            'seo_local_city'    => ['value' => 'Balarampur', 'label' => 'City',                 'group' => 'SEO Local'],
            'seo_local_state'   => ['value' => 'West Bengal', 'label' => 'State',                'group' => 'SEO Local'],
            'seo_local_postal'  => ['value' => '723153',     'label' => 'PIN Code',             'group' => 'SEO Local'],
            'seo_local_country' => ['value' => 'IN',         'label' => 'Country Code (ISO)',   'group' => 'SEO Local'],
        ];
    }
}
