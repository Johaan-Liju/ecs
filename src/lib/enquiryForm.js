/* --------------------------------------------------------------------------
   Posting an enquiry.

   There is no server behind this site, so the email and call-back paths go to
   Web3Forms. The access key lives in `.env` as VITE_FORM_ENDPOINT — never in a
   component. Without it the two posted paths shut themselves off and say so,
   rather than swallowing an enquiry.

   XHR rather than fetch, because fetch cannot report upload progress and
   people here attach photographs of handwritten lists over patchy mobile data.
   -------------------------------------------------------------------------- */

const API = "https://api.web3forms.com/submit";

const KEY = import.meta.env.VITE_FORM_ENDPOINT ?? "";

/** False until a real access key is configured. */
export const hasFormBackend = Boolean(KEY) && !KEY.trim().startsWith("[");

/**
 * File uploads are a Web3Forms **Pro** feature. Verified against the live key:
 * a POST carrying `attachment_1` comes back 400 "You are trying to use a Pro
 * feature, Please upgrade to use file uploads" — the whole enquiry is lost,
 * not just the file.
 *
 * So the upload zone stays hidden until someone sets VITE_FORM_ATTACHMENTS to
 * true, which should happen at the same moment the plan is upgraded.
 */
export const attachmentsEnabled =
  hasFormBackend && String(import.meta.env.VITE_FORM_ATTACHMENTS ?? "") === "true";

/**
 * A ten-digit Indian number, however the visitor chose to punctuate it.
 *
 * Country code and trunk zero are only stripped while the number is still too
 * long — 9198765432 is itself a valid mobile, and must not lose its own 91.
 */
export function normalisePhone(input) {
  let digits = String(input).replace(/\D/g, "");
  while (digits.length > 10 && (digits.startsWith("0") || digits.startsWith("91"))) {
    digits = digits.startsWith("0") ? digits.slice(1) : digits.slice(2);
  }
  return digits.length === 10 ? digits : null;
}

export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

/**
 * Posts to Web3Forms, reporting upload progress as a 0–1 fraction.
 * Resolves on success; rejects with a message fit to show the visitor.
 */
export function postEnquiry({ fields, files = [], onProgress }) {
  return new Promise((resolve, reject) => {
    if (!hasFormBackend) {
      reject(new Error("This form is not connected yet."));
      return;
    }

    const body = new FormData();
    body.append("access_key", KEY);
    Object.entries(fields).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v).trim() !== "") body.append(k, v);
    });
    files.forEach((file, i) => body.append(`attachment_${i + 1}`, file, file.name));

    const xhr = new XMLHttpRequest();
    xhr.open("POST", API);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.timeout = 90_000;

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) onProgress?.(e.loaded / e.total);
    });

    xhr.addEventListener("load", () => {
      let payload = {};
      try {
        payload = JSON.parse(xhr.responseText);
      } catch {
        /* a non-JSON body is handled by the status check below */
      }
      if (xhr.status >= 200 && xhr.status < 300 && payload.success !== false) {
        resolve(payload);
      } else {
        reject(new Error(payload.message || `The form service returned ${xhr.status}.`));
      }
    });

    xhr.addEventListener("error", () =>
      reject(new Error("We could not reach the form service. Check your connection.")),
    );
    xhr.addEventListener("timeout", () =>
      reject(new Error("That took too long — the files may be large for this connection.")),
    );

    xhr.send(body);
  });
}
