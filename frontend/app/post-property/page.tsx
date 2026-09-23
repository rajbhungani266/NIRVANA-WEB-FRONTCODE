import { Suspense } from "react";
import PostPropertyForm from "@/components/forms/PostPropertyForm";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PostPropertyPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <section className="bg-soft-blue pb-6 pt-20 sm:pt-22">
        <Navbar />
        <div className="container-box pt-2 sm:pt-3">
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Post Your Property
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Share your requirement or list your property. Our team will reach out
            to help you.
          </p>
        </div>
      </section>

      <section className="container-box py-8">
        <Suspense fallback={<div className="rounded-2xl bg-white p-8 text-center text-slate-500">Loading...</div>}>
          <PostPropertyForm />
        </Suspense>
      </section>

      <Footer />
    </main>
  );
}
