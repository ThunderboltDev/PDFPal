"use client";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold">404</h1>
        <p className="text-2xl mt-4">Oops! Page not found.</p>
        <p className="mt-2">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
    </div>
  );
}
