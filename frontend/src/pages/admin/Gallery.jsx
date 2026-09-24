import { useState, useEffect } from 'react';
import { Plus, Upload, Edit2, Trash2, Archive, RotateCcw, X, Eye, ChevronLeft, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { resolveMediaUrl } from '../../utils/helpers';

const categories = ['Exterior', 'Open Hall', 'Closed / Banquet Hall', 'Mandir', 'Interiors', 'Events & Decoration', 'Rooms'];

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [confirmAction, setConfirmAction] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [form, setForm] = useState({
    image: null,
    title: '',
    category: categories[0],
    altText: '',
    description: '',
    sortOrder: 0,
    isPublished: true
  });

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/gallery?page=${page}&limit=12&all=true`);
      setImages(res.data.data || []);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load gallery.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, [page]);

  const resetForm = () => {
    setForm({ image: null, title: '', category: categories[0], altText: '', description: '', sortOrder: 0, isPublished: true });
    setPreview(null);
    setEditingImage(null);
  };

  const handleOpen = (img = null) => {
    if (img) {
      setEditingImage(img);
      setForm({
        image: null,
        title: img.title || '',
        category: img.category || categories[0],
        altText: img.altText || '',
        description: img.description || '',
        sortOrder: img.sortOrder || 0,
        isPublished: img.isPublished ?? true
      });
      setPreview(resolveMediaUrl(img.imageUrl || img.url));
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      if (form.image) fd.append('image', form.image);
      fd.append('title', form.title);
      fd.append('category', form.category);
      fd.append('altText', form.altText);
      fd.append('description', form.description);
      fd.append('sortOrder', form.sortOrder);
      fd.append('isPublished', form.isPublished);

      if (editingImage) {
        await api.patch(`/gallery/${editingImage._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMessage({ type: 'success', text: 'Image updated.' });
      } else {
        await api.post('/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMessage({ type: 'success', text: 'Image uploaded.' });
      }
      fetchImages();
      setTimeout(handleClose, 1000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const togglePublish = async (img) => {
    try {
      await api.patch(`/gallery/${img._id}`, { isPublished: !img.isPublished });
      fetchImages();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update.' });
    }
  };

  const handleArchive = (img) => {
    setConfirmAction({ type: 'archive', item: img });
  };

  const handleRestore = async (img) => {
    try {
      await api.patch(`/gallery/${img._id}/restore`);
      setMessage({ type: 'success', text: 'Image restored.' });
      fetchImages();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to restore.' });
    }
  };

  const handlePermanentDelete = (img) => {
    setConfirmAction({ type: 'permanent', item: img });
  };

  const executeConfirm = async () => {
    if (!confirmAction) return;
    try {
      if (confirmAction.type === 'archive') {
        await api.delete(`/gallery/${confirmAction.item._id}`);
        setMessage({ type: 'success', text: 'Image archived.' });
      } else if (confirmAction.type === 'permanent') {
        await api.delete(`/gallery/${confirmAction.item._id}/permanent`);
        setMessage({ type: 'success', text: 'Image permanently deleted.' });
      }
      fetchImages();
    } catch (err) {
      setMessage({ type: 'error', text: 'Operation failed.' });
    }
    setConfirmAction(null);
  };

  return (
    <div className="min-h-full bg-[#F7F7F5] text-[#211B19]">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="h-7 w-1 rounded-full bg-[#C6A15B]" />
              <h1 className="text-2xl font-bold tracking-tight text-[#42151F]">
                Gallery Management
              </h1>
            </div>
            <p className="text-sm text-[#6B6B6B]">
              Manage venue images, categories and published gallery content
            </p>
          </div>

          <button
            onClick={() => handleOpen()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5A1E2B] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#42151F]"
          >
            <Upload size={17} />
            Upload Image
          </button>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`flex items-center gap-3 rounded-xl border p-3.5 text-sm ${
              message.type === 'error'
                ? 'border-red-100 bg-red-50 text-red-700'
                : 'border-emerald-100 bg-emerald-50 text-emerald-700'
            }`}
          >
            {message.type === 'error' ? (
              <X size={16} className="shrink-0" />
            ) : (
              <CheckCircle2 size={16} className="shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Gallery */}
        {loading ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-[#E8E3E0] bg-white shadow-sm">
            <Loader2 size={28} className="animate-spin text-[#5A1E2B]" />
            <p className="mt-3 text-sm font-medium text-[#42151F]">
              Loading gallery
            </p>
            <p className="mt-1 text-xs text-[#8A8582]">
              Please wait...
            </p>
          </div>
        ) : images.length === 0 ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-[#E8E3E0] bg-white px-6 text-center shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5A1E2B]/5">
              <Upload size={25} className="text-[#5A1E2B]" />
            </div>

            <p className="mt-4 text-lg font-semibold text-[#42151F]">
              No gallery images uploaded yet
            </p>
            <p className="mt-1 max-w-sm text-sm text-[#6B6B6B]">
              Upload your first Triveni Bhavan gallery image to get started.
            </p>

            <button
              onClick={() => handleOpen()}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#5A1E2B] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#42151F]"
            >
              <Plus size={16} />
              Upload Image
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {images.map((img) => (
                <div
                  key={img._id}
                  className="group overflow-hidden rounded-2xl border border-[#E8E3E0] bg-white shadow-[0_2px_12px_rgba(33,27,25,0.04)] transition-shadow hover:shadow-[0_6px_20px_rgba(33,27,25,0.08)]"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#F1EFEC]">
                    <img
                      src={resolveMediaUrl(img.imageUrl || img.url)}
                      alt={img.altText || img.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />

                    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
                      {!img.isPublished ? (
                        <span className="rounded-full border border-amber-200 bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-amber-700 shadow-sm">
                          Draft
                        </span>
                      ) : (
                        <span className="rounded-full border border-emerald-100 bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm">
                          Published
                        </span>
                      )}

                      {img.isArchived && (
                        <span className="rounded-full border border-red-100 bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-red-700 shadow-sm">
                          Archived
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="truncate font-semibold text-[#42151F]">
                      {img.title}
                    </h3>

                    <p className="mt-1 text-xs font-medium text-[#8A8582]">
                      {img.category}
                    </p>

                    <div className="mt-4 flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpen(img)}
                        className="rounded-lg p-2 text-[#6B6B6B] transition-colors hover:bg-[#5A1E2B]/5 hover:text-[#5A1E2B]"
                        title="Edit"
                      >
                        <Edit2 size={15} />
                      </button>

                      <button
                        onClick={() => togglePublish(img)}
                        className="rounded-lg p-2 text-[#6B6B6B] transition-colors hover:bg-[#5A1E2B]/5 hover:text-[#5A1E2B]"
                        title={img.isPublished ? 'Unpublish' : 'Publish'}
                      >
                        <Eye
                          size={15}
                          className={
                            img.isPublished
                              ? 'text-[#5A1E2B]'
                              : 'text-[#9A9592]'
                          }
                        />
                      </button>

                      {!img.isArchived ? (
                        <>
                          <button
                            onClick={() => handleArchive(img)}
                            className="rounded-lg p-2 text-[#6B6B6B] transition-colors hover:bg-red-50 hover:text-red-600"
                            title="Archive"
                          >
                            <Archive size={15} />
                          </button>

                          <button
                            onClick={() => handlePermanentDelete(img)}
                            className="rounded-lg p-2 text-[#6B6B6B] transition-colors hover:bg-red-50 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleRestore(img)}
                            className="rounded-lg p-2 text-[#6B6B6B] transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                            title="Restore"
                          >
                            <RotateCcw size={15} />
                          </button>

                          <button
                            onClick={() => handlePermanentDelete(img)}
                            className="rounded-lg p-2 text-[#6B6B6B] transition-colors hover:bg-red-50 hover:text-red-700"
                            title="Permanent Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between rounded-xl border border-[#E8E3E0] bg-white px-4 py-3 shadow-sm">
                <p className="text-sm text-[#6B6B6B]">
                  Page{' '}
                  <span className="font-semibold text-[#211B19]">{page}</span>{' '}
                  of{' '}
                  <span className="font-semibold text-[#211B19]">
                    {totalPages}
                  </span>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E3E0] text-[#6B6B6B] transition-colors hover:border-[#5A1E2B]/30 hover:bg-[#5A1E2B]/5 hover:text-[#5A1E2B] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronLeft size={17} />
                  </button>

                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E3E0] text-[#6B6B6B] transition-colors hover:border-[#5A1E2B]/30 hover:bg-[#5A1E2B]/5 hover:text-[#5A1E2B] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Upload / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#211B19]/45 p-4 backdrop-blur-[2px]">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-[#E8E3E0] bg-white shadow-[0_20px_60px_rgba(33,27,25,0.18)]">
            <div className="flex items-center justify-between border-b border-[#E8E3E0] bg-[#FCFBFA] px-6 py-4">
              <div>
                <h2 className="font-heading text-lg font-bold text-[#42151F]">
                  {editingImage ? 'Edit Image' : 'Upload Image'}
                </h2>
                <p className="mt-0.5 text-xs text-[#8A8582]">
                  {editingImage
                    ? 'Update gallery image details'
                    : 'Add a new image to the gallery'}
                </p>
              </div>

              <button
                onClick={handleClose}
                className="rounded-lg p-2 text-[#6B6B6B] transition-colors hover:bg-[#F1EFEC] hover:text-[#211B19]"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-h-[calc(90vh-76px)] space-y-5 overflow-y-auto p-6"
            >
              <div>
                <label className="mb-2 block text-xs font-semibold text-[#42151F]">
                  Image File
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full cursor-pointer rounded-xl border border-[#E8E3E0] bg-white text-sm text-[#6B6B6B] file:mr-4 file:border-0 file:bg-[#5A1E2B]/5 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-[#5A1E2B] hover:file:bg-[#5A1E2B]/10"
                />

                {preview && (
                  <div className="relative mt-3 aspect-video overflow-hidden rounded-xl border border-[#E8E3E0] bg-[#F7F7F5]">
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-[#42151F]">
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#E8E3E0] bg-white px-3.5 py-2.5 text-sm text-[#211B19] outline-none transition-all focus:border-[#5A1E2B] focus:ring-2 focus:ring-[#5A1E2B]/10"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-[#42151F]">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#E8E3E0] bg-white px-3.5 py-2.5 text-sm text-[#211B19] outline-none focus:border-[#5A1E2B] focus:ring-2 focus:ring-[#5A1E2B]/10"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-[#42151F]">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={form.altText}
                  onChange={(e) =>
                    setForm({ ...form, altText: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#E8E3E0] bg-white px-3.5 py-2.5 text-sm text-[#211B19] outline-none focus:border-[#5A1E2B] focus:ring-2 focus:ring-[#5A1E2B]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-[#42151F]">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full resize-none rounded-xl border border-[#E8E3E0] bg-white px-3.5 py-2.5 text-sm text-[#211B19] outline-none focus:border-[#5A1E2B] focus:ring-2 focus:ring-[#5A1E2B]/10"
                  rows={3}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-[#42151F]">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sortOrder: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="w-full rounded-xl border border-[#E8E3E0] bg-white px-3.5 py-2.5 text-sm text-[#211B19] outline-none focus:border-[#5A1E2B] focus:ring-2 focus:ring-[#5A1E2B]/10"
                />
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-[#E8E3E0] bg-[#FAF9F7] p-3.5">
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        isPublished: e.target.checked,
                      })
                    }
                    className="peer sr-only"
                  />
                  <div className="h-6 w-11 rounded-full bg-[#D9D5D1] transition-colors peer-checked:bg-[#5A1E2B] peer-focus:ring-2 peer-focus:ring-[#5A1E2B]/20 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full" />
                </label>

                <div>
                  <p className="text-sm font-semibold text-[#211B19]">
                    Published
                  </p>
                  <p className="text-xs text-[#8A8582]">
                    Make this image visible in the published gallery
                  </p>
                </div>
              </div>

              <div className="h-px bg-[#C6A15B]/30" />

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5A1E2B] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#42151F] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                {submitting
                  ? 'Saving...'
                  : editingImage
                    ? 'Update Image'
                    : 'Upload Image'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#211B19]/45 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-2xl border border-[#E8E3E0] bg-white p-6 shadow-[0_20px_60px_rgba(33,27,25,0.18)]">
            <div className="mb-5 flex items-start gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  confirmAction.type === 'permanent'
                    ? 'bg-red-50 text-red-600'
                    : 'bg-[#5A1E2B]/5 text-[#5A1E2B]'
                }`}
              >
                {confirmAction.type === 'permanent' ? (
                  <Trash2 size={18} />
                ) : (
                  <Archive size={18} />
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#42151F]">
                  {confirmAction.type === 'permanent'
                    ? 'Permanent Delete'
                    : 'Archive Image'}
                </h3>

                <p className="mt-1 text-sm text-[#6B6B6B]">
                  Are you sure you want to{' '}
                  {confirmAction.type === 'permanent'
                    ? 'permanently delete'
                    : 'archive'}{' '}
                  "{confirmAction.item.title}"?
                </p>
              </div>
            </div>

            {confirmAction.type === 'permanent' ? (
              <p className="mb-5 rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-700">
                This action cannot be undone.
              </p>
            ) : (
              <p className="mb-5 rounded-xl border border-[#E8E3E0] bg-[#FAF9F7] p-3 text-sm text-[#6B6B6B]">
                You can restore this image later.
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setConfirmAction(null)}
                className="rounded-xl border border-[#E8E3E0] px-4 py-2.5 text-sm font-semibold text-[#6B6B6B] transition-colors hover:bg-[#F7F7F5] hover:text-[#211B19]"
              >
                Cancel
              </button>

              <button
                onClick={executeConfirm}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors ${
                  confirmAction.type === 'permanent'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-[#5A1E2B] hover:bg-[#42151F]'
                }`}
              >
                {confirmAction.type === 'permanent'
                  ? 'Delete Permanently'
                  : 'Archive'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

};

export default Gallery;
