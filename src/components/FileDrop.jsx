import { useEffect, useRef, useState } from "react";
import { FileText, Paperclip, X } from "lucide-react";

/* --------------------------------------------------------------------------
   Drawings, bar bending schedules, photos of a handwritten list.

   Drag and drop with a real click-to-browse fallback. Files are validated on
   the way in and rejected one by one with a reason, so a visitor never loses
   the whole batch because of one bad file.
   -------------------------------------------------------------------------- */

/* These two must not exceed what the form plan actually accepts, or the
   attachment is dropped in transit and the enquiry is silently lost. A free
   Web3Forms key takes ONE file of up to 5 MB. On the Pro plan, check the
   plan's real ceiling and raise both — every label and error message below is
   derived from them, so nothing else needs touching. */
const MAX_FILES = 1;
const MAX_BYTES = 5 * 1024 * 1024;

const ACCEPTED = [".pdf", ".jpg", ".jpeg", ".png", ".webp", ".dwg", ".xlsx", ".docx"];

const keyOf = (file) => `${file.name}:${file.size}:${file.lastModified}`;
const extOf = (name) => name.slice(name.lastIndexOf(".")).toLowerCase();
const isImage = (file) => file.type.startsWith("image/");

const formatSize = (bytes) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(1).replace(/\.0$/, "")} MB`;

const LIMIT_LABEL =
  MAX_FILES === 1
    ? `One file, up to ${formatSize(MAX_BYTES)}`
    : `Up to ${MAX_FILES} files, ${formatSize(MAX_BYTES)} each`;

export default function FileDrop({ files, onChange, progress = null, busy = false }) {
  const [dragging, setDragging] = useState(false);
  const [problems, setProblems] = useState([]);
  const [thumbs, setThumbs] = useState({});
  const inputRef = useRef(null);
  const dragDepth = useRef(0);

  // One object URL per image, revoked whenever the set of files changes.
  useEffect(() => {
    const made = files.filter(isImage).map((f) => [keyOf(f), URL.createObjectURL(f)]);
    setThumbs(Object.fromEntries(made));
    return () => made.forEach(([, url]) => URL.revokeObjectURL(url));
  }, [files]);

  const take = (incoming) => {
    const next = [...files];
    const rejected = [];

    for (const file of incoming) {
      if (next.length >= MAX_FILES) {
        rejected.push(
          MAX_FILES === 1
            ? `${file.name} — only one file can go with an enquiry. Remove the other first.`
            : `${file.name} — only ${MAX_FILES} files can go with one enquiry.`,
        );
      } else if (!ACCEPTED.includes(extOf(file.name))) {
        rejected.push(`${file.name} — we can take ${ACCEPTED.join(" ")} only.`);
      } else if (file.size > MAX_BYTES) {
        rejected.push(
          `${file.name} is ${formatSize(file.size)} — the limit is ${formatSize(MAX_BYTES)} per file.`,
        );
      } else if (next.some((f) => keyOf(f) === keyOf(file))) {
        rejected.push(`${file.name} is already attached.`);
      } else {
        next.push(file);
      }
    }

    setProblems(rejected);
    onChange(next);
  };

  const onDrop = (e) => {
    e.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    if (busy) return;
    take(Array.from(e.dataTransfer.files));
  };

  return (
    <div>
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          dragDepth.current += 1;
          setDragging(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          e.preventDefault();
          dragDepth.current -= 1;
          if (dragDepth.current <= 0) setDragging(false);
        }}
        onDrop={onDrop}
        className={
          "rounded-xl border border-dashed px-4 py-6 text-center transition-colors " +
          (dragging ? "border-azure bg-azure-mist" : "border-navy/25 bg-concrete")
        }
      >
        <Paperclip size={18} aria-hidden className="mx-auto text-navy/45" />
        <p className="mt-2 text-sm text-navy/70">
          Drop drawings or photos here, or{" "}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="font-semibold text-azure underline underline-offset-2 disabled:opacity-50"
          >
            browse your files
          </button>
          .
        </p>
        <p className="mt-1 text-xs text-navy/45">
          {LIMIT_LABEL} · PDF, images, DWG, XLSX, DOCX
        </p>

        <input
          ref={inputRef}
          type="file"
          multiple={MAX_FILES > 1}
          accept={ACCEPTED.join(",")}
          className="sr-only"
          onChange={(e) => {
            take(Array.from(e.target.files));
            e.target.value = ""; // so the same file can be re-picked after removal
          }}
        />
      </div>

      {problems.length > 0 && (
        <ul role="alert" className="mt-2 flex flex-col gap-1">
          {problems.map((p) => (
            <li key={p} className="text-xs text-red-600">
              {p}
            </li>
          ))}
        </ul>
      )}

      {files.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {files.map((file) => (
            <li
              key={keyOf(file)}
              className="flex items-center gap-3 rounded-xl border border-concrete-line bg-white p-2"
            >
              {thumbs[keyOf(file)] ? (
                <img
                  src={thumbs[keyOf(file)]}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-concrete text-navy/45">
                  <FileText size={16} aria-hidden />
                </span>
              )}

              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-navy">{file.name}</span>
                <span className="block font-mono text-xs text-navy/45">
                  {formatSize(file.size)}
                </span>
              </span>

              <button
                type="button"
                onClick={() => onChange(files.filter((f) => keyOf(f) !== keyOf(file)))}
                disabled={busy}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-navy/50 hover:bg-concrete hover:text-navy disabled:opacity-40"
              >
                <X size={15} aria-hidden />
                <span className="sr-only">Remove {file.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {progress !== null && (
        <div className="mt-3">
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            aria-label="Upload progress"
            className="h-1.5 overflow-hidden rounded-full bg-concrete-line"
          >
            <div
              className="h-full rounded-full bg-azure transition-[width] duration-200"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <p className="mt-1.5 font-mono text-xs text-navy/45">
            Uploading… {Math.round(progress * 100)}%
          </p>
        </div>
      )}
    </div>
  );
}
