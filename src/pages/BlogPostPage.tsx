import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, Share2, HeartPulse, Youtube, Play, PhoneCall } from "lucide-react";
import { api } from "@/services/api";
import { useContent } from "@/hooks/useContent";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function extractYoutubeId(url: string): string | null {
  const match = url?.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const content = useContent();
  const reveal = useScrollReveal();
  const [blog, setBlog] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api.get(`/blogs/${encodeURIComponent(slug)}`)
      .then(setBlog)
      .catch(() => setNotFound(true));
  }, [slug]);

  useEffect(() => {
    if (blog) {
      const siteName = content['site_name'] || 'Clinic';
      document.title = `${blog.title} | ${siteName}`;
      // Set OG meta tags per blog post
      const setMeta = (prop: string, metaContent: string) => {
        let el = document.querySelector(`meta[property="${prop}"]`) as HTMLMetaElement;
        if (!el) { el = document.createElement('meta'); el.setAttribute('property', prop); document.head.appendChild(el); }
        el.setAttribute('content', metaContent);
      };
      setMeta('og:title', `${blog.title} | ${siteName}`);
      setMeta('og:description', (blog.content || '').replace(/<[^>]+>/g, '').slice(0, 160));
      if (blog.imageUrl) setMeta('og:image', blog.imageUrl);
    }
    return () => { document.title = content['site_name'] || 'Clinic'; };
  }, [blog, content]);

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{content['blogs_notfound'] || 'Post not found'}</h1>
          <Link to="/blogs" className="text-[#4e66b3] font-semibold hover:underline">{content['blogs_back_link'] || 'Back to News'}</Link>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#4e66b3] border-t-transparent rounded-full" />
      </div>
    );
  }

  const wordCount = (blog.content || '').replace(/<[^>]+>/g, '').split(" ").length;
  const readMin = Math.max(1, Math.round(wordCount / 200));
  const videoId = extractYoutubeId(blog.videoUrl || '')

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      {/* Compact hero header */}
      <div className="relative isolate overflow-hidden bg-linear-to-br from-[#3d5099] via-[#4e66b3] to-[#6070c9] pt-8 pb-8 px-4">
        {blog.imageUrl && (
          <div className="absolute inset-0 opacity-10">
            <img loading="lazy" src={blog.imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="relative max-w-3xl mx-auto">
          <Link to="/blogs" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white mb-4 transition-colors text-xs font-medium uppercase tracking-wide">
            <ArrowLeft className="w-3.5 h-3.5" /> {content['blogs_back_link'] || 'Back to News'}
          </Link>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-snug mb-4">{blog.title}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-[11px] font-medium text-white/75">
              <Calendar className="w-3 h-3" />
              {new Date(blog.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
            </span>
            {videoId ? (
              <span className="inline-flex items-center gap-1.5 bg-red-500/30 rounded-full px-3 py-1 text-[11px] font-medium text-white/90">
                <Youtube className="w-3 h-3" /> Video
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-[11px] font-medium text-white/75">
                <Clock className="w-3 h-3" />
                {readMin} min read
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Article card */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div ref={reveal()} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* YouTube embed - click to play */}
          {videoId ? (
            <div className="w-full bg-black">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                {playing ? (
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`}
                    title={blog.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setPlaying(true)}
                    className="absolute inset-0 w-full h-full group cursor-pointer"
                  >
                    <img loading="lazy"
                        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="bg-red-600 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Play className="w-7 h-7 sm:w-9 sm:h-9 text-white fill-white ml-1" />
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Featured image (only when no video) */
            blog.imageUrl && (
              <div className="w-full overflow-hidden">
                <img loading="eager"
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full max-h-80 object-cover"
                />
              </div>
            )
          )}

          {/* Content */}
          <div className="px-6 sm:px-10 py-8">
            {videoId && blog.imageUrl && (
              /* Thumbnail row with YouTube link when video is present */
              <a
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 mb-5 text-xs text-red-600 hover:text-red-700 font-semibold transition-colors"
              >
                <Youtube className="w-4 h-4 shrink-0" />
                Watch on YouTube
              </a>
            )}
            <article>
                <p className="text-gray-700 leading-[1.85] text-base sm:text-[17px] font-normal tracking-[0.01em] whitespace-pre-wrap">
                  {blog.content}
                </p>
            </article>

            {/* Divider */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <Link
                to="/blogs"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:border-[#4e66b3] hover:text-[#4e66b3] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> {content['blogs_all_link'] || 'All News'}
              </Link>
              <a
                href={"https://wa.me/?text=" + encodeURIComponent(blog.title + ' ' + (videoId ? `https://www.youtube.com/watch?v=${videoId}` : ''))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1da851] transition-colors"
              >
                <Share2 className="w-4 h-4" /> {content['blogs_share_btn'] || 'Share on WhatsApp'}
              </a>
            </div>
          </div>
        </div>

        {/* CTA card */}
        <div ref={reveal(100)} className="mt-6 sm:mt-10 lg:mt-12 rounded-2xl sm:rounded-[1.5rem] bg-linear-to-br from-[#3d5099] to-[#4e66b3] px-4 py-5 sm:px-8 sm:py-8 flex flex-col lg:flex-row items-center sm:items-start lg:items-center lg:justify-between gap-4 sm:gap-6 lg:gap-8 shadow-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&q=40')] opacity-5 mix-blend-overlay bg-cover bg-center pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center text-center sm:text-left gap-3 sm:gap-4 relative z-10 w-full sm:w-auto">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0 backdrop-blur-sm shadow-inner">
              <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="mt-0.5 sm:mt-1">
              <p className="font-extrabold text-white text-[15px] sm:text-lg tracking-tight">{content['blogs_cta_heading'] || 'Have a health concern?'}</p>
              <p className="text-white/80 text-[13px] sm:text-sm mt-0.5 font-medium leading-relaxed max-w-[250px] mx-auto sm:mx-0">{content['blogs_cta_subtext'] || 'Our team is ready to help you today.'}</p>
            </div>
          </div>
          <a href={`tel:+${content['contact_phone'] || ''}`}
            className="shrink-0 inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-white px-6 sm:px-8 py-2.5 sm:py-4 text-[13px] sm:text-sm font-bold text-[#4e66b3] hover:bg-gray-50 transition-colors shadow-lg relative z-10 hover:scale-[1.03] active:scale-95 mt-2 sm:mt-3 lg:mt-0">
            <PhoneCall className="h-3.5 sm:h-5 w-3.5 sm:w-5" /> {content['blogs_cta_btn'] || 'Call Us Now'}
          </a>
        </div>
      </div>
    </div>
  );
}

