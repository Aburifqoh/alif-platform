"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@alif/database/client";
import {
  User, Home, FileText, CheckCircle2,
  ChevronRight, ChevronLeft, Building2, Upload, X
} from "lucide-react";

const STEPS = ["Personal Details", "Room Preference", "Documents", "Review & Submit"];

const CURRENT_SESSION = "2025/2026";

export default function ApplyPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    // Step 1: Personal
    purpose: "student" as "student" | "worker" | "other",
    next_of_kin_name: "",
    next_of_kin_phone: "",
    next_of_kin_rel: "",
    // Step 2: Room
    room_type: "shared" as "single" | "shared" | "suite",
    hostel_gender: "male" as "male" | "female" | "mixed",
    hostel_slug: "" as string,
    // Step 3: Documents
    documents: [] as { name: string; url: string; type: string }[],
    // Meta
    session: CURRENT_SESSION,
  });

  const [uploadingDoc, setUploadingDoc] = useState(false);

  const update = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDoc(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const ext = file.name.split(".").pop();
      const path = `hostel-docs/${user.id}/${docType}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("documents").getPublicUrl(path);
      update("documents", [
        ...form.documents.filter((d) => d.type !== docType),
        { name: docType === "passport" ? "Passport Photo" : "Valid ID", url: publicUrl, type: docType },
      ]);
    } catch (err: unknown) {
      setError((err as Error)?.message ?? "Upload failed");
    } finally {
      setUploadingDoc(false);
    }
  };

  const removeDoc = (type: string) =>
    update("documents", form.documents.filter((d) => d.type !== type));

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const res = await fetch("/api/hostel/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          applicant_id: user.id,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Submission failed");
      setSubmitted(true);
    } catch (err: unknown) {
      setError((err as Error)?.message ?? "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-brand-red-subtle dark:bg-brand-red-dark/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-brand-red dark:text-brand-red-light" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-[Outfit] mb-2">
            Application Submitted!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Your hostel application for <strong>{CURRENT_SESSION}</strong> has been received. A confirmation email has been sent to you. Our team will review and respond within 3–5 working days.
          </p>
          <button
            onClick={() => router.push("/portal/hostel/application")}
            className="w-full py-3 bg-gradient-to-r from-brand-red to-brand-red-dark text-white font-semibold rounded-xl font-[Outfit]"
          >
            Track Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-[Outfit]">
          Apply for Accommodation
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Session {CURRENT_SESSION} · Complete all steps to submit your application
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-0 mb-8 overflow-x-auto">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${i < step ? "bg-brand-red text-white" : i === step ? "bg-brand-red text-white ring-4 ring-emerald-100 dark:ring-emerald-950" : "bg-gray-100 dark:bg-white/8 text-gray-400"}`}
              >
                {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs mt-1 font-medium whitespace-nowrap ${i === step ? "text-brand-red dark:text-brand-red-light" : "text-gray-400"}`}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-12 sm:w-20 h-0.5 mx-1 -mt-4 ${i < step ? "bg-brand-red" : "bg-gray-200 dark:bg-white/10"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-100 dark:border-white/8 p-6 sm:p-8 max-w-2xl">
        {/* Step 1: Personal */}
        {step === 0 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-brand-red-subtle dark:bg-brand-red-dark/30 flex items-center justify-center">
                <User className="w-4 h-4 text-brand-red dark:text-brand-red-light" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white font-[Outfit]">Personal Details</h2>
                <p className="text-xs text-gray-400">Tell us about yourself and your next of kin</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Purpose of Stay <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["student", "worker", "other"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => update("purpose", p)}
                    className={`py-2.5 rounded-xl text-sm font-medium capitalize border transition-all
                      ${form.purpose === p
                        ? "bg-brand-red text-white border-brand-red"
                        : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-brand-red dark:hover:border-brand-red"
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-white/8">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Next of Kin / Emergency Contact</p>
              <div className="space-y-4">
                {[
                  { field: "next_of_kin_name",  label: "Full Name",    placeholder: "e.g. Ibrahim Musa",        type: "text" },
                  { field: "next_of_kin_phone", label: "Phone Number", placeholder: "e.g. 08012345678",          type: "tel" },
                  { field: "next_of_kin_rel",   label: "Relationship", placeholder: "e.g. Father, Mother, Spouse", type: "text" },
                ].map(({ field, label, placeholder, type }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label} <span className="text-red-500">*</span></label>
                    <input
                      type={type}
                      value={form[field as keyof typeof form] as string}
                      onChange={(e) => update(field, e.target.value)}
                      placeholder={placeholder}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f5132]/20 focus:border-brand-red dark:focus:border-brand-red transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Room Preference */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                <Home className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white font-[Outfit]">Room Preference</h2>
                <p className="text-xs text-gray-400">Choose your preferred hostel and room type</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Hostel <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {[
                  {
                    value:  "al-abraar",
                    gender: "male",
                    label:  "Al-Abraar Hostel",
                    desc:   "Male only · 10 shared rooms · ALIF Campus",
                    badge:  "Male",
                    badgeColor: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30",
                  },
                  {
                    value:  "sky-villa-male",
                    gender: "male",
                    label:  "Sky Villa — Male Block",
                    desc:   "Male only · 16 shared rooms · Sky Villa Campus",
                    badge:  "Male",
                    badgeColor: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30",
                  },
                  {
                    value:  "sky-villa-female",
                    gender: "female",
                    label:  "Sky Villa — Female Block",
                    desc:   "Female only · 22 shared rooms · Sky Villa Campus",
                    badge:  "Female",
                    badgeColor: "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/30",
                  },
                  {
                    value:  "sky-villa-married",
                    gender: "mixed",
                    label:  "Sky Villa — Married Quarters",
                    desc:   "Married students only · 2 suite rooms · Sky Villa Campus",
                    badge:  "Married",
                    badgeColor: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/30",
                  },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      update("hostel_gender", opt.gender);
                      update("hostel_slug", opt.value);
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all
                      ${form.hostel_slug === opt.value
                        ? "bg-brand-red-subtle dark:bg-brand-red-dark/20 border-brand-red dark:border-emerald-600"
                        : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
                      }`}
                  >
                    <div>
                      <div className={`text-sm font-semibold ${form.hostel_slug === opt.value ? "text-brand-red dark:text-brand-red-light" : "text-gray-900 dark:text-white"}`}>{opt.label}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{opt.desc}</div>
                    </div>
                    <span className={`flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-semibold ${opt.badgeColor}`}>{opt.badge}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Room Type <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {[
                  { value: "shared", label: "Shared Room",  desc: "2–4 residents per room", fee: "₦45,000/session" },
                  { value: "single", label: "Single Room",  desc: "Private room for one person", fee: "₦80,000/session" },
                  { value: "suite",  label: "Suite",        desc: "En-suite room with private bathroom", fee: "₦120,000/session" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => update("room_type", opt.value)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all
                      ${form.room_type === opt.value
                        ? "bg-brand-red-subtle dark:bg-brand-red-dark/20 border-brand-red dark:border-emerald-600"
                        : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
                      }`}
                  >
                    <div>
                      <div className={`text-sm font-semibold ${form.room_type === opt.value ? "text-brand-red dark:text-brand-red-light" : "text-gray-900 dark:text-white"}`}>{opt.label}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{opt.desc}</div>
                    </div>
                    <span className={`text-sm font-bold ${form.room_type === opt.value ? "text-brand-red dark:text-brand-red-light" : "text-gray-500"}`}>{opt.fee}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Documents */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center">
                <Upload className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white font-[Outfit]">Upload Documents</h2>
                <p className="text-xs text-gray-400">Required: passport photo and a valid ID</p>
              </div>
            </div>

            {[
              { type: "passport", label: "Passport Photograph", hint: "Clear recent photo, JPG/PNG, max 2MB" },
              { type: "id",       label: "Valid ID",             hint: "NIN slip, student ID, or national ID card" },
            ].map((doc) => {
              const uploaded = form.documents.find((d) => d.type === doc.type);
              return (
                <div key={doc.type}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {doc.label} <span className="text-red-500">*</span>
                  </label>
                  {uploaded ? (
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-brand-red-tint dark:border-brand-red-dark bg-brand-red-subtle dark:bg-brand-red-dark/20">
                      <CheckCircle2 className="w-5 h-5 text-brand-red dark:text-brand-red-light flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate">{uploaded.name}</span>
                      <button type="button" onClick={() => removeDoc(doc.type)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center gap-2 p-6 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 cursor-pointer hover:border-brand-red dark:hover:border-emerald-600 transition-colors">
                      <Upload className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                      <span className="text-sm text-gray-500 dark:text-gray-400 text-center">
                        Click to upload<br /><span className="text-xs">{doc.hint}</span>
                      </span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="sr-only"
                        onChange={(e) => handleUpload(e, doc.type)}
                        disabled={uploadingDoc}
                      />
                    </label>
                  )}
                </div>
              );
            })}

            {uploadingDoc && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-[#0f5132] rounded-full animate-spin" />
                Uploading...
              </div>
            )}
          </div>
        )}

        {/* Step 4: Review */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center">
                <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white font-[Outfit]">Review & Submit</h2>
                <p className="text-xs text-gray-400">Confirm your details before submitting</p>
              </div>
            </div>

            {[
              { label: "Session",        value: form.session },
              { label: "Purpose",        value: form.purpose.charAt(0).toUpperCase() + form.purpose.slice(1) },
              { label: "Hostel",         value: {
                  "al-abraar":       "Al-Abraar Hostel (Male)",
                  "sky-villa-male":  "Sky Villa — Male Block",
                  "sky-villa-female":"Sky Villa — Female Block",
                  "sky-villa-married":"Sky Villa — Married Quarters",
                }[form.hostel_slug] ?? "Not selected" },
              { label: "Room Type",      value: form.room_type.charAt(0).toUpperCase() + form.room_type.slice(1) },
              { label: "Next of Kin",    value: form.next_of_kin_name || "—" },
              { label: "NOK Phone",      value: form.next_of_kin_phone || "—" },
              { label: "NOK Relation",   value: form.next_of_kin_rel || "—" },
              { label: "Documents",      value: form.documents.length > 0 ? form.documents.map(d => d.name).join(", ") : "None uploaded" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm border-b border-gray-50 dark:border-white/5 pb-2">
                <span className="text-gray-500 dark:text-gray-400">{label}</span>
                <span className="font-medium text-gray-900 dark:text-white text-right ml-4">{value}</span>
              </div>
            ))}

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 text-sm text-amber-800 dark:text-amber-300">
              By submitting, you agree that the information provided is accurate. Payment will only be required after your application is approved by the hostel manager.
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-red to-brand-red-dark text-white text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all font-[Outfit]"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-red to-brand-red-dark text-white text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 transition-all font-[Outfit]"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><CheckCircle2 className="w-4 h-4" /> Submit Application</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
