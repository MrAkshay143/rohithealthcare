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
            'hero_badge' => ['value' => 'Associated with Apollo Diagnostics', 'label' => 'Hero Badge Text', 'group' => 'Hero Section'],
            'hero_heading' => ['value' => 'Accurate Diagnostics.', 'label' => 'Hero Main Heading', 'group' => 'Hero Section'],
            'hero_accent' => ['value' => 'Trusted Care.', 'label' => 'Hero Accent (red) Text', 'group' => 'Hero Section'],
            'hero_subtext' => ['value' => 'Your trusted partner for accurate diagnostics and home sample collection. Fast, reliable and right at your doorstep.', 'label' => 'Hero Sub-text', 'group' => 'Hero Section'],
            'hero_btn_call' => ['value' => 'Call Us Now', 'label' => 'Hero Call Button Label', 'group' => 'Hero Section'],
            'hero_btn_directions' => ['value' => 'Directions', 'label' => 'Hero Directions Button Label', 'group' => 'Hero Section'],
            'hero_pills' => ['value' => 'NABL Accredited, Same Day Reports, Home Collection, 10+ Years', 'label' => 'Hero Trust Pills (comma-separated)', 'group' => 'Hero Section'],

            'stat_1_value' => ['value' => '50,000+', 'label' => 'Stat 1 - Number', 'group' => 'Stats Strip'],
            'stat_1_label' => ['value' => 'Happy Patients', 'label' => 'Stat 1 - Label', 'group' => 'Stats Strip'],
            'stat_2_value' => ['value' => '3,000+', 'label' => 'Stat 2 - Number', 'group' => 'Stats Strip'],
            'stat_2_label' => ['value' => 'Diagnostic Tests', 'label' => 'Stat 2 - Label', 'group' => 'Stats Strip'],
            'stat_3_label' => ['value' => 'Years of Service', 'label' => 'Stat 3 - Label', 'group' => 'Stats Strip'],
            'stat_4_value' => ['value' => '100%', 'label' => 'Stat 4 - Number', 'group' => 'Stats Strip'],
            'stat_4_label' => ['value' => 'Same-Day Reports', 'label' => 'Stat 4 - Label', 'group' => 'Stats Strip'],

            'services_heading' => ['value' => 'Comprehensive Diagnostic Services', 'label' => 'Services Heading', 'group' => 'Services Section'],
            'services_subheading' => ['value' => 'Cutting-edge technology and skilled professionals - all under one roof.', 'label' => 'Services Sub-heading', 'group' => 'Services Section'],

            'cta_title' => ['value' => 'Ready to prioritise your health?', 'label' => 'CTA Section Title', 'group' => 'CTA Section'],
            'cta_subtitle' => ['value' => 'Walk in, call, or send a WhatsApp. We are open 7 days a week.', 'label' => 'CTA Sub-text', 'group' => 'CTA Section'],
            'cta_btn_call' => ['value' => 'Call Now', 'label' => 'CTA Call Button Label', 'group' => 'CTA Section'],
            'cta_btn_inquiry' => ['value' => 'Send an Inquiry', 'label' => 'CTA Inquiry Button Label', 'group' => 'CTA Section'],

            'contact_phone' => ['value' => '9876543210', 'label' => 'Phone (digits only, no +91)', 'group' => 'Contact Info'],
            'contact_phone_display' => ['value' => '+91 98765 43210', 'label' => 'Phone Display Text', 'group' => 'Contact Info'],
            'contact_whatsapp' => ['value' => '919876543210', 'label' => 'WhatsApp (with country code)', 'group' => 'Contact Info'],
            'contact_email' => ['value' => '', 'label' => 'Email Address', 'group' => 'Contact Info'],
            'contact_address' => ['value' => '123 Medical Hub Avenue, Near City Landmark, Diagnostic Square, Metropolitan City, State - PIN 110011', 'label' => 'Clinic Address', 'group' => 'Contact Info'],
            'contact_hours_weekday' => ['value' => 'Mon–Sat: 7:00 AM – 9:00 PM', 'label' => 'Weekday Hours', 'group' => 'Contact Info'],
            'contact_hours_sunday' => ['value' => 'Sunday: 7:00 AM – 2:00 PM', 'label' => 'Sunday Hours', 'group' => 'Contact Info'],

            'site_name' => ['value' => 'Rohit Health Care', 'label' => 'Site / Brand Name', 'group' => 'General'],
            'site_tagline' => ['value' => 'Trusted diagnostics. Accurate results. Right at your doorstep.', 'label' => 'Site Tagline (footer)', 'group' => 'General'],
            'site_logo' => ['value' => '', 'label' => 'Custom Logo URL (leave empty for default)', 'group' => 'General'],
            'years_experience' => ['value' => '10+', 'label' => 'Years of Experience (number, e.g. 10+)', 'group' => 'General'],

            'navbar_cta_label' => ['value' => 'Call Now', 'label' => 'Navbar CTA Button Text', 'group' => 'Navbar'],

            'footer_tagline' => ['value' => 'Your trusted partner for comprehensive medical services, diagnostics, and daycare.', 'label' => 'Footer Tagline', 'group' => 'Footer'],
            'footer_address_short' => ['value' => "123 Medical Hub Ave,\nDiagnostic Square, City, 110011", 'label' => 'Footer Address (short, 2 lines)', 'group' => 'Footer'],

            'about_page_badge' => ['value' => 'Our Story', 'label' => 'About Hero Badge', 'group' => 'About Page'],
            'about_page_heading' => ['value' => 'Built on Trust, Driven by Accuracy', 'label' => 'About Hero Heading', 'group' => 'About Page'],
            'about_page_subtext' => ['value' => 'Rohit Health Care is committed to delivering swift, accessible, and precise diagnostics to our community - with full NABL backing.', 'label' => 'About Hero Sub-text', 'group' => 'About Page'],
            'about_section_heading' => ['value' => 'The Right Diagnosis Changes Everything', 'label' => 'About Main Section Heading', 'group' => 'About Page'],
            'about_body_1' => ['value' => 'At Rohit Health Care, we understand that an accurate diagnosis is the cornerstone of effective medical treatment. That is why we have partnered to bring world-class, NABL-accredited diagnostic testing facilities right to your neighbourhood.', 'label' => 'About Body Paragraph 1', 'group' => 'About Page'],
            'about_body_2' => ['value' => 'Our modern collection centre is staffed by trained phlebotomists who prioritise your comfort and safety. Every sample is handled with utmost care, processed using precision technology, and reported with unparalleled accuracy - whether it is a routine blood test or a complex clinical profile.', 'label' => 'About Body Paragraph 2', 'group' => 'About Page'],
            'about_hero_bg' => ['value' => '', 'label' => 'About Hero Background Image URL (leave empty for default)', 'group' => 'About Page'],
            'about_image' => ['value' => '', 'label' => 'About Section Photo URL (leave empty for default)', 'group' => 'About Page'],
            'about_years_label' => ['value' => 'Years serving the community', 'label' => 'About Years Badge Label', 'group' => 'About Page'],
            'about_cta_title' => ['value' => 'Experience Care Like Never Before', 'label' => 'About CTA Heading', 'group' => 'About Page'],
            'about_cta_subtitle' => ['value' => 'Walk in today or arrange a home collection. Your health remains our top priority.', 'label' => 'About CTA Sub-text', 'group' => 'About Page'],

            'services_page_badge' => ['value' => 'Premium Diagnostics', 'label' => 'Services Page Badge', 'group' => 'Services Page'],
            'services_page_heading' => ['value' => 'Our Diagnostic Services', 'label' => 'Services Page Heading', 'group' => 'Services Page'],
            'services_page_subtext' => ['value' => 'Advanced technology, trained professionals, and a top-tier NABL-accredited network - delivering accurate results on time, every time.', 'label' => 'Services Page Sub-text', 'group' => 'Services Page'],
            'services_cta_heading' => ['value' => 'Need a specific test?', 'label' => 'Services CTA Heading', 'group' => 'Services Page'],
            'services_cta_subtext' => ['value' => 'We offer a vast catalog of advanced tests. Contact us directly to check availability and pricing for any test.', 'label' => 'Services CTA Sub-text', 'group' => 'Services Page'],

            'doctors_page_badge' => ['value' => 'Expert Professionals', 'label' => 'Doctors Page Badge', 'group' => 'Doctors Page'],
            'doctors_page_heading' => ['value' => 'Our Medical Team', 'label' => 'Doctors Page Heading', 'group' => 'Doctors Page'],
            'doctors_page_subtext' => ['value' => 'Dedicated specialists committed to providing the highest standard of healthcare and accurate diagnostics.', 'label' => 'Doctors Page Sub-text', 'group' => 'Doctors Page'],
            'doctors_cta_heading' => ['value' => 'Book a Consultation', 'label' => 'Doctors CTA Heading', 'group' => 'Doctors Page'],
            'doctors_cta_subtext' => ['value' => 'Our team is available 7 days a week. Walk in or call us to schedule at your convenience.', 'label' => 'Doctors CTA Sub-text', 'group' => 'Doctors Page'],

            'contact_page_badge' => ['value' => 'We are here for you', 'label' => 'Contact Page Badge', 'group' => 'Contact Page'],
            'contact_page_heading' => ['value' => 'Get in Touch', 'label' => 'Contact Page Heading', 'group' => 'Contact Page'],
            'contact_page_subtext' => ['value' => 'Reach out via phone, WhatsApp, or email. Our team is available 7 days a week to assist you.', 'label' => 'Contact Page Sub-text', 'group' => 'Contact Page'],
        ];
    }
}
