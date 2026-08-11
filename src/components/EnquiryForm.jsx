import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Check, Loader2, Mail, MessageCircle, Phone } from "lucide-react";

import TextField from "./TextField";
import SelectField from "./SelectField";
import SegmentedControl from "./SegmentedControl";
import FileDrop from "./FileDrop";
import { useEnquiry } from "../context/enquiryContext";
import { CONTACT, waLink } from "../lib/contact";
import {
  attachmentsEnabled,
  hasFormBackend,
  isEmail,
  normalisePhone,
  postEnquiry,
} from "../lib/enquiryForm";

/* --------------------------------------------------------------------------
   The visitor picks how the enquiry reaches ECS. WhatsApp is the default —
   it is what this market actually uses.

   The one hard constraint: a wa.me deep link carries text and nothing else.
   Attachments cannot ride along, so the upload zone only exists on the email
   path, and the WhatsApp path says plainly where files should go instead.
   -------------------------------------------------------------------------- */

const ALL_CHANNELS = [
  { value: "whatsapp", label: "WhatsApp", icon: <MessageCircle size={15} aria-hidden /> },
  { value: "email", label: "Email", icon: <Mail size={15} aria-hidden /> },
  { value: "callback", label: "Call me back", icon: <Phone size={15} aria-hidden /> },
];

/* The posted paths need a form key. Without one they are not offered at all,
   rather than being offered and then failing — WhatsApp needs no backend. */
const CHANNELS = hasFormBackend ? ALL_CHANNELS : ALL_CHANNELS.slice(0, 1);

const BUYER_TYPES = [
  { value: "", label: "Choose one (optional)" },
  { value: "Building a house", label: "Building a house" },
  { value: "Running a contract", label: "Running a contract" },
  { value: "Developing a project", label: "Developing a project" },
  { value: "Buying for resale", label: "Buying for resale" },
  { value: "Building from abroad", label: "Building from abroad" },
];

const SLOTS = [
  "Any time",
  "Morning, 9am to 12pm",
  "Afternoon, 12pm to 4pm",
  "Evening, 4pm to 7pm",
];

const EMPTY = { name: "", phone: "", email: "", place: "", iam: "", need: "", slot: SLOTS[0] };

