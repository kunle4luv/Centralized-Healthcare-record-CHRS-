import { useState } from "react";
import { Shield } from "../ui/icons";

export function RequestAccessScreen() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
        <div className="flex items-start gap-4">
          <Shield className="h-8 w-8 shrink-0 text-blue-700" />
          <div>
            <h3 className="text-lg font-bold text-blue-900">Request Access to Your Records</h3>
            <p className="mt-2 text-sm text-blue-800">
              For your privacy and security, you cannot directly access your full medical records. To view or download your
              records, please request access through your hospital or doctor. Your doctor will verify your identity and
              approve the request.
            </p>
          </div>
        </div>
      </div>

      {submitted ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <p className="font-semibold text-emerald-800">Request submitted</p>
          <p className="mt-2 text-sm text-emerald-700">
            Visit your hospital or contact your doctor to request access. They will process your request and grant access
            when approved.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-2">Submit a Request</h3>
          <p className="text-sm text-slate-600 mb-4">
            Fill this form and bring it to your hospital, or ask your doctor to submit it on your behalf.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500">Hospital or clinic</label>
              <input
                type="text"
                placeholder="e.g. Lagos General Hospital"
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500">Your doctor (optional)</label>
              <input
                type="text"
                placeholder="e.g. Dr. Chinedu Okafor"
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500">Reason for request</label>
              <select className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2">
                <option>Personal records / Download report</option>
                <option>Second opinion / Referral</option>
                <option>Insurance / Employment</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 rounded-2xl bg-emerald-600 px-6 py-2 font-semibold text-white hover:bg-emerald-700"
          >
            Submit Request
          </button>
        </form>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h4 className="font-semibold text-slate-900">Approved records</h4>
        <p className="mt-2 text-sm text-slate-600">
          Once your doctor approves your request, you will see your records here and in the Download Report section.
        </p>
        <div className="mt-4 rounded-xl bg-slate-50 p-4 text-center text-slate-500 text-sm">
          No approved records yet. Submit a request above.
        </div>
      </div>
    </div>
  );
}
