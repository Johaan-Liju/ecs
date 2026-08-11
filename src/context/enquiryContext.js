import { createContext, useContext } from "react";

export const EnquiryContext = createContext(null);

/** The shared enquiry list: items, quantities, and the drawer's open state. */
export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error("useEnquiry must be used inside <EnquiryProvider>");
  return ctx;
}
