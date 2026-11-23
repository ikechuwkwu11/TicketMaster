import { useRef, useState } from 'react';
import { useCatalog } from '../../context/CatalogContext';

export default function ImageField({ value, onChange, label = 'Image' }) {
  const { images, addImage } = useCatalog();
  const inputRef = useRef(null);
  const [mode, setMode] = useState('url');
  const [busy, setBusy] = useState(false);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const entry = await addImage(file);
      if (entry?.url) onChange(entry.url);
    } catch (err) {
      alert(err.message || 'Upload failed');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[12px] font-bold text-[#334155]">{label}</span>
        <div className="flex gap-2 text-[12px] font-semibold">
          <button
            type="button"
            onClick={() => setMode('url')}
            className={mode === 'url' ? 'text-[#0F172A]' : 'text-[#94A3B8]'}
          >
            URL / path
          </button>
          <button
            type="button"
            onClick={() => setMode('library')}
            className={mode === 'library' ? 'text-[#0F172A]' : 'text-[#94A3B8]'}
          >
            Library
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-[#0369A1]"
          >
            Upload
          </button>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFile}
      />

      {mode === 'url' ? (
        <input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/images/example.jpg or https://..."
          className="mt-1.5 w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2.5 text-[14px] text-[#0F172A] outline-none focus:border-[#0F172A]"
        />
      ) : (
        <div className="mt-1.5 grid max-h-48 grid-cols-4 gap-2 overflow-y-auto rounded-md border border-[#CBD5E1] p-2">
          {images.length === 0 ? (
            <p className="col-span-4 py-6 text-center text-[12px] text-[#94A3B8]">
              No uploaded images yet.
            </p>
          ) : (
            images.map((img) => (
              <button
                key={img.id}
                type="button"
                onClick={() => onChange(img.url)}
                className={`overflow-hidden rounded border ${
                  value === img.url ? 'border-[#0F172A]' : 'border-transparent'
                }`}
              >
                <img
                  src={img.url}
                  alt=""
                  className="aspect-square w-full bg-[#F1F5F9] object-contain object-center"
                />
              </button>
            ))
          )}
        </div>
      )}

      {value ? (
        <img
          src={value}
          alt=""
          className="mt-3 h-36 w-full rounded-md bg-[#F1F5F9] object-contain object-center"
        />
      ) : null}
      {busy ? (
        <p className="mt-2 text-[12px] text-[#64748B]">Uploading…</p>
      ) : null}
    </div>
  );
}
