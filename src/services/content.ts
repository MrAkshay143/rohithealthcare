import { api } from './api';

export type FieldType = 'text' | 'toggle' | 'image' | 'pills';
export type ContentFieldDef = { value: string; label: string; group: string; type?: FieldType };

export const CONTENT_DEFAULTS: Record<string, ContentFieldDef> = {

  // ─── General ───────────────────────────────────────────────
  site_name:            { value: 'Rohit Health Care', label: 'Site / Brand Name', group: 'General' },
  site_tagline:         { value: 'Trusted diagnostics. Accurate results. Right at your doorstep.', label: 'Site Tagline', group: 'General' },
  site_logo:            { value: '', label: 'Custom Logo URL (leave empty for default)', group: 'General', type: 'image' },
  years_experience:     { value: '10+', label: 'Years of Experience', group: 'General' },
  google_maps_url:      { value: 'https://maps.app.goo.gl/Znro1u9tvL1zYNuB9', label: 'Google Maps Directions URL', group: 'General' },
  google_maps_embed:    { value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d839.8748787948425!2d86.21762830764052!3d23.09263661044418!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f5d9e094e2ca17%3A0x4a91deca3f7decf1!2sRohit%20Health%20Care!5e1!3m2!1sen!2sin!4v1774070592440!5m2!1sen!2sin', label: 'Google Maps Embed URL (iframe)', group: 'General' },
  youtube_url:          { value: 'http://www.youtube.com/@rohithealthcare', label: 'YouTube Channel URL', group: 'General' },
  facebook_url:         { value: 'https://www.facebook.com/p/Rohit-Health-Care-100092529805396/', label: 'Facebook Page URL', group: 'General' },

  // ─── Navbar ────────────────────────────────────────────────
  navbar_logo_desktop:   { value: 'true', label: 'Show Logo - Desktop', group: 'Navbar', type: 'toggle' },
  navbar_logo_mobile:    { value: 'true', label: 'Show Logo - Mobile', group: 'Navbar', type: 'toggle' },
  navbar_cta_label:      { value: 'Call Now', label: 'CTA Button Text', group: 'Navbar' },
  navbar_cta_desktop:    { value: 'true', label: 'Show CTA - Desktop', group: 'Navbar', type: 'toggle' },
  navbar_cta_mobile:     { value: 'true', label: 'Show CTA - Mobile', group: 'Navbar', type: 'toggle' },
  navbar_link_1_label:   { value: 'Home', label: 'Link 1 Label', group: 'Navbar' },
  navbar_link_1_desktop: { value: 'true', label: 'Link 1 - Desktop', group: 'Navbar', type: 'toggle' },
  navbar_link_1_mobile:  { value: 'true', label: 'Link 1 - Mobile', group: 'Navbar', type: 'toggle' },
  navbar_link_2_label:   { value: 'About', label: 'Link 2 Label', group: 'Navbar' },
  navbar_link_2_desktop: { value: 'true', label: 'Link 2 - Desktop', group: 'Navbar', type: 'toggle' },
  navbar_link_2_mobile:  { value: 'true', label: 'Link 2 - Mobile', group: 'Navbar', type: 'toggle' },
  navbar_link_3_label:   { value: 'Our Team', label: 'Link 3 Label', group: 'Navbar' },
  navbar_link_3_desktop: { value: 'true', label: 'Link 3 - Desktop', group: 'Navbar', type: 'toggle' },
  navbar_link_3_mobile:  { value: 'true', label: 'Link 3 - Mobile', group: 'Navbar', type: 'toggle' },
  navbar_link_4_label:   { value: 'Services', label: 'Link 4 Label', group: 'Navbar' },
  navbar_link_4_desktop: { value: 'true', label: 'Link 4 - Desktop', group: 'Navbar', type: 'toggle' },
  navbar_link_4_mobile:  { value: 'true', label: 'Link 4 - Mobile', group: 'Navbar', type: 'toggle' },
  navbar_link_5_label:   { value: 'Gallery', label: 'Link 5 Label', group: 'Navbar' },
  navbar_link_5_desktop: { value: 'true', label: 'Link 5 - Desktop', group: 'Navbar', type: 'toggle' },
  navbar_link_5_mobile:  { value: 'true', label: 'Link 5 - Mobile', group: 'Navbar', type: 'toggle' },
  navbar_link_6_label:   { value: 'News & Camps', label: 'Link 6 Label', group: 'Navbar' },
  navbar_link_6_desktop: { value: 'true', label: 'Link 6 - Desktop', group: 'Navbar', type: 'toggle' },
  navbar_link_6_mobile:  { value: 'true', label: 'Link 6 - Mobile', group: 'Navbar', type: 'toggle' },
  navbar_link_7_label:   { value: 'Contact', label: 'Link 7 Label', group: 'Navbar' },
  navbar_link_7_desktop: { value: 'true', label: 'Link 7 - Desktop', group: 'Navbar', type: 'toggle' },
  navbar_link_7_mobile:  { value: 'true', label: 'Link 7 - Mobile', group: 'Navbar', type: 'toggle' },

  // ─── Footer ────────────────────────────────────────────────
  footer_tagline:            { value: 'Your trusted partner for comprehensive medical services, diagnostics, and daycare.', label: 'Footer Tagline', group: 'Footer' },
  footer_address_short:      { value: '123 Medical Hub Ave,\nDiagnostic Square, City, 110011', label: 'Footer Address (short)', group: 'Footer' },
  footer_logo_desktop:       { value: 'true', label: 'Show Logo - Desktop', group: 'Footer', type: 'toggle' },
  footer_logo_mobile:        { value: 'true', label: 'Show Logo - Mobile', group: 'Footer', type: 'toggle' },
  footer_quicklinks_heading: { value: 'Quick Links', label: 'Quick Links Section Title', group: 'Footer' },
  footer_quicklinks_desktop: { value: 'true', label: 'Quick Links - Desktop', group: 'Footer', type: 'toggle' },
  footer_quicklinks_mobile:  { value: 'true', label: 'Quick Links - Mobile', group: 'Footer', type: 'toggle' },
  footer_link_1_label:       { value: 'Home', label: 'Quick Link 1', group: 'Footer' },
  footer_link_1_visible:     { value: 'true', label: 'Quick Link 1 Visible', group: 'Footer', type: 'toggle' },
  footer_link_2_label:       { value: 'Medical Team', label: 'Quick Link 2', group: 'Footer' },
  footer_link_2_visible:     { value: 'true', label: 'Quick Link 2 Visible', group: 'Footer', type: 'toggle' },
  footer_link_3_label:       { value: 'Gallery', label: 'Quick Link 3', group: 'Footer' },
  footer_link_3_visible:     { value: 'true', label: 'Quick Link 3 Visible', group: 'Footer', type: 'toggle' },
  footer_link_4_label:       { value: 'News & Camps', label: 'Quick Link 4', group: 'Footer' },
  footer_link_4_visible:     { value: 'true', label: 'Quick Link 4 Visible', group: 'Footer', type: 'toggle' },
  footer_link_5_label:       { value: 'About Us', label: 'Quick Link 5', group: 'Footer' },
  footer_link_5_visible:     { value: 'true', label: 'Quick Link 5 Visible', group: 'Footer', type: 'toggle' },
  footer_link_6_label:       { value: 'Services', label: 'Quick Link 6', group: 'Footer' },
  footer_link_6_visible:     { value: 'true', label: 'Quick Link 6 Visible', group: 'Footer', type: 'toggle' },
  footer_link_7_label:       { value: 'Contact', label: 'Quick Link 7', group: 'Footer' },
  footer_link_7_visible:     { value: 'true', label: 'Quick Link 7 Visible', group: 'Footer', type: 'toggle' },
  footer_contact_heading:    { value: 'Get in Touch', label: 'Contact Section Title', group: 'Footer' },
  footer_contact_desktop:    { value: 'true', label: 'Contact - Desktop', group: 'Footer', type: 'toggle' },
  footer_contact_mobile:     { value: 'true', label: 'Contact - Mobile', group: 'Footer', type: 'toggle' },
  footer_call_label:         { value: 'Call Us', label: 'Call Label', group: 'Footer' },
  footer_email_label:        { value: 'Email', label: 'Email Label', group: 'Footer' },
  footer_location_label:     { value: 'Location', label: 'Location Label', group: 'Footer' },
  footer_hours_heading:      { value: 'Operating Hours', label: 'Hours Section Title', group: 'Footer' },
  footer_hours_desktop:      { value: 'true', label: 'Hours - Desktop', group: 'Footer', type: 'toggle' },
  footer_hours_mobile:       { value: 'true', label: 'Hours - Mobile', group: 'Footer', type: 'toggle' },
  footer_social_whatsapp:    { value: 'true', label: 'Show WhatsApp Icon', group: 'Footer', type: 'toggle' },
  footer_social_phone:       { value: 'true', label: 'Show Phone Icon', group: 'Footer', type: 'toggle' },
  footer_social_youtube:     { value: 'true', label: 'Show YouTube Icon', group: 'Footer', type: 'toggle' },
  footer_social_facebook:    { value: 'true', label: 'Show Facebook Icon', group: 'Footer', type: 'toggle' },
  footer_copyright:          { value: 'All rights reserved.', label: 'Copyright Text', group: 'Footer' },
  footer_credit:             { value: 'Designed with care for the community.', label: 'Credit Line', group: 'Footer' },

  // ─── Floating Buttons ─────────────────────────────────────
  floating_whatsapp_visible: { value: 'true', label: 'Show WhatsApp Button', group: 'Floating Buttons', type: 'toggle' },
  floating_phone_visible:    { value: 'true', label: 'Show Phone Button', group: 'Floating Buttons', type: 'toggle' },
  floating_phone_number:     { value: '', label: 'Phone Number (leave blank to use Contact Phone)', group: 'Floating Buttons' },
  floating_whatsapp_number:  { value: '', label: 'WhatsApp Number (leave blank to use Contact WhatsApp)', group: 'Floating Buttons' },

  // ─── Hero Section ─────────────────────────────────────────
  hero_badge:          { value: 'Associated with Apollo Diagnostics', label: 'Hero Badge Text', group: 'Hero Section' },
  hero_heading:        { value: 'Accurate Diagnostics.', label: 'Hero Main Heading', group: 'Hero Section' },
  hero_accent:         { value: 'Trusted Care.', label: 'Hero Accent (red) Text', group: 'Hero Section' },
  hero_subtext:        { value: 'Your trusted partner for accurate diagnostics and home sample collection. Fast, reliable and right at your doorstep.', label: 'Hero Sub-text', group: 'Hero Section' },
  hero_btn_call:       { value: 'Call Us Now', label: 'Hero Call Button Label', group: 'Hero Section' },
  hero_btn_directions: { value: 'Directions', label: 'Hero Directions Button Label', group: 'Hero Section' },
  hero_pills:          { value: 'NABL Accredited, Same Day Reports, Home Collection, 10+ Years', label: 'Hero Trust Pills (comma-separated)', group: 'Hero Section', type: 'pills' },

  // ─── Stats Strip ──────────────────────────────────────────
  stat_1_value: { value: '50,000+', label: 'Stat 1 - Number', group: 'Stats Strip' },
  stat_1_label: { value: 'Happy Patients', label: 'Stat 1 - Label', group: 'Stats Strip' },
  stat_2_value: { value: '3,000+', label: 'Stat 2 - Number', group: 'Stats Strip' },
  stat_2_label: { value: 'Diagnostic Tests', label: 'Stat 2 - Label', group: 'Stats Strip' },
  stat_3_label: { value: 'Years of Service', label: 'Stat 3 - Label', group: 'Stats Strip' },
  stat_4_value: { value: '100%', label: 'Stat 4 - Number', group: 'Stats Strip' },
  stat_4_label: { value: 'Same-Day Reports', label: 'Stat 4 - Label', group: 'Stats Strip' },

  // ─── Home Services ────────────────────────────────────────
  home_services_badge:   { value: 'What We Offer', label: 'Section Badge', group: 'Home Services' },
  home_services_heading: { value: 'Comprehensive Diagnostic Services', label: 'Section Heading', group: 'Home Services' },
  home_services_subtext: { value: 'Cutting-edge technology and skilled professionals - all under one roof.', label: 'Section Sub-text', group: 'Home Services' },
  home_services_visible: { value: 'true', label: 'Show Section', group: 'Home Services', type: 'toggle' },
  home_services_btn:     { value: 'View All Services', label: 'View All Button', group: 'Home Services' },

  // ─── Home Why Us ──────────────────────────────────────────
  home_whyus_visible:    { value: 'true', label: 'Show Section', group: 'Home Why Us', type: 'toggle' },
  home_whyus_badge:      { value: 'Why Choose Us', label: 'Section Badge', group: 'Home Why Us' },
  home_whyus_heading:    { value: 'Precision You Can', label: 'Heading (white)', group: 'Home Why Us' },
  home_whyus_accent:     { value: 'Trust Every Time', label: 'Heading Accent (red)', group: 'Home Why Us' },
  home_whyus_items:      { value: 'NABL Accredited Laboratory, Same-day digital reports via WhatsApp, Experienced & trained phlebotomists, Hygienic safe and clean environment, Confidential patient data always', label: 'Checklist Items (comma-separated)', group: 'Home Why Us', type: 'pills' },
  home_whyus_btn1_label: { value: 'About Us', label: 'Button 1 Label', group: 'Home Why Us' },
  home_whyus_btn2_label: { value: 'Our Services', label: 'Button 2 Label', group: 'Home Why Us' },
  home_whyus_image:      { value: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1000', label: 'Section Image URL', group: 'Home Why Us', type: 'image' },

  // ─── Home Team ────────────────────────────────────────────
  home_team_visible: { value: 'true', label: 'Show Section', group: 'Home Team', type: 'toggle' },
  home_team_badge:   { value: 'Expert Doctors', label: 'Section Badge', group: 'Home Team' },
  home_team_heading: { value: 'Our Medical Team', label: 'Section Heading', group: 'Home Team' },
  home_team_link:    { value: 'Meet All Doctors', label: 'View All Link Text', group: 'Home Team' },

  // ─── Home Blog ────────────────────────────────────────────
  home_blog_visible:   { value: 'true', label: 'Show Section', group: 'Home Blog', type: 'toggle' },
  home_blog_badge:     { value: 'Latest Updates', label: 'Section Badge', group: 'Home Blog' },
  home_blog_heading:   { value: 'News & Health Camps', label: 'Section Heading', group: 'Home Blog' },
  home_blog_link:      { value: 'All Posts', label: 'View All Link Text', group: 'Home Blog' },
  home_blog_read_more: { value: 'Read More', label: 'Read More Link', group: 'Home Blog' },

  // ─── CTA Section ──────────────────────────────────────────
  cta_visible:     { value: 'true', label: 'Show CTA Section', group: 'CTA Section', type: 'toggle' },
  cta_title:       { value: 'Ready to prioritise your health?', label: 'CTA Title', group: 'CTA Section' },
  cta_subtitle:    { value: 'Walk in, call, or send a WhatsApp. We are open 7 days a week.', label: 'CTA Sub-text', group: 'CTA Section' },
  cta_btn_call:    { value: 'Call Now', label: 'CTA Call Button', group: 'CTA Section' },
  cta_btn_inquiry: { value: 'Send an Inquiry', label: 'CTA Inquiry Button', group: 'CTA Section' },

  // ─── Contact Info ─────────────────────────────────────────
  contact_phone:         { value: '8597215824', label: 'Phone (digits only, no +91)', group: 'Contact Info' },
  contact_phone_display: { value: '+91 85972 15824', label: 'Phone Display Text', group: 'Contact Info' },
  contact_whatsapp:      { value: '918597215824', label: 'WhatsApp (with country code)', group: 'Contact Info' },
  contact_email:         { value: 'rohithealthcare1@gmail.com', label: 'Email Address', group: 'Contact Info' },
  contact_address:       { value: 'Masjid Road, Balarampur, West Bengal, India', label: 'Clinic Address (full)', group: 'Contact Info' },
  contact_hours_weekday: { value: 'Mon–Sat: 7:00 AM – 9:00 PM', label: 'Weekday Hours', group: 'Contact Info' },
  contact_hours_sunday:  { value: 'Sunday: 7:00 AM – 2:00 PM', label: 'Sunday Hours', group: 'Contact Info' },

  // ─── About Page ───────────────────────────────────────────
  about_page_badge:       { value: 'Our Story', label: 'Hero Badge', group: 'About Page' },
  about_page_heading:     { value: 'Built on Trust, Driven by Accuracy', label: 'Hero Heading', group: 'About Page' },
  about_page_subtext:     { value: 'Rohit Health Care is committed to delivering swift, accessible, and precise diagnostics to our community - with full NABL backing.', label: 'Hero Sub-text', group: 'About Page' },
  about_excellence_badge: { value: 'Committed to Excellence', label: 'Content Section Badge', group: 'About Page' },
  about_section_heading:  { value: 'The Right Diagnosis Changes Everything', label: 'Content Heading', group: 'About Page' },
  about_body_1:           { value: 'At Rohit Health Care, we understand that an accurate diagnosis is the cornerstone of effective medical treatment. That is why we have partnered to bring world-class, NABL-accredited diagnostic testing facilities right to your neighbourhood.', label: 'Body Paragraph 1', group: 'About Page' },
  about_body_2:           { value: 'Our modern collection centre is staffed by trained phlebotomists who prioritise your comfort and safety. Every sample is handled with utmost care, processed using precision technology, and reported with unparalleled accuracy - whether it is a routine blood test or a complex clinical profile.', label: 'Body Paragraph 2', group: 'About Page' },
  about_hero_bg:          { value: '', label: 'Hero Background Image URL', group: 'About Page', type: 'image' },
  about_image:            { value: '', label: 'Section Photo URL', group: 'About Page', type: 'image' },
  about_years_label:      { value: 'Years serving the community', label: 'Years Badge Label', group: 'About Page' },

  // ─── About Highlights ─────────────────────────────────────
  about_hl_1_label: { value: 'NABL Accredited', label: 'Highlight 1 Label', group: 'About Highlights' },
  about_hl_1_desc:  { value: 'National quality standards on every report.', label: 'Highlight 1 Desc', group: 'About Highlights' },
  about_hl_2_label: { value: 'Trusted Partner', label: 'Highlight 2 Label', group: 'About Highlights' },
  about_hl_2_desc:  { value: "Part of India's most trusted diagnostic brand.", label: 'Highlight 2 Desc', group: 'About Highlights' },
  about_hl_3_label: { value: '3,000+ Tests', label: 'Highlight 3 Label', group: 'About Highlights' },
  about_hl_3_desc:  { value: 'Comprehensive catalog of assays and profiles.', label: 'Highlight 3 Desc', group: 'About Highlights' },
  about_hl_4_label: { value: '50,000+ Patients', label: 'Highlight 4 Label', group: 'About Highlights' },
  about_hl_4_desc:  { value: 'Trusted by families across the community.', label: 'Highlight 4 Desc', group: 'About Highlights' },
  about_hl_5_label: { value: 'Same-Day Reports', label: 'Highlight 5 Label', group: 'About Highlights' },
  about_hl_5_desc:  { value: 'Fast turnaround so you never wait for clarity.', label: 'Highlight 5 Desc', group: 'About Highlights' },

  // ─── About Why Us ─────────────────────────────────────────
  about_whyus_heading: { value: 'Why Rohit Health Care?', label: 'Section Heading', group: 'About Why Us' },
  about_whyus_items:   { value: 'NABL Accredited testing, 100% data confidentiality and secure digital reports, Minimum waiting time - walk-in friendly, Home sample collection at your schedule, Hygienic sterile and modern collection facility', label: 'Checklist (comma-separated)', group: 'About Why Us', type: 'pills' },
  about_cta_title:     { value: 'Experience Care Like Never Before', label: 'CTA Heading', group: 'About Why Us' },
  about_cta_subtitle:  { value: 'Walk in today or arrange a home collection. Your health remains our top priority.', label: 'CTA Sub-text', group: 'About Why Us' },
  about_cta_btn:       { value: 'Get in Touch', label: 'CTA Button Label', group: 'About Why Us' },

  // ─── Services Page ────────────────────────────────────────
  services_page_badge:   { value: 'Premium Diagnostics', label: 'Page Badge', group: 'Services Page' },
  services_page_heading: { value: 'Our Diagnostic Services', label: 'Page Heading', group: 'Services Page' },
  services_page_subtext: { value: 'Advanced technology, trained professionals, and a top-tier NABL-accredited network - delivering accurate results on time, every time.', label: 'Page Sub-text', group: 'Services Page' },

  // ─── Services CTA ─────────────────────────────────────────
  services_cta_heading:      { value: 'Need a specific test?', label: 'CTA Heading', group: 'Services CTA' },
  services_cta_subtext:      { value: 'We offer a vast catalog of advanced tests. Contact us directly to check availability and pricing for any test.', label: 'CTA Sub-text', group: 'Services CTA' },
  services_cta_btn_call:     { value: 'Call Now', label: 'Call Button', group: 'Services CTA' },
  services_cta_btn_whatsapp: { value: 'WhatsApp', label: 'WhatsApp Button', group: 'Services CTA' },
  services_cta_btn_book:     { value: 'Book Appointment', label: 'Book Button', group: 'Services CTA' },

  // ─── Doctors Page ─────────────────────────────────────────
  doctors_page_badge:       { value: 'Expert Professionals', label: 'Page Badge', group: 'Doctors Page' },
  doctors_page_heading:     { value: 'Our Medical Team', label: 'Page Heading', group: 'Doctors Page' },
  doctors_page_subtext:     { value: 'Dedicated specialists committed to providing the highest standard of healthcare and accurate diagnostics.', label: 'Page Sub-text', group: 'Doctors Page' },
  doctors_empty_text:       { value: 'No doctors found. Add some from the admin panel.', label: 'Empty State Text', group: 'Doctors Page' },
  doctors_cta_heading:      { value: 'Book a Consultation', label: 'CTA Heading', group: 'Doctors Page' },
  doctors_cta_subtext:      { value: 'Our team is available 7 days a week. Walk in or call us to schedule at your convenience.', label: 'CTA Sub-text', group: 'Doctors Page' },
  doctors_cta_btn_call:     { value: 'Call Now', label: 'CTA Call Button', group: 'Doctors Page' },
  doctors_cta_btn_whatsapp: { value: 'WhatsApp', label: 'CTA WhatsApp Button', group: 'Doctors Page' },
  doctors_cta_btn_message:  { value: 'Send a Message', label: 'CTA Message Button', group: 'Doctors Page' },

  // ─── Contact Page ─────────────────────────────────────────
  contact_page_badge:    { value: 'We are here for you', label: 'Page Badge', group: 'Contact Page' },
  contact_page_heading:  { value: 'Get in Touch', label: 'Page Heading', group: 'Contact Page' },
  contact_page_subtext:  { value: 'Reach out via phone, WhatsApp, or email. Our team is available 7 days a week to assist you.', label: 'Page Sub-text', group: 'Contact Page' },
  contact_btn_call:      { value: 'Call Now', label: 'Call Button', group: 'Contact Page' },
  contact_btn_whatsapp:  { value: 'WhatsApp', label: 'WhatsApp Button', group: 'Contact Page' },
  contact_whatsapp_sub:  { value: 'Chat instantly', label: 'WhatsApp Sub-text', group: 'Contact Page' },
  contact_visit_label:   { value: 'Visit Our Clinic', label: 'Address Card Title', group: 'Contact Page' },
  contact_email_label:   { value: 'Email Us', label: 'Email Card Title', group: 'Contact Page' },
  contact_hours_label:   { value: 'Operating Hours', label: 'Hours Card Title', group: 'Contact Page' },

  // ─── Contact Form ─────────────────────────────────────────
  form_heading:             { value: 'Send an Inquiry', label: 'Form Heading', group: 'Contact Form' },
  form_subtext:             { value: 'We typically respond within a few hours', label: 'Form Sub-text', group: 'Contact Form' },
  form_name_label:          { value: 'Full Name', label: 'Name Label', group: 'Contact Form' },
  form_name_placeholder:    { value: 'e.g. Rahul Sharma', label: 'Name Placeholder', group: 'Contact Form' },
  form_phone_label:         { value: 'Phone Number', label: 'Phone Label', group: 'Contact Form' },
  form_phone_placeholder:   { value: '+91 98765 43210', label: 'Phone Placeholder', group: 'Contact Form' },
  form_message_label:       { value: 'Message or Query', label: 'Message Label', group: 'Contact Form' },
  form_message_placeholder: { value: 'I would like to know more about…', label: 'Message Placeholder', group: 'Contact Form' },
  form_email_label:          { value: 'Email', label: 'Email Label', group: 'Contact Form' },
  form_email_placeholder:    { value: 'your@email.com', label: 'Email Placeholder', group: 'Contact Form' },
  form_submit_label:        { value: 'Send Message', label: 'Submit Button', group: 'Contact Form' },
  form_consent_text:        { value: 'By submitting you agree to be contacted via phone or WhatsApp.', label: 'Consent Text', group: 'Contact Form' },
  form_success_title:       { value: 'Message Received!', label: 'Success Title', group: 'Contact Form' },
  form_success_text:        { value: 'Thank you for reaching out. Our team will get back to you shortly via phone or WhatsApp.', label: 'Success Message', group: 'Contact Form' },
  form_success_again:       { value: 'Send another message →', label: 'Send Again Link', group: 'Contact Form' },

  // ─── Blogs Page ───────────────────────────────────────────
  blogs_page_badge:    { value: 'Stay Informed', label: 'Page Badge', group: 'Blogs Page' },
  blogs_page_heading:  { value: 'News & Health Camps', label: 'Page Heading', group: 'Blogs Page' },
  blogs_page_subtext:  { value: 'Updates on free outdoor checkup camps, community events, and medical advice.', label: 'Page Sub-text', group: 'Blogs Page' },
  blogs_empty_title:   { value: 'No updates yet', label: 'Empty Title', group: 'Blogs Page' },
  blogs_empty_subtext: { value: 'Check back soon for news and health camp announcements.', label: 'Empty Text', group: 'Blogs Page' },
  blogs_read_more:     { value: 'Read More', label: 'Read More Link', group: 'Blogs Page' },
  blogs_back_link:     { value: 'Back to News', label: 'Back Link', group: 'Blogs Page' },
  blogs_all_link:      { value: 'All News', label: 'All News Button', group: 'Blogs Page' },
  blogs_share_btn:     { value: 'Share on WhatsApp', label: 'Share Button', group: 'Blogs Page' },
  blogs_notfound:      { value: 'Post not found', label: 'Not Found Text', group: 'Blogs Page' },
  blogs_cta_heading:   { value: 'Have a health concern?', label: 'CTA Heading', group: 'Blogs Page' },
  blogs_cta_subtext:   { value: 'Our team is ready to help you today.', label: 'CTA Sub-text', group: 'Blogs Page' },
  blogs_cta_btn:       { value: 'Call Us Now', label: 'CTA Button', group: 'Blogs Page' },

  // ─── Gallery Page ─────────────────────────────────────────
  gallery_page_badge:    { value: 'Our Facility & Events', label: 'Page Badge', group: 'Gallery Page' },
  gallery_page_heading:  { value: 'Photo Gallery', label: 'Page Heading', group: 'Gallery Page' },
  gallery_page_subtext:  { value: 'A glimpse into our modern diagnostics center and community health camps.', label: 'Page Sub-text', group: 'Gallery Page' },
  gallery_empty_title:   { value: 'No photos yet', label: 'Empty Title', group: 'Gallery Page' },
  gallery_empty_subtext: { value: 'Check back soon for updates from our events and facility.', label: 'Empty Text', group: 'Gallery Page' },

  // ─── Doctor Card ──────────────────────────────────────────
  doctor_default_qual: { value: 'MBBS', label: 'Default Qualification', group: 'Doctor Card' },
  doctor_availability: { value: 'Available', label: 'Availability Label', group: 'Doctor Card' },

  // ─── 404 Page ─────────────────────────────────────────────
  notfound_heading:     { value: 'Page Not Found', label: 'Heading', group: '404 Page' },
  notfound_text:        { value: "Sorry, the page you're looking for doesn't exist or may have been moved. Let us help you find your way back.", label: 'Message', group: '404 Page' },
  notfound_home_btn:    { value: 'Back to Home', label: 'Home Button', group: '404 Page' },
  notfound_call_btn:    { value: 'Call Us', label: 'Call Button', group: '404 Page' },
  notfound_links_label: { value: 'Quick Links', label: 'Links Section Label', group: '404 Page' },
};

// ─── Helpers ─────────────────────────────────────────────────
export function isToggleField(key: string): boolean {
  return CONTENT_DEFAULTS[key]?.type === 'toggle';
}
export function isTrueValue(val: string | undefined): boolean {
  return val !== 'false' && val !== '0' && val !== '';
}

export const SEO_PAGES = [
  { key: 'home',     label: 'Home' },
  { key: 'about',    label: 'About' },
  { key: 'services', label: 'Services' },
  { key: 'doctors',  label: 'Doctors' },
  { key: 'gallery',  label: 'Gallery' },
  { key: 'blogs',    label: 'Blogs' },
  { key: 'contact',  label: 'Contact' },
] as const;

export type SeoPageKey = (typeof SEO_PAGES)[number]['key'];

export function getSeoKey(page: SeoPageKey, field: 'title' | 'description' | 'keywords') {
  return `seo_${page}_${field}`;
}

export async function getSiteContent(): Promise<Record<string, string>> {
  const merged: Record<string, string> = {};
  for (const key of Object.keys(CONTENT_DEFAULTS)) {
    merged[key] = CONTENT_DEFAULTS[key].value;
  }
  try {
    const [dbValues, settingsArr] = await Promise.all([
      api.get<Record<string, string>>('/content'),
      api.get<Array<{ key: string; value: string }>>('/settings'),
    ]);
    for (const [key, value] of Object.entries(dbValues)) {
      if (value !== undefined) merged[key] = value;
    }
    for (const item of settingsArr) {
      if (item.value) merged[item.key] = item.value;
    }
  } catch { /* defaults already set */ }
  return merged;
}

