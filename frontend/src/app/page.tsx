import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Cloud Hosting Platform
        </h1>
        <p className="text-gray-600 mb-6">
          Manage your cloud servers, monitor performance, and scale your infrastructure
        </p>
        <div className="space-x-4">
          <Link
            href="/auth/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}