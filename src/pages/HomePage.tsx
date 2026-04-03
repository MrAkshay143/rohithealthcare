import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, PhoneCall, MapPin,
  CheckCircle, HeartPulse, Microscope,
  FlaskConical, Syringe, BadgeCheck, Zap,
  ChevronRight, Activity, Droplet, TestTube, Stethoscope,
  Heart, Brain, Bone, Baby, Pill, Thermometer, Scan,
  Cross, ShieldPlus, Ear, Eye as EyeIcon,
  Dna, Radiation, Bandage, CircleDot, Sparkles, Waves,
  Flame, Wind, Gauge, Beaker, Briefcase,
} from "lucide-react";
import { useContent } from "@/hooks/useContent";
import { useHomeBundle } from "@/hooks/useContent";
import { useSEO } from "@/hooks/useSEO";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { isTrueValue } from "@/services/content";
import { HeroSlider } from "@/components/HeroSlider";
import { DoctorCard } from "@/components/DoctorCard";

const ICON_MAP: Record<string, any> = {
  Activity, Droplet, TestTube, Microscope, HeartPulse, Stethoscope,
  Heart, Brain, Bone, Baby, Pill, Syringe, Thermometer, Scan,
  Cross, ShieldPlus, Zap, Ear, Eye: EyeIcon, Dna, Radiation,
  Bandage, CircleDot, Sparkles, Waves, Flame, Wind, Gauge, Beaker, Briefcase,
  FlaskConical, BadgeCheck,
};
const SVC_STYLES = [
  { color: "text-[#4e66b3]", bg: "bg-[#4e66b3]/10", hoverBg: "group-hover:bg-[#4e66b3]" },
  { color: "text-rose-600",  bg: "bg-rose-50",      hoverBg: "group-hover:bg-rose-600" },
  { color: "text-blue-600",  bg: "bg-blue-50",      hoverBg: "group-hover:bg-blue-600" },
  { color: "text-amber-600", bg: "bg-amber-50",     hoverBg: "group-hover:bg-amber-600" },
  { color: "text-purple-600",bg: "bg-purple-50",    hoverBg: "group-hover:bg-purple-600" },
  { color: "text-emerald-600",bg: "bg-emerald-50",  hoverBg: "group-hover:bg-emerald-600" },
];

