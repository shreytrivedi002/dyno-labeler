import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-3">Dyno Labeler</h1>
        <p className="text-black/60 mb-8">Generate live price labels with QR and barcodes for jewellery products. Manage materials and products with a clean, mobile-first dashboard.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="/login" className="inline-flex items-center justify-center rounded-md h-11 px-5 bg-[var(--primary)] text-white hover:opacity-95">Login</a>
          <a href="/register" className="inline-flex items-center justify-center rounded-md h-11 px-5 border border-black/10 hover:bg-black/5">Sign up</a>
        </div>
      </div>
    </main>
  );
}
