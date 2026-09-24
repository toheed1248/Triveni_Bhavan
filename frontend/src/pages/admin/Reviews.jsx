import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Archive, RotateCcw, X, Star, ShieldCheck, ShieldOff, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api';

const sources = ['Google', 'Facebook', 'Direct', 'Other'];

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [confirmAction, setConfirmAction] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [form, setForm] = useState({
    reviewerName: '',
    rating: 5,
    reviewText: '',
    source: 'Google',
    sourceUrl: '',
    reviewDate: new Date().toISOString().split('T')[0],
    isVerified: true,
    isPublished: true
  });

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/reviews/admin?page=${page}&limit=10`);
      setReviews(res.data.data || []);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load reviews.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, [page]);

  const resetForm = () => {
    setForm({ reviewerName: '', rating: 5, reviewText: '', source: 'Google', sourceUrl: '', reviewDate: new Date().toISOString().split('T')[0], isVerified: true, isPublished: true });
    setEditing(null);
  };

  const handleOpen = (rev = null) => {
    if (rev) {
      setEditing(rev);
      setForm({
        reviewerName: rev.reviewerName || '',
        rating: rev.rating || 5,
        reviewText: rev.reviewText || '',
        source: rev.source || 'Google',
        sourceUrl: rev.sourceUrl || '',
        reviewDate: rev.reviewDate ? rev.reviewDate.split('T')[0] : new Date().toISOString().split('T')[0],
        isVerified: rev.isVerified ?? true,
        isPublished: rev.isPublished ?? true
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    resetForm();
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await api.patch(`/reviews/${editing._id}`, form);
        setMessage({ type: 'success', text: 'Review updated.' });
      } else {
        await api.post('/reviews', form);
        setMessage({ type: 'success', text: 'Review created.' });
      }
      fetchReviews();
      setTimeout(handleClose, 1000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleVerify = async (rev) => {
    try {
      await api.patch(`/reviews/${rev._id}`, { isVerified: !rev.isVerified });
      fetchReviews();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update.' });
    }
  };

  const togglePublish = async (rev) => {
    try {
      await api.patch(`/reviews/${rev._id}`, { isPublished: !rev.isPublished });
      fetchReviews();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update.' });
    }
  };

  const handleArchive = (rev) => {
    setConfirmAction({ type: 'archive', item: rev });
  };

  const handleRestore = async (rev) => {
    try {
      await api.patch(`/reviews/${rev._id}/restore`);
      setMessage({ type: 'success', text: 'Review restored.' });
      fetchReviews();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to restore.' });
    }
  };

  const handlePermanentDelete = (rev) => {
    setConfirmAction({ type: 'permanent', item: rev });
  };

  const executeConfirm = async () => {
    if (!confirmAction) return;
    try {
      if (confirmAction.type === 'archive') {
        await api.delete(`/reviews/${confirmAction.item._id}`);
        setMessage({ type: 'success', text: 'Review archived.' });
      } else if (confirmAction.type === 'permanent') {
        await api.delete(`/reviews/${confirmAction.item._id}/permanent`);
        setMessage({ type: 'success', text: 'Review permanently deleted.' });
      }
      fetchReviews();
    } catch (err) {
      setMessage({ type: 'error', text: 'Operation failed.' });
    }
    setConfirmAction(null);
  };

  const renderStars = (count) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={14} fill={i <= count ? '#C6A15B' : 'none'} stroke={i <= count ? '#C6A15B' : '#ccc'} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: '#F7F7F5' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight" style={{ color: '#211B19' }}>Reviews Management</h1>
          <button onClick={() => handleOpen()} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium shadow-sm hover:opacity-95 transition-opacity" style={{ backgroundColor: '#5A1E2B' }}>
            <Plus size={18} /> Add Review
          </button>
        </div>

        <div className="mb-6 px-4 py-3.5 rounded-xl text-sm border" style={{ backgroundColor: "#F7F1E6", color: "#5A1E2B", borderColor: "#E8E3E0" }}>
          <ShieldCheck size={16} className="inline mr-1" />
          Only publish verified/real reviews.
        </div>

        {message.text && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: '#C6A15B', borderTopColor: 'transparent' }} />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 rounded-xl border-2 border-dashed" style={{ borderColor: '#C6A15B', color: '#5A1E2B' }}>
            <Star size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">No reviews available.</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: '#E8E3E0' }}>
                    <th className="text-left px-4 py-3.5 font-semibold text-xs uppercase tracking-wide" style={{ color: '#211B19' }}>Reviewer</th>
                    <th className="text-left px-4 py-3.5 font-semibold text-xs uppercase tracking-wide" style={{ color: '#211B19' }}>Rating</th>
                    <th className="text-left p-4 font-semibold hidden md:table-cell" style={{ color: '#211B19' }}>Source</th>
                    <th className="text-left p-4 font-semibold hidden lg:table-cell" style={{ color: '#211B19' }}>Date</th>
                    <th className="text-left px-4 py-3.5 font-semibold text-xs uppercase tracking-wide" style={{ color: '#211B19' }}>Status</th>
                    <th className="text-right p-4 font-semibold" style={{ color: '#211B19' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((rev) => (
                    <tr key={rev._id} className="border-b last:border-0 hover:bg-[#FAF8F6] transition-colors" style={{ borderColor: "#E8E3E0" }}>
                      <td className="px-4 py-4 align-top">
                        <div className="font-medium" style={{ color: '#211B19' }}>{rev.reviewerName}</div>
                        <div className="text-xs text-[#6B6B6B] truncate max-w-[200px]">{rev.reviewText}</div>
                      </td>
                      <td className="px-4 py-4 align-top">{renderStars(rev.rating)}</td>
                      <td className="p-4 hidden md:table-cell">
                        <span className="px-2 py-1 rounded-full text-xs bg-[#F4F1EF]">{rev.source}</span>
                      </td>
                      <td className="p-4 hidden lg:table-cell text-[#6B6B6B]">
                        {rev.reviewDate ? new Date(rev.reviewDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex gap-1.5 flex-wrap">
                          {rev.isVerified ? (
                            <span className="px-2 py-1 rounded-full text-xs text-green-700 bg-green-100">Verified</span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs text-yellow-700 bg-yellow-100">Unverified</span>
                          )}
                          {rev.isPublished ? (
                            <span className="px-2 py-1 rounded-full text-xs text-blue-700 bg-blue-100">Published</span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs text-[#6B6B6B] bg-[#F4F1EF]">Draft</span>
                          )}
                          {rev.isArchived && (
                            <span className="px-2 py-1 rounded-full text-xs text-red-700 bg-red-100">Archived</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => handleOpen(rev)} className="p-1.5 rounded hover:bg-[#F4F1EF]" title="Edit"><Edit2 size={15} /></button>
                          <button onClick={() => toggleVerify(rev)} className="p-1.5 rounded hover:bg-[#F4F1EF]" title={rev.isVerified ? 'Unverify' : 'Verify'}>
                            {rev.isVerified ? <ShieldCheck size={15} style={{ color: '#27ae60' }} /> : <ShieldOff size={15} style={{ color: '#f39c12' }} />}
                          </button>
                          <button onClick={() => togglePublish(rev)} className="p-1.5 rounded hover:bg-[#F4F1EF]" title={rev.isPublished ? 'Unpublish' : 'Publish'}>
                            <span className="text-xs font-medium" style={{ color: rev.isPublished ? '#C6A15B' : '#999' }}>{rev.isPublished ? 'Pub' : 'Drft'}</span>
                          </button>
                          {!rev.isArchived ? (
                            <button onClick={() => handleArchive(rev)} className="p-1.5 rounded hover:bg-[#F4F1EF]" title="Archive"><Archive size={15} style={{ color: '#e74c3c' }} /></button>
                          ) : (
                            <>
                              <button onClick={() => handleRestore(rev)} className="p-1.5 rounded hover:bg-[#F4F1EF]" title="Restore"><RotateCcw size={15} style={{ color: '#27ae60' }} /></button>
                              <button onClick={() => handlePermanentDelete(rev)} className="p-1.5 rounded hover:bg-[#F4F1EF]" title="Permanent Delete"><Trash2 size={15} style={{ color: '#c0392b' }} /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="p-2 rounded-lg disabled:opacity-40 hover:bg-[#F0ECE9]"><ChevronLeft size={20} /></button>
                <span style={{ color: '#211B19' }}>Page {page} of {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="p-2 rounded-lg disabled:opacity-40 hover:bg-[#F0ECE9]"><ChevronRight size={20} /></button>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border" style={{ borderColor: "#E8E3E0" }}>
            <div className="flex justify-between items-center p-5 border-b" style={{ borderColor: "#E8E3E0" }}>
              <h2 className="text-xl font-bold" style={{ color: '#211B19' }}>{editing ? 'Edit Review' : 'Add Review'}</h2>
              <button onClick={handleClose} className="p-1 rounded hover:bg-[#F4F1EF]"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Reviewer Name</label>
                <input type="text" value={form.reviewerName} onChange={e => setForm({ ...form, reviewerName: e.target.value })} className="w-full px-3 py-2.5 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-[#C6A15B]/30 focus:border-[#C6A15B]" style={{ borderColor: "#E8E3E0", color: "#211B19" }} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <button key={i} type="button" onClick={() => setForm({ ...form, rating: i })} className="p-1">
                      <Star size={24} fill={i <= form.rating ? '#C6A15B' : 'none'} stroke={i <= form.rating ? '#C6A15B' : '#ccc'} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Review Text</label>
                <textarea value={form.reviewText} onChange={e => setForm({ ...form, reviewText: e.target.value })} className="w-full px-3 py-2.5 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-[#C6A15B]/30 focus:border-[#C6A15B]" style={{ borderColor: "#E8E3E0", color: "#211B19" }} rows={4} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Source</label>
                  <select value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} className="w-full px-3 py-2.5 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-[#C6A15B]/30 focus:border-[#C6A15B]" style={{ borderColor: "#E8E3E0", color: "#211B19" }}>
                    {sources.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Source URL</label>
                  <input type="url" value={form.sourceUrl} onChange={e => setForm({ ...form, sourceUrl: e.target.value })} className="w-full px-3 py-2.5 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-[#C6A15B]/30 focus:border-[#C6A15B]" style={{ borderColor: "#E8E3E0", color: "#211B19" }} placeholder="https://..." />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Review Date</label>
                <input type="date" value={form.reviewDate} onChange={e => setForm({ ...form, reviewDate: e.target.value })} className="w-full px-3 py-2.5 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-[#C6A15B]/30 focus:border-[#C6A15B]" style={{ borderColor: "#E8E3E0", color: "#211B19" }} />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isVerified} onChange={e => setForm({ ...form, isVerified: e.target.checked })} className="w-4 h-4 rounded" />
                  <span className="text-sm">Verified</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} className="w-4 h-4 rounded" />
                  <span className="text-sm">Published</span>
                </label>
              </div>
              <button type="submit" disabled={submitting} className="w-full py-2.5 rounded-xl text-white font-medium disabled:opacity-60 hover:opacity-95 transition-opacity" style={{ backgroundColor: '#5A1E2B' }}>
                {submitting ? 'Saving...' : editing ? 'Update Review' : 'Add Review'}
              </button>
            </form>
          </div>
        </div>
      )}

      {confirmAction && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border" style={{ borderColor: "#E8E3E0" }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#211B19' }}>
              {confirmAction.type === 'permanent' ? 'Permanent Delete' : 'Archive Review'}
            </h3>
            <p className="text-sm mb-1">Are you sure you want to {confirmAction.type === 'permanent' ? 'permanently delete' : 'archive'} this review by "{confirmAction.item.reviewerName}"?</p>
            {confirmAction.type === 'permanent' && <p className="text-sm text-red-600 font-medium mb-4">This action cannot be undone.</p>}
            {confirmAction.type === 'archive' && <p className="text-sm opacity-60 mb-4">You can restore it later.</p>}
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmAction(null)} className="px-4 py-2 rounded-lg border hover:bg-[#FAF8F6]">Cancel</button>
              <button onClick={executeConfirm} className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: confirmAction.type === 'permanent' ? '#c0392b' : '#5A1E2B' }}>
                {confirmAction.type === 'permanent' ? 'Delete Permanently' : 'Archive'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
