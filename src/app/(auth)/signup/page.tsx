"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CheckCircle2, Kanban, BarChart3, Shield } from "lucide-react";
import { signupAction, type AuthState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

const initialState: AuthState = {};

const features = [
  {
    icon: Kanban,
    title: "Kanban Board",
    description: "Organize tasks across To Do, In Progress, and Done",
  },
  {
    icon: BarChart3,
    title: "Live Analytics",
    description: "Track completion rates and priority breakdowns",
  },
  {
    icon: Shield,
    title: "Secure Auth",
    description: "Powered by Supabase with row-level auth",
  },
];

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(
    signupAction,
    initialState
  );

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2">
      {/* LEFT: Intro */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-600 to-blue-800 text-white min-h-screen">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-lg">
            K
          </div>
          <div>
            <p className="font-semibold text-lg leading-none">Klaro</p>
            <p className="text-xs text-blue-100 mt-0.5">Enterprise Workspace</p>
          </div>
        </div>

        <div className="space-y-8 max-w-md">
          <div>
            <h1 className="text-4xl font-bold tracking-tight leading-tight">
              Start tracking today.
            </h1>
            <p className="text-blue-100 mt-4 text-lg">
              Join thousands of teams using Klaro to ship faster and stay
              organized.
            </p>
          </div>

          <div className="space-y-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex gap-3">
                  <div className="h-10 w-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{feature.title}</p>
                    <p className="text-sm text-blue-100 mt-0.5">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-blue-100">
          <CheckCircle2 className="h-4 w-4" />
          <span>Built with Next.js, Prisma, and Supabase</span>
        </div>
      </div>

      {/* RIGHT: Auth */}
      <div className="flex items-center justify-center p-6 lg:p-12 min-h-screen">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
              K
            </div>
            <div>
              <p className="font-semibold text-lg leading-none">Klaro</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Enterprise Workspace
              </p>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-md border border-slate-200/70 rounded-2xl shadow-lg p-8">
            <h1 className="text-2xl font-semibold text-slate-900">
              Create account
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Start tracking your tasks today
            </p>

            <form action={formAction} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="At least 6 characters"
                />
              </div>

              {state.error && (
                <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                  {state.error}
                </p>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                {isPending ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <p className="text-sm text-slate-500 mt-6 text-center">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}