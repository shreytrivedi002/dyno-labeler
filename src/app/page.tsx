
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function validate(formData: FormData) {
  "use server";
  const password = formData.get("password");
  const isValid = typeof password === "string" && password === "password-shrey";

  const cookieStore = await cookies();

  if (isValid) {
    cookieStore.set("basicCheck", "true", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
  } else {
    cookieStore.set("basicCheck", "", { path: "/", maxAge: 0 });
  }

  redirect("/");
}

export default async function Home() {
  const cookieStore = await cookies();
  const basicCheck = cookieStore.get("basicCheck")?.value === "true";

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      {
        !basicCheck && (
          <div className="max-w-2xl w-full text-center">
            <h1 className="mb-4">Content of this page is locked. Validate your identity to access the content.</h1>
            <form action={validate} className="flex items-center justify-center gap-2">
              <input
                name="password"
                type="password"
                className="border border-black/10 rounded-md h-11 px-3 w-64"
                placeholder="Enter password"
                aria-label="Password"
                required
              />
              <button type="submit" className="inline-flex items-center justify-center rounded-md h-11 px-5 bg-[var(--primary)] text-white hover:opacity-95">
                Validate
              </button>
            </form>
          </div>
        )
      }
      {
        basicCheck && (
          <div className="max-w-2xl w-full text-center">
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-3">Dyno Labels</h1>
            <p className="text-black/60 mb-8">Generate live price labels with QR and barcodes for jewellery products. Manage materials and products with a clean, mobile-first dashboard.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="/login" className="inline-flex items-center justify-center rounded-md h-11 px-5 bg-[var(--primary)] text-white hover:opacity-95">Login</a>
              <a href="/register" className="inline-flex items-center justify-center rounded-md h-11 px-5 border border-black/10 hover:bg-black/5">Sign up</a>
            </div>
          </div>
        )
      }
    </main>
  );
}
