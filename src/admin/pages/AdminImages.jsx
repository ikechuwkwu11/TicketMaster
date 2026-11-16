import { useRef, useState } from 'react';
import { Trash2, Upload } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';

export default function AdminImages() {
  const { images, addImage, deleteImage } = useCatalog();
  const inputRef = useRef(null);
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);

  const onFiles = async (e) => {
    const files = [...(e.target.files || [])];
    if (!files.length) return;
    setBusy(true);
    try {
      for (const file of files) {
        await addImage(file);
      }
    } catch (err) {
      alert(err.message || 'Upload failed');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  const addFromUrl = async () => {
    if (!url.trim()) return;
    try {
      await addImage({
        name: url.trim().split('/').pop() || 'Image',
        url: url.trim(),
      });
      setUrl('');
    } catch (err) {
      alert(err.message || 'Failed to add image');
    }
  };

  return (
    <div className="px-6 py-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-[#0F172A]">Images</h1>
        <p className="mt-1 text-[14px] text-[#64748B]">
          Upload pictures or paste image URLs for events and tickets.
        </p>
      </header>

      <div className="mb-6 grid gap-4 rounded-xl border border-[#E2E8F0] bg-white p-5 lg:grid-cols-2">
        <div>
          <p className="text-[13px] font-bold text-[#0F172A]">Upload from device</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={onFiles}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="mt-3 inline-flex items-center gap-2 rounded-md bg-[#0F172A] px-4 py-2.5 text-[13px] font-bold text-white disabled:opacity-60"
          >
            <Upload className="h-4 w-4" />
            {busy ? 'Uploading…' : 'Choose images'}
          </button>
        </div>
        <div>
          <p className="text-[13px] font-bold text-[#0F172A]">Add by URL / path</p>
          <div className="mt-3 flex gap-2">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="/images/artist.jpg or https://..."
              className="min-w-0 flex-1 rounded-md border border-[#CBD5E1] px-3 py-2.5 text-[14px]"
            />
            <button
              type="button"
              onClick={addFromUrl}
              className="rounded-md bg-[#0F172A] px-4 py-2.5 text-[13px] font-bold text-white"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {images.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[#CBD5E1] bg-white py-16 text-center text-[14px] text-[#94A3B8]">
          No custom images yet. Upload one to use it on events and tickets.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {images.map((img) => (
            <div
              key={img.id}
              className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white"
            >
              <img src={img.url} alt="" className="aspect-[4/3] w-full object-cover" />
              <div className="flex items-start justify-between gap-2 p-3">
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-semibold text-[#0F172A]">
                    {img.name}
                  </p>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(img.url)}
                    className="mt-1 text-[11px] font-semibold text-[#0369A1]"
                  >
                    Copy reference
                  </button>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm('Delete this image from the library?')) return;
                    try {
                      await deleteImage(img.id);
                    } catch (err) {
                      alert(err.message || 'Delete failed');
                    }
                  }}
                  className="rounded p-1.5 text-[#DC2626] hover:bg-[#FEF2F2]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
