import { Database } from "../ui/icons";

export function DownloadReportScreen() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <Database className="h-8 w-8" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-slate-900">Download Medical Report</h2>
        <p className="mt-2 text-slate-600">
          Your unified medical history report will be generated as a PDF. This feature will be available when the backend is connected.
        </p>
        <button
          disabled
          className="mt-6 rounded-2xl bg-slate-200 px-6 py-3 font-semibold text-slate-500 cursor-not-allowed"
        >
          Generate Report (Coming Soon)
        </button>
      </div>
    </div>
  );
}
