import { SignupForm } from "./signup-form";

export const metadata = {
  title: "Sign Up - Homatt Health",
  description: "Create your Homatt Health account in a few easy steps.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-start justify-center bg-gray-50 px-4 pt-12 pb-8">
      <div className="w-full max-w-md">
        {/* Soft header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-emerald-700">
            Homatt Health
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Let's set up your account — it only takes a minute.
          </p>
        </div>

        {/* Card shell */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <SignupForm />
        </div>
      </div>
    </main>
  );
}
