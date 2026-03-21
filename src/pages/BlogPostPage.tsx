import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, Share2, HeartPulse, Youtube, Play } from "lucide-react";
import { api } from "@/services/api";
import { useContent } from "@/hooks/useContent";

function extractYoutubeId(url: string): string | null {
  const match = url?.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const content = useContent();
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
    if (blog) document.title = blog.title + ' | Rohit Health Care';
    return () => { document.title = 'Rohit Health Care'; };
  }, [blog]);

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{content['blogs_notfound'] ?? 'Post not found'}</h1>
          <Link to="/blogs" className="text-[#015851] font-semibold hover:underline">{content['blogs_back_link'] ?? 'Back to News'}</Link>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#015851] border-t-transparent rounded-full" />
      </div>
    );
  }

  const wordCount = (blog.content ?? '').replace(/<[^>]+>/g, '').split(" ").length;
  const readMin = Math.max(1, Math.round(wordCount / 200));
  const videoId = extractYoutubeId(blog.videoUrl ?? '')

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      {/* Compact hero header */}
      <div className="relative isolate overflow-hidden bg-linear-to-br from-[#014d43] via-[#015851] to-[#017a6a] pt-8 pb-8 px-4">
        {blog.imageUrl && (
          <div className="absolute inset-0 opacity-10">
            <img src={blog.imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="relative max-w-3xl mx-auto">
          <Link to="/blogs" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white mb-4 transition-colors text-xs font-medium uppercase tracking-wide">
            <ArrowLeft className="w-3.5 h-3.5" /> {content['blogs_back_link'] ?? 'Back to News'}
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                    allowFullScreen
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setPlaying(true)}
                    className="absolute inset-0 w-full h-full group cursor-pointer"
                  >
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; }}
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
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full max-h-80 object-cover"
                  loading="eager"
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
              <p className="text-gray-700 leading-[1.85] text-base sm:text-[17px] font-normal tracking-[0.01em]">
                {blog.content}
              </p>
            </article>

            {/* Divider */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <Link
                to="/blogs"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:border-[#015851] hover:text-[#015851] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> {content['blogs_all_link'] ?? 'All News'}
              </Link>
              <a
                href={"https://wa.me/?text=" + encodeURIComponent(blog.title + ' ' + (videoId ? `https://www.youtube.com/watch?v=${videoId}` : ''))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1da851] transition-colors"
              >
                <Share2 className="w-4 h-4" /> {content['blogs_share_btn'] ?? 'Share on WhatsApp'}
              </a>
            </div>
          </div>
        </div>

        {/* CTA card */}
        <div className="mt-6 rounded-2xl bg-linear-to-br from-[#014d43] to-[#015851] p-7 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <HeartPulse className="w-6 h-6 text-white/70" />
            </div>
            <div>
              <p className="font-bold text-white text-base">{content['blogs_cta_heading'] ?? 'Have a health concern?'}</p>
              <p className="text-white/60 text-xs mt-0.5">{content['blogs_cta_subtext'] ?? 'Our team is ready to help you today.'}</p>
            </div>
          </div>
          <a
            href={`tel:+${content['contact_phone'] ?? ''}`}
            className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-[#015851] hover:bg-gray-100 transition-colors shadow-sm"
          >
            {content['blogs_cta_btn'] ?? 'Call Us Now'}
          </a>
        </div>
      </div>
    </div>
  );
}