export default function HomePage() {
  const content = useContent();
  const bundle = useHomeBundle();
  useSEO('home');
  const reveal = useScrollReveal();

  const doctors = Array.isArray(bundle?.doctors) ? bundle.doctors : [];
  const recentBlogs = Array.isArray(bundle?.blogs) ? bundle.blogs : [];
  const heroSlides = Array.isArray(bundle?.heroSlides) ? bundle.heroSlides : [];
  const apiServices = Array.isArray(bundle?.services) ? bundle.services : [];

  const services = useMemo(() =>
    apiServices.map((svc, i) => ({
      icon: ICON_MAP[svc.icon] || Activity,
      ...SVC_STYLES[i % SVC_STYLES.length],
      title: svc.title,
      desc: svc.description,
      href: '/services',
    }))
  , [apiServices]);

  // Format stat values: mobile shows "50k +", desktop shows "50,000 +"
  const formatStatValue = (value: string | number) => {
    if (!value) return '0 +';
    const str = String(value).trim();
    const num = parseInt(str.replace(/[^0-9]/g, ''), 10);
    if (isNaN(num)) return str + ' +';
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      // Mobile: short format (k) with +
      if (num >= 1000) return (num / 1000).toFixed(0) + 'k +';
      return num.toString() + ' +';
    }
    // Desktop/Tablet: formatted with commas and +
    return num.toLocaleString() + ' +';
  };

  const [displayMode, setDisplayMode] = useState<'mobile' | 'desktop'>(
    typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop'
  );

  useEffect(() => {
    const handleResize = () => {
      setDisplayMode(window.innerWidth < 768 ? 'mobile' : 'desktop');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const whyUsItems = useMemo(() =>
    (content['home_whyus_items'] || '').split(',').map((s: string) => s.trim()).filter(Boolean)
  , [content]);

  const stats = [
    { label: content['stat_1_label'], value: content['stat_1_value'] },
    { label: content['stat_2_label'], value: content['stat_2_value'] },
    { label: content['stat_3_label'], value: content['stat_3_value'] || content['years_experience'] || '5+' },
    { label: content['stat_4_label'], value: content['stat_4_value'] },
  ];

  return (
    <>
      {/* =========== HERO =========== */}
      <section className="relative isolate overflow-hidden bg-linear-to-br from-[#3d5099] via-[#4e66b3] to-[#6070c9] min-h-[28vh] md:min-h-[32vh] lg:min-h-[80vh] flex flex-col">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-150 h-150 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-[#A62B2B]/10 blur-2xl" />
        </div>

        <div className="relative grid md:grid-cols-[2fr_3fr] flex-1">
        {/* Left text */}
          <div className="flex items-center py-4 sm:py-6 lg:py-14 pl-4 sm:pl-10 lg:pl-20 xl:pl-24 pr-4 sm:pr-6 lg:pr-10 z-10">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/90 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#A62B2B] animate-pulse" />
                {content['hero_badge']}
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight mb-2">
                <span className="whitespace-nowrap">{content['hero_heading']}</span>
                <br />
                <span className="text-[#f87171] whitespace-nowrap">{content['hero_accent']}</span>
              </h1>

              <p className="text-sm sm:text-base text-white/75 mb-5 leading-relaxed">
                {content['hero_subtext']}
              </p>

              {/* Mini trust pills */}
              <div className="flex flex-wrap gap-2 mb-5">
                {(content['hero_pills'] || '')
                  .split(',')
                  .map((p: string) => p.trim())
                  .filter(Boolean)
                  .map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1 text-xs font-medium text-white/80">
                    <CheckCircle className="w-3 h-3 text-emerald-300 shrink-0" />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                <a href={`tel:+${content['contact_phone'] || ''}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg sm:rounded-xl bg-[#A62B2B] px-4 sm:px-7 py-2 sm:py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-[#A62B2B]/30 hover:bg-[#811e1e] transition-all hover:scale-[1.02] active:scale-95">
                  <PhoneCall className="h-3.5 sm:h-4 w-3.5 sm:w-4" /> {content['hero_btn_call']}
                </a>
                <a href={content['google_maps_url'] || ''} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg sm:rounded-xl bg-white/15 border border-white/25 backdrop-blur-sm px-4 sm:px-7 py-2 sm:py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-white/25 transition-all active:scale-95">
                  <MapPin className="h-3.5 sm:h-4 w-3.5 sm:w-4" /> {content['hero_btn_directions']}
                </a>
              </div>
            </div>
          </div>

          {/* Right: image slider fills the 60% column */}
          <HeroSlider slides={heroSlides} />
        </div>

      </section>

      {/* =========== STATS =========== */}
      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
          <div className="grid grid-cols-4 divide-x divide-gray-100">
            {stats.map((s, i) => (
              <div key={s.label} ref={reveal(i * 100)} className="flex flex-col items-center justify-center py-2.5 sm:py-3 px-1 sm:px-2 text-center">
                <span className="text-sm sm:text-base lg:text-lg font-bold text-[#4e66b3]">{displayMode === 'mobile' ? formatStatValue(s.value) : formatStatValue(s.value)}</span>
                <span className="mt-0.5 sm:mt-1 text-[8px] sm:text-[9px] lg:text-[10px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========== SERVICES =========== */}
      {isTrueValue(content['home_services_visible']) && (
      <section className="py-10 sm:py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div ref={reveal()} className="text-center mb-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#A62B2B] mb-2">{content['home_services_badge'] || 'What We Offer'}</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight whitespace-nowrap">{content['home_services_heading'] || 'Comprehensive Diagnostic Services'}</h2>
            <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-2xl mx-auto">
              {content['home_services_subtext'] || 'Cutting-edge technology and skilled professionals - all under one roof.'}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 justify-items-center">
            {services.slice(0, 4).map((svc, i) => {
              const Icon = svc.icon;
              return (
                <Link key={svc.title} to={svc.href} ref={reveal((i + 1) * 100)}
                  className={`group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex-col h-full w-full max-w-90 ${i === 0 ? 'flex' : i === 1 ? 'flex' : i === 2 ? 'hidden md:flex' : 'hidden lg:flex'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-12 w-12 rounded-xl ${svc.bg} flex items-center justify-center ${svc.hoverBg} transition-colors duration-200`}>
                      <Icon className={`h-6 w-6 ${svc.color} group-hover:text-white transition-colors duration-200`} />
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{svc.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed grow">{svc.desc}</p>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link to="/services" className="inline-flex items-center gap-2 rounded-xl border-2 border-[#4e66b3] px-7 py-3 text-sm font-bold text-[#4e66b3] hover:bg-[#4e66b3] hover:text-white transition-all">
              {content['home_services_btn'] || 'View All Services'} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* =========== WHY US =========== */}
      {isTrueValue(content['home_whyus_visible']) && (
      <section className="py-8 sm:py-14 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div ref={reveal()} className="rounded-2xl overflow-hidden bg-gray-900 shadow-xl">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#f87171] mb-3">{content['home_whyus_badge'] || 'Why Choose Us'}</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-5 leading-tight">
                  {content['home_whyus_heading'] || 'Precision You Can'}<br /><span className="text-[#f87171]">{content['home_whyus_accent'] || 'Trust Every Time'}</span>
                </h2>
                <ul className="space-y-3 mb-8">
                  {whyUsItems.map((pt: string) => (
                    <li key={pt} className="flex items-start gap-3 text-gray-300 text-sm">
                      <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3">
                  <Link to="/about"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
                    {content['home_whyus_btn1_label'] || 'About Us'} <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/services"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#A62B2B] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#811e1e] transition-colors">
                    {content['home_whyus_btn2_label'] || 'Our Services'}
                  </Link>
                </div>
              </div>
              <div className="min-h-52 md:min-h-[300px] lg:min-h-auto bg-cover bg-center"
                style={{ backgroundImage: `url('${content['home_whyus_image'] || '/uploads/clinic_building_transparent.png'}')` }} />
            </div>
          </div>
        </div>
      </section>
      )}

      {/* =========== OUR TEAM =========== */}
      {doctors.length > 0 && isTrueValue(content['home_team_visible']) && (
        <section className="py-8 sm:py-14 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div ref={reveal()} className="flex items-center justify-between mb-8">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#A62B2B] mb-2">{content['home_team_badge'] || 'Expert Doctors'}</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{content['home_team_heading'] || 'Our Medical Team'}</h2>
              </div>
              <Link to="/doctors" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-[#4e66b3] hover:text-[#3a4f99]">
                {content['home_team_link'] || 'Meet All Doctors'} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 justify-items-center">
              {doctors.slice(0, 4).map((doc, i) => (
                <div key={doc.id} ref={reveal(i * 100)} className={`w-full max-w-80 ${i === 0 ? 'block' : i === 1 ? 'block' : i === 2 ? 'hidden md:block' : 'hidden lg:block'}`}>
                  <DoctorCard doc={doc} index={i} />
                </div>
              ))}
            </div>
            <div className="text-center mt-8 sm:hidden">
              <Link to="/doctors" className="inline-flex items-center gap-2 text-sm font-semibold text-[#4e66b3]">
                {content['home_team_link'] || 'Meet All Doctors'} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* =========== RECENT BLOGS =========== */}
      {recentBlogs.length > 0 && isTrueValue(content['home_blog_visible']) && (
        <section className="py-8 sm:py-14 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div ref={reveal()} className="flex items-center justify-between mb-8">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#A62B2B] mb-2">{content['home_blog_badge'] || 'Latest Updates'}</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{content['home_blog_heading'] || 'News & Health Camps'}</h2>
              </div>
              <Link to="/blogs" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-[#4e66b3] hover:text-[#3a4f99]">
                {content['home_blog_link'] || 'All Posts'} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 justify-items-center">
              {recentBlogs.slice(0, 4).map((blog, i) => (
                <Link key={blog.id} to={`/blogs/${blog.slug || blog.id}`} ref={reveal(i * 100)}
                  className={`group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex-col w-full max-w-90 ${
                    i === 0 ? 'flex' : i === 1 ? 'flex' : i === 2 ? 'hidden md:flex' : 'hidden lg:flex'
                  }`}>
                  <div className="h-24 sm:h-36 bg-linear-to-br from-[#4e66b3]/10 to-gray-100 overflow-hidden shrink-0">
                    {blog.imageUrl ? (
                      <img loading="lazy" src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <HeartPulse className="w-12 h-12 text-[#4e66b3]/30" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 sm:p-4 flex flex-col grow">
                    <p className="text-[10px] sm:text-xs font-semibold text-[#4e66b3] mb-1 sm:mb-1.5">
                      {new Date(blog.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                    </p>
                    <h3 className="font-bold text-gray-900 mb-1.5 line-clamp-2 text-sm">{blog.title}</h3>
                    <p className="text-gray-500 text-[11px] sm:text-xs line-clamp-2 leading-relaxed grow">{blog.content.replace(/<[^>]+>/g, '')}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-[#4e66b3] group-hover:gap-2 transition-all">
                      {content['home_blog_read_more'] || 'Read More'} <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8 sm:hidden">
              <Link to="/blogs" className="inline-flex items-center gap-2 text-sm font-semibold text-[#4e66b3]">
                {content['home_blog_link'] || 'All Posts'} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* =========== CTA =========== */}
      {isTrueValue(content['cta_visible']) && (
      <section className="relative overflow-hidden bg-linear-to-r from-[#A62B2B] to-[#811e1e] py-5 sm:py-8 lg:py-10">
        <div className="absolute inset-0 bg-[url('/images/bg-medical.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div ref={reveal()} className="relative mx-auto max-w-5xl px-4 sm:px-8 lg:px-10">
          <div className="flex flex-col lg:flex-row items-center sm:items-start lg:items-center lg:justify-between gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center sm:text-left">
              <h2 className="text-[1.35rem] sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight tracking-tight">{content['cta_title']}</h2>
              <p className="text-white/80 text-[13px] sm:text-sm mt-1 sm:mt-2 font-medium max-w-lg">{content['cta_subtitle']}</p>
            </div>
            <div className="flex flex-row flex-wrap items-center justify-center sm:justify-start lg:justify-end gap-2.5 sm:gap-4 shrink-0 sm:w-auto mt-2 sm:mt-3 lg:mt-0">
              <a href={`tel:+${content['contact_phone'] || ''}`}
                className="inline-flex justify-center items-center gap-1.5 sm:gap-2 rounded-xl bg-white px-5 sm:px-8 py-2.5 sm:py-4 text-[13px] sm:text-sm font-bold text-[#A62B2B] hover:bg-gray-50 transition-colors shadow-sm sm:shadow-lg sm:shadow-black/10">
                <PhoneCall className="h-3.5 sm:h-5 w-3.5 sm:w-5" /> {content['cta_btn_call']}
              </a>
              <Link to="/contact"
                className="inline-flex justify-center items-center gap-1.5 sm:gap-2 rounded-xl bg-white/10 border border-white/20 px-5 sm:px-8 py-2.5 sm:py-4 text-[13px] sm:text-sm font-bold text-white hover:bg-white/15 backdrop-blur-md transition-colors">
                {content['cta_btn_inquiry'] || 'Send an Inquiry'}
              </Link>
            </div>
          </div>
        </div>
      </section>
      )}
    </>
  );
}