export default function EnquiryForm() {
  const { asText, count } = useEnquiry();
  const reduced = useReducedMotion();

  const [channel, setChannel] = useState("whatsapp");
  const [form, setForm] = useState(EMPTY);
  const [files, setFiles] = useState([]);
  const [botcheck, setBotcheck] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | failed
  const [progress, setProgress] = useState(null);
  const [failure, setFailure] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const busy = status === "sending";
  const isCallback = channel === "callback";
  const isEmailPath = channel === "email";

  /**
   * The enquiry as a block of text — used for WhatsApp and as the email body.
   *
   * A call-back carries the three things it needs and nothing else, even if
   * the visitor typed more before switching tabs.
   */
  const composeMessage = () => {
    if (isCallback) {
      return [
        `Hello ECS, this is ${form.name.trim()}.`,
        `Phone: ${form.phone.trim()}`,
        `Best time to call: ${form.slot}`,
      ].join("\n");
    }

    const list = asText();
    return [
      `Hello ECS, this is ${form.name.trim()}.`,
      `Phone: ${form.phone.trim()}`,
      form.email.trim() && `Email: ${form.email.trim()}`,
      form.place.trim() && `Site: ${form.place.trim()}`,
      form.iam && `I am: ${form.iam}`,
      form.need.trim() && `Requirement: ${form.need.trim()}`,
      list && `\nEnquiry list:\n${list}`,
    ]
      .filter(Boolean)
      .join("\n");
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Please tell us your name.";
    if (!normalisePhone(form.phone)) next.phone = "Enter a 10-digit mobile number.";
    if (isEmailPath && !isEmail(form.email)) next.email = "We need an email to reply to.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const openWhatsApp = () => window.open(waLink(composeMessage()), "_blank", "noopener");

  const submit = async (e) => {
    e.preventDefault();
    if (busy || !validate()) return;

    // Honeypot: a real visitor never sees this box, so a tick means a bot.
    // It is dropped silently rather than told what gave it away.
    if (botcheck) {
      setStatus("sent");
      return;
    }

    if (channel === "whatsapp") {
      openWhatsApp();
      setStatus("sent");
      return;
    }

    setStatus("sending");
    setFailure("");
    if (isEmailPath && files.length) setProgress(0);

    try {
      await postEnquiry({
        fields: {
          subject: isCallback
            ? `Call-back request — ${form.name.trim()}`
            : `Website enquiry — ${form.name.trim()}`,
          from_name: "ECS website",
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: isCallback ? "" : form.email.trim(),
          site_location: isCallback ? "" : form.place.trim(),
          i_am: isCallback ? "" : form.iam,
          requirement: isCallback ? "" : form.need.trim(),
          preferred_time: isCallback ? form.slot : "",
          enquiry_list: isCallback ? "" : asText(),
          message: composeMessage(),
        },
        files: isEmailPath && attachmentsEnabled ? files : [],
        onProgress: setProgress,
      });
      setStatus("sent");
    } catch (err) {
      // Nothing the visitor typed is cleared — they can retry or fall back.
      setFailure(err.message);
      setStatus("failed");
    } finally {
      setProgress(null);
    }
  };

  const reset = () => {
    setForm(EMPTY);
    setFiles([]);
    setErrors({});
    setFailure("");
    setStatus("idle");
  };

  /* ------------------------------------------------------------ sent */
  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-concrete-line bg-white p-6 text-center sm:p-8">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-mark text-ink">
          <Check size={22} aria-hidden />
        </span>
        <h2 className="mt-4 font-display text-xl font-bold text-navy">
          {channel === "whatsapp" ? "WhatsApp is open" : "Enquiry sent"}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-navy/60">
          {channel === "whatsapp"
            ? "Send the message and we will come back with rates and availability."
            : "We will come back with rates, availability and a delivery window."}
        </p>

        {channel === "whatsapp" && (
          <button
            type="button"
            onClick={openWhatsApp}
            className="mt-5 font-display text-sm font-semibold text-azure underline underline-offset-4"
          >
            Did not open? Try again
          </button>
        )}

        <button
          type="button"
          onClick={reset}
          className="mt-6 block w-full rounded-full border border-navy/15 px-5 py-3 font-display font-semibold text-navy hover:bg-concrete"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  /* ------------------------------------------------------------ form */
  return (
    <form
      onSubmit={submit}
      noValidate
      className="rounded-2xl border border-concrete-line bg-white p-6 sm:p-8"
    >
      <h2 className="font-display text-xl font-bold text-navy">Quick enquiry</h2>
      <p className="mt-1 text-sm text-navy/55">
        {count > 0
          ? `Your ${count} listed item${count > 1 ? "s go" : " goes"} with the message.`
          : "Tell us what you need and how to reach you."}
      </p>

      {CHANNELS.length > 1 && (
        <div className="mt-5">
          <SegmentedControl
            name="channel"
            legend="How should we receive this enquiry?"
            value={channel}
            onChange={setChannel}
            options={CHANNELS}
          />
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <TextField
          id="name"
          label="Your name"
          value={form.name}
          onChange={set("name")}
          error={errors.name}
          autoComplete="name"
          maxLength={80}
          className="sm:col-span-2"
        />
        <TextField
          id="phone"
          label="Phone"
          type="tel"
          inputMode="tel"
          value={form.phone}
          onChange={set("phone")}
          error={errors.phone}
          autoComplete="tel"
          maxLength={18}
          className={isCallback ? "" : "sm:col-span-1"}
        />

        {isCallback && (
          <SelectField
            id="slot"
            label="Best time to call"
            value={form.slot}
            onChange={set("slot")}
            options={SLOTS}
          />
        )}

        {isEmailPath && (
          <TextField
            id="email"
            label="Email"
            type="email"
            inputMode="email"
            value={form.email}
            onChange={set("email")}
            error={errors.email}
            autoComplete="email"
            maxLength={120}
          />
        )}

        {!isCallback && (
          <>
            <TextField
              id="place"
              label="Site location"
              value={form.place}
              onChange={set("place")}
              placeholder="Town or panchayat"
              maxLength={80}
              className={isEmailPath ? "sm:col-span-2" : ""}
            />
            <SelectField
              id="iam"
              label="I am"
              value={form.iam}
              onChange={set("iam")}
              options={BUYER_TYPES}
              className="sm:col-span-2"
            />
            <TextField
              id="need"
              as="textarea"
              label="What do you need?"
              value={form.need}
              onChange={set("need")}
              placeholder="e.g. 3 MT of 12 mm and 200 bags of PPC"
              maxLength={600}
              rows={4}
              className="sm:col-span-2"
            />
          </>
        )}
      </div>

      {/* ------------------------------------------------- attachments */}
      {isEmailPath &&
        (attachmentsEnabled ? (
          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold text-navy">Drawings or lists</p>
            <FileDrop files={files} onChange={setFiles} progress={progress} busy={busy} />
          </div>
        ) : (
          <p className="mt-5 rounded-xl bg-azure-mist px-4 py-3 text-sm text-navy/70">
            Have a drawing or a bar bending schedule? Send it to{" "}
            <a href={`mailto:${CONTACT.email}`} className="font-semibold text-azure underline">
              {CONTACT.email}
            </a>{" "}
            or on WhatsApp — this form takes text only.
          </p>
        ))}

      {channel === "whatsapp" && (
        <p className="mt-5 rounded-xl bg-azure-mist px-4 py-3 text-sm text-navy/70">
          Attachments go by email — or send files straight to our WhatsApp once the chat opens.
        </p>
      )}

      {/* Honeypot. Hidden from people and from assistive tech; bots fill it in. */}
      <div aria-hidden className="hidden">
        <label htmlFor="botcheck">Leave this field empty</label>
        <input
          id="botcheck"
          name="botcheck"
          type="checkbox"
          tabIndex={-1}
          autoComplete="off"
          checked={botcheck}
          onChange={(e) => setBotcheck(e.target.checked)}
        />
      </div>

      {status === "failed" && (
        <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-semibold text-red-700">That did not send.</p>
          <p className="mt-1 text-sm text-red-700/80">{failure}</p>
          <p className="mt-2 text-sm text-red-700/80">
            Nothing you typed has been lost. Try again, or
            <button
              type="button"
              onClick={openWhatsApp}
              className="ml-1 font-semibold underline underline-offset-2"
            >
              send it on WhatsApp instead
            </button>
            .
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-mark px-5 py-3.5 font-display font-semibold text-ink transition-colors hover:bg-[#ffd033] disabled:cursor-not-allowed disabled:opacity-55"
      >
        {busy ? (
          <>
            {reduced ? (
              <Loader2 size={17} aria-hidden />
            ) : (
              <Loader2 size={17} aria-hidden className="animate-spin" />
            )}
            Sending…
          </>
        ) : (
          <>
            {CHANNELS.find((c) => c.value === channel).icon}
            {channel === "whatsapp" && "Send on WhatsApp"}
            {channel === "email" && "Send by email"}
            {channel === "callback" && "Request a call back"}
          </>
        )}
      </button>

      <p className="mt-3 text-center text-xs text-navy/45">
        {channel === "whatsapp"
          ? "Nothing is stored on this site. The message opens in WhatsApp for you to send."
          : "Your details go straight to the ECS counter. No account, no newsletter."}
      </p>
    </form>
  );
}
