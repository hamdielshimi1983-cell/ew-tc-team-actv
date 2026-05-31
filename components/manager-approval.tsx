'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useSupabase } from '@/lib/use-supabase';

interface FileVersion {
  id: string;
  file_url: string;
  version_number: number;
  created_at: string;
}

interface CreativePost {
  id: string;
  caption: string;
  internal_note: string;
  media_url: string;
  status: string;
  manager_comment: string | null;
  created_at: string;
  created_by: string;
  file_versions?: FileVersion[];
}

interface UserMap {
  [id: string]: string;
}

const USER_NAMES: UserMap = {
  '1': 'Hamdi',
  '2': 'Hadeer',
  '3': 'Bakr',
  '4': 'Asmaa',
};

export function ManagerApproval() {
  const { user } = useAuth();
  const supabase = useSupabase();
  const [posts, setPosts] = useState<CreativePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<CreativePost | null>(null);
  const [revisionComment, setRevisionComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  useEffect(() => {
    loadPendingPosts();
  }, []);

  const loadPendingPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('creative_posts')
        .select(`*, file_versions(id, file_url, version_number, created_at)`)
        .eq('status', 'Pending')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (postId: string) => {
    if (!user) return;
    setSubmitting(true);
    try {
      const response = await fetch(`/api/creatives/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Approved', actor_id: user.id }),
      });
      if (!response.ok) throw new Error('Failed to approve');
      setPosts(posts.filter((p) => p.id !== postId));
      setSelectedPost(null);
    } catch (err) {
      console.error('Error approving:', err);
      alert('Failed to approve');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturn = async (postId: string) => {
    if (!user || !revisionComment.trim()) {
      alert('Please add a revision comment');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`/api/creatives/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Returned',
          manager_comment: revisionComment,
          actor_id: user.id,
        }),
      });
      if (!response.ok) throw new Error('Failed to return');
      setPosts(posts.filter((p) => p.id !== postId));
      setSelectedPost(null);
      setRevisionComment('');
    } catch (err) {
      console.error('Error returning:', err);
      alert('Failed to return');
    } finally {
      setSubmitting(false);
    }
  };

  const isVideo = (url: string) =>
    url.includes('mp4') || url.includes('webm') || url.includes('quicktime');

  if (!user || user.role !== 'Admin') {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        You don&apos;t have permission to access this section.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute -top-10 right-0 text-white text-2xl font-bold hover:text-gray-300"
            >
              ✕ Close
            </button>
            {isVideo(lightboxUrl) ? (
              <video src={lightboxUrl} controls className="w-full rounded-lg" />
            ) : (
              <img src={lightboxUrl} alt="Full preview" className="w-full rounded-lg object-contain max-h-screen" />
            )}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Creative Approval Queue</h2>
        <p className="text-slate-600">
          {posts.length} pending {posts.length === 1 ? 'creative' : 'creatives'}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8"><p className="text-slate-600">Loading...</p></div>
      ) : posts.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-blue-900 font-semibold">No Pending Creatives</p>
          <p className="text-blue-700 text-sm mt-1">All creatives have been reviewed!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div
                className="p-4 cursor-pointer hover:bg-slate-50"
                onClick={() => setSelectedPost(selectedPost?.id === post.id ? null : post)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">
                      👤 {USER_NAMES[post.created_by] || `User ${post.created_by}`}
                    </p>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">{post.caption}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      {new Date(post.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className="text-lg">{selectedPost?.id === post.id ? '▼' : '▶'}</span>
                </div>
              </div>

              {selectedPost?.id === post.id && (
                <div className="border-t border-slate-200 p-4 bg-slate-50 space-y-4">

                  {/* All uploaded files */}
                  {post.file_versions && post.file_versions.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-2">
                        Media ({post.file_versions.length} file{post.file_versions.length > 1 ? 's' : ''}):
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {post.file_versions
                          .sort((a, b) => a.version_number - b.version_number)
                          .map((v) => (
                            <div key={v.id} className="relative group cursor-pointer" onClick={() => setLightboxUrl(v.file_url)}>
                              {isVideo(v.file_url) ? (
                                <div className="bg-black rounded-lg p-4 text-white text-xs text-center">
                                  🎬 Video — click to play
                                </div>
                              ) : (
                                <img
                                  src={v.file_url}
                                  alt={`File ${v.version_number}`}
                                  className="w-full h-32 object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                                />
                              )}
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">🔍 View full</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Caption */}
                  <div>
                    <p className="text-xs font-semibold text-slate-600 mb-1">Caption:</p>
                    <p className="text-slate-900">{post.caption}</p>
                  </div>

                  {/* Internal Note */}
                  {post.internal_note && (
                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-1">Creator Note:</p>
                      <p className="text-slate-700 text-sm">{post.internal_note}</p>
                    </div>
                  )}

                  {/* Revision Comment */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2">
                      Revision Comment (if returning)
                    </label>
                    <textarea
                      value={revisionComment}
                      onChange={(e) => setRevisionComment(e.target.value)}
                      maxLength={300}
                      rows={3}
                      placeholder="Explain what needs to be changed..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(post.id)}
                      disabled={submitting}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:bg-slate-300 transition-colors"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => handleReturn(post.id)}
                      disabled={submitting || !revisionComment.trim()}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 disabled:bg-slate-300 transition-colors"
                    >
                      ↩ Return
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}