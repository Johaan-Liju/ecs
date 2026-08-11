import { useCallback, useEffect, useMemo, useState } from "react";
import { EnquiryContext } from "./enquiryContext";
import { getMaterial } from "../data/materials";

const KEY = "ecs.enquiry.v1";
const MAX_QTY = 99999;

const clamp = (q) => Math.min(MAX_QTY, Math.max(1, parseInt(q, 10) || 1));

const read = () => {
  try {
    const raw = sessionStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed
          .filter((l) => l && getMaterial(l.code))
          .map((l) => ({ code: l.code, qty: clamp(l.qty) }))
      : [];
  } catch {
    return [];
  }
};

/** Holds the enquiry list and mirrors it into sessionStorage. */
export default function EnquiryProvider({ children }) {
  const [lines, setLines] = useState(read);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* private browsing — the list just will not survive a reload */
    }
  }, [lines]);

  const add = useCallback((code, qty = 1) => {
    if (!getMaterial(code)) return;
    setLines((prev) => {
      const found = prev.find((l) => l.code === code);
      if (found) {
        return prev.map((l) => (l.code === code ? { ...l, qty: clamp(l.qty + qty) } : l));
      }
      return [...prev, { code, qty: clamp(qty) }];
    });
  }, []);

  const setQty = useCallback((code, qty) => {
    setLines((prev) => prev.map((l) => (l.code === code ? { ...l, qty: clamp(qty) } : l)));
  }, []);

  const remove = useCallback((code) => {
    setLines((prev) => prev.filter((l) => l.code !== code));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  /** The list rendered as the body of a WhatsApp message. */
  const asText = useCallback(
    () =>
      lines
        .map((l, i) => {
          const m = getMaterial(l.code);
          return `${i + 1}. ${m.name} (${m.code}) — ${l.qty} ${m.unit}`;
        })
        .join("\n"),
    [lines],
  );

  const value = useMemo(
    () => ({
      lines,
      items: lines.map((l) => ({ ...l, material: getMaterial(l.code) })),
      count: lines.length,
      has: (code) => lines.some((l) => l.code === code),
      add,
      setQty,
      remove,
      clear,
      asText,
      open,
      setOpen,
    }),
    [lines, add, setQty, remove, clear, asText, open],
  );

  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>;
}
