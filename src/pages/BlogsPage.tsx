import { useEffect, useState } from "react";
import { Calendar, Clock, ArrowRight, HeartPulse, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/services/api";
import { useContent } from "@/hooks/useContent";
import { useSEO } from "@/hooks/useSEO";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function extractYoutubeId(url: string): string | null {
  const m = url?.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

export default function BlogsPage() {
  const content = useContent();
  useSEO('blogs');
  const reveal = useScrollReveal();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    api.get<any[]>('/blogs?orderBy=createdAt&orderDir=desc').then(setBlogs).catch(() => setLoadError(true));
  }, []);

  const visibleBlogs = blogs.slice(0, visibleCount);
  const hasMore = visibleCount < blogs.length;

  return (
    <div className="bg-gray-50 min-h-screen pb-10 sm:pb-20">
      {/* Header */}
      <div className="relative isolate overflow-hidden bg-brand-green py-3 sm:py-5 lg:py-6 text-center px-4">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/bg-medical.jpg')] bg-cover bg-center" />
        <div ref={reveal()} className="relative">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#f87171] mb-3">{content['blogs_page_badge'] || 'Stay Informed'}</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">{content['blogs_page_heading'] || 'News & Health Camps'}</h1>
          <p className="text-white/75 max-w-4xl mx-auto text-sm">
            {content['blogs_page_subtext'] || 'Updates on free outdoor checkup camps, community events, and medical advice.'}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {loadError ? (
          <div className="text-center py-16">
            <p className="text-red-500 font-semibold">Something went wrong loading posts. Please try again later.</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-24">
            <div className="h-20 w-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-5">
              <HeartPulse className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{content['blogs_empty_title'] || 'No updates yet'}</h3>
            <p className="text-gray-500 text-sm">{content['blogs_empty_subtext'] || 'Check back soon for news and health camp announcements.'}</p>
          </div>
        ) : (
          <>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 sm:gap-6">
            {visibleBlogs.map((blog, i) => {
              const wordCount = (blog.content || '').replace(/<[^>]+>/g, '').split(" ").length;
              const readMin = Math.max(1, Math.round(wordCount / 200));
              const href = "/blogs/" + (blog.slug || blog.id);
              return (
                <Link
                  key={blog.id}
                  to={href}
                  ref={reveal((i % 4) * 100)}
                  className="group bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col"
                >
                  {/* Image */}
                  <div className="overflow-hidden shrink-0 h-32 sm:h-40 bg-linear-to-br from-[#4e66b3]/10 to-gray-100 relative">
                    {blog.imageUrl ? (
                      <img loading="lazy"
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : blog.videoUrl && extractYoutubeId(blog.videoUrl) ? (
                      <img loading="lazy"
                        src={`https://img.youtube.com/vi/${extractYoutubeId(blog.videoUrl)}/hqdefault.jpg`}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <HeartPulse className="w-10 h-10 text-[#4e66b3]/20" />
                      </div>
                    )}
                    {/* YouTube play badge */}
                    {blog.videoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-red-600 rounded-full w-10 h-10 flex items-center justify-center shadow-xl opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200">
                          <Youtube className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4 flex flex-col grow">
                    <div className="flex items-center gap-3 text-[10px] sm:text-xs text-gray-400 font-medium mb-1.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(blog.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                      </span>
                      {blog.videoUrl ? (
                        <span className="flex items-center gap-1 text-red-500 font-semibold">
                          <Youtube className="w-3 h-3" /> Video
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />{readMin} min read
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 leading-snug mb-1.5 line-clamp-2 text-sm sm:text-base">{blog.title}</h3>
                    <p className="text-gray-500 text-[11px] sm:text-xs leading-relaxed line-clamp-3 grow">
                      {(blog.content || '').replace(/<[^>]+>/g, '')}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-[#4e66b3] group-hover:gap-2 transition-all">
                      {blog.videoUrl ? 'Watch Now' : (content['blogs_read_more'] || 'Read More')} <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={() => setVisibleCount(v => v + 9)}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-[#4e66b3] px-6 py-2.5 text-sm font-bold text-[#4e66b3] hover:bg-[#4e66b3] hover:text-white transition-all">
                Load More <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
          </>
        )}
      </div>
    </div>
  );
}
