import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-extrabold text-blue-500 mb-2">404 - Page Not Found</h1>
      <p className="text-slate-400 text-sm mb-6">The page you are looking for does not exist.</p>
      <Link
        href="/dashboard"
        className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-all"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
