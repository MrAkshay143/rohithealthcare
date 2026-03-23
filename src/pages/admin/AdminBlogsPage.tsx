import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Pencil, Calendar, Link2, EyeOff, FileText, Search, Plus, Eye, Image as ImageIcon, ChevronUp, Youtube } from "lucide-react";
import { api } from "@/services/api";
import { BlogForm } from "./BlogForm";
import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";
import { toast } from "@/components/Toast";

export default function AdminBlogsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'published' | 'drafts'>('all');

  const editId = searchParams.get("edit") ? parseInt(searchParams.get("edit")!) : null;
  const editBlog = editId ? blogs.find((b) => b.id === editId) : null;

  const published = blogs.filter(b => !b.draft).length;
  const drafts = blogs.filter(b => b.draft).length;

  const filtered = useMemo(() => {
    let list = blogs;
    if (filter === 'published') list = list.filter(b => !b.draft);
    if (filter === 'drafts') list = list.filter(b => b.draft);
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(b => b.title?.toLowerCase().includes(q) || b.content?.toLowerCase().includes(q));
  }, [blogs, search, filter]);

  const loadBlogs = useCallback(() => {
    api.get<any[]>('/blogs?orderBy=createdAt&orderDir=desc&includeDrafts=true').then(setBlogs).catch(() => {});
  }, []);

  useEffect(() => { document.title = 'Blogs & News | Admin'; }, []);

  useEffect(() => {
    loadBlogs();
    const s = searchParams.get("success");
    const e = searchParams.get("error");
    if (s) toast.success(s);
    if (e) toast.error(e);
  }, [searchParams, loadBlogs]);

  useEffect(() => {
    if (editId) setFormOpen(true);
  }, [editId]);

  async function handleAdd(data: any) {
    try {
      await api.post('/blogs', data);
      toast.success(data.draft ? 'Blog saved as draft' : 'Blog post published!');
      setFormOpen(false);
      loadBlogs();
    } catch { toast.error('Failed to add blog'); }
  }

  async function handleUpdate(data: any) {
    try {
      await api.put(`/blogs/${data.id}`, data);
      toast.success('Blog post updated');
      navigate('/admin/blogs');
      loadBlogs();
    } catch { toast.error('Failed to update blog'); }
  }

  async function handleDelete(fields: Record<string, string | number>) {
    try {
      await api.delete(`/blogs/${fields.id}`);
      toast.success('Blog post deleted');
      loadBlogs();
    } catch { toast.error('Failed to delete blog'); }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start gap-4 mb-6">
        <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center shrink-0 shadow-lg shadow-green-500/20">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-extrabold text-gray-900">Blogs & News</h1>
          <p className="text-xs text-gray-500 mt-0.5">Create and manage blog posts and news articles.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs bg-green-50 text-green-600 px-2.5 py-1.5 rounded-full font-bold">{published} published</span>
          {drafts > 0 && <span className="text-xs bg-amber-50 text-amber-600 px-2.5 py-1.5 rounded-full font-bold">{drafts} drafts</span>}
          <button
            onClick={() => { setFormOpen(!formOpen); if (editId) navigate('/admin/blogs'); }}
            className="inline-flex items-center gap-1.5 bg-[#4e66b3] text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-[#3a4f99] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Post</span>
          </button>
        </div>
      </div>



      {/* Collapsible Form */}
      {(formOpen || editBlog) && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
          <button
            type="button"
            onClick={() => { setFormOpen(!formOpen); if (editId) navigate('/admin/blogs'); }}
            className="w-full px-5 py-3.5 flex items-center justify-between text-left border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${editBlog ? 'bg-amber-50' : 'bg-green-50'}`}>
                {editBlog ? <Pencil className="w-3.5 h-3.5 text-amber-500" /> : <Plus className="w-3.5 h-3.5 text-green-500" />}
              </div>
              <span className="text-sm font-bold text-gray-800">
                {editBlog ? `Editing: ${editBlog.title.slice(0, 50)}` : 'New Blog Post'}
              </span>
            </div>
            <ChevronUp className="w-4 h-4 text-gray-400" />
          </button>
          <div className="px-5 py-4">
            <BlogForm onSubmit={editBlog ? handleUpdate : handleAdd} editBlog={editBlog} key={editId || 'new'} />
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      {blogs.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or content..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4e66b3]/25 focus:border-[#4e66b3] bg-white transition-colors"
            />
          </div>
          <div className="flex gap-1.5 shrink-0">
            {(['all', 'published', 'drafts'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
                  filter === f
                    ? 'bg-[#4e66b3] text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? `All (${blogs.length})` : f === 'published' ? `Published (${published})` : `Drafts (${drafts})`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Blog Cards */}
      {filtered.length === 0 && blogs.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
          <div className="h-16 w-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-green-300" />
          </div>
          <p className="text-sm font-semibold text-gray-500">No blog posts yet</p>
          <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">Write your first blog post to engage visitors and improve your site's SEO.</p>
          <button
            onClick={() => setFormOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 bg-[#4e66b3] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#3a4f99] transition-colors"
          >
            <Plus className="w-4 h-4" /> Write First Post
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No posts match your search</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((blog) => (
            <div key={blog.id} className={`group bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden ${editId === blog.id ? 'border-[#4e66b3] ring-2 ring-[#4e66b3]/20' : 'border-gray-100'}`}>
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                {blog.imageUrl && (
                  <div className="sm:w-40 md:w-48 shrink-0 relative">
                    <img loading="lazy" src={blog.imageUrl} alt="" className="w-full h-32 sm:h-full object-cover" />
                    {blog.videoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-red-600 rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                          <Youtube className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {/* Content */}
                <div className="flex-1 min-w-0 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-sm text-gray-900 truncate">{blog.title}</h3>
                        {blog.draft ? (
                          <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                            <EyeOff className="w-3 h-3" /> Draft
                          </span>
                        ) : (
                          <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200">
                            <Eye className="w-3 h-3" /> Live
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400 mb-2">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(blog.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                        {blog.slug && <span className="flex items-center gap-1 font-mono"><Link2 className="w-3 h-3" />/blogs/{blog.slug}</span>}
                        {blog.videoUrl && (
                          <span className="flex items-center gap-1 text-red-500 font-medium"><Youtube className="w-3 h-3" /> YouTube Video</span>
                        )}
                        {!blog.imageUrl && (
                          <span className="flex items-center gap-1 text-gray-300"><ImageIcon className="w-3 h-3" /> No image</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{blog.content}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Link to={`/admin/blogs?edit=${blog.id}`} className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-[#4e66b3] px-2 py-1.5 rounded-lg hover:bg-[#4e66b3]/10 transition-colors">
                        <Pencil className="w-3 h-3" /> <span className="hidden md:inline">Edit</span>
                      </Link>
                      <ConfirmDeleteButton
                        onDelete={handleDelete}
                        hiddenFields={{ id: blog.id }}
                        confirmText={`Delete "${blog.title}"? This cannot be undone.`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
